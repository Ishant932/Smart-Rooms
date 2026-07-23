import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell';
import { useGameFinish } from '../../hooks/useGameFinish';

export default function TapRaceGame() {
  const { result, finish, reset } = useGameFinish();
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tapsRef = useRef(0);

  const start = () => {
    reset();
    tapsRef.current = 0;
    setTaps(0);
    setPlaying(true);
    setTimeLeft(5);
    const t = setInterval(() => {
      setTimeLeft((v) => {
        if (v <= 1) {
          clearInterval(t);
          setPlaying(false);
          finish('tap-race', tapsRef.current);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  };

  const tap = () => {
    if (!playing) return;
    tapsRef.current += 1;
    setTaps(tapsRef.current);
  };

  return (
    <GameShell title="Tap Race" emoji="👆" subtitle="Tap fast for 5 seconds!" gradient="from-cyan-600 to-blue-800" delay={0.2} pointsHint="1–2 pts">
      <div className="text-center">
        <motion.button
          type="button"
          onClick={playing ? tap : start}
          whileTap={{ scale: 0.88 }}
          animate={playing ? { scale: [1, 1.05, 1] } : {}}
          transition={playing ? { repeat: Infinity, duration: 0.3 } : {}}
          className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white/20 text-3xl font-black ring-4 ring-white/30 backdrop-blur"
        >
          {playing ? taps : 'GO'}
        </motion.button>
        {playing && <motion.p animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="mt-3 text-lg font-bold">{timeLeft}s</motion.p>}
        {result && !playing && (
          <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-3 font-bold">+{result.pointsEarned} pts · {taps} taps</motion.p>
        )}
        {result && !playing && (
          <button type="button" onClick={start} className="mt-2 rounded-full bg-white/20 px-4 py-1 text-sm">Retry</button>
        )}
      </div>
    </GameShell>
  );
}
