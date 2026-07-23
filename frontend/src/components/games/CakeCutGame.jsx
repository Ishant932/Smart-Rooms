import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { playGame } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function CakeCutGame() {
  const { setWallet } = useAuth();
  const [slices, setSlices] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [result, setResult] = useState(null);

  const slicesRef = useRef(0);

  const start = () => {
    setSlices(0);
    slicesRef.current = 0;
    setResult(null);
    setPlaying(true);
    setTimeLeft(10);
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setPlaying(false);
          finishGame(slicesRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const cut = () => {
    if (!playing) return;
    slicesRef.current += 1;
    setSlices(slicesRef.current);
  };

  const finishGame = async (finalSlices) => {
    try {
      const data = await playGame('cake-cut', finalSlices * 10);
      setResult(data);
      setWallet((w) => ({ ...w, points: data.totalPoints }));
    } catch {
      setResult({ pointsEarned: 0, message: 'Error saving score' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl bg-gradient-to-br from-pink-500 to-rose-700 p-6 text-white shadow-xl"
    >
      <h3 className="text-xl font-bold">🎂 Cake Cut Game</h3>
      <p className="mt-1 text-sm text-pink-100">Cut as many slices in 10 seconds!</p>

      <div className="my-6 flex flex-col items-center">
        <motion.div
          animate={playing ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
          onClick={cut}
          className={`relative flex h-40 w-40 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 text-6xl shadow-inner ${playing ? 'scale-105' : ''}`}
        >
          🎂
          {playing && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity }}
              className="absolute inset-0 rounded-full border-4 border-dashed border-white/50"
            />
          )}
        </motion.div>
        <p className="mt-4 text-3xl font-bold">{slices} slices</p>
        {playing && <p className="text-lg font-semibold">{timeLeft}s left</p>}
      </div>

      {!playing && !result && (
        <button onClick={start} className="w-full rounded-xl bg-white py-3 font-bold text-pink-600 shadow-lg">
          Start Cutting!
        </button>
      )}

      {result && (
        <div className="text-center">
          <p className="text-lg font-bold">+{result.pointsEarned} points!</p>
          <button onClick={start} className="mt-3 rounded-full bg-white/20 px-6 py-2 text-sm font-semibold">
            Play Again
          </button>
        </div>
      )}
    </motion.div>
  );
}
