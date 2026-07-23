import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell';
import { useGameFinish } from '../../hooks/useGameFinish';

const COLORS = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Yellow', hex: '#eab308' },
];

export default function ColorMatchGame() {
  const { result, finish, reset } = useGameFinish();
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState([]);
  const [playing, setPlaying] = useState(false);

  const nextRound = useCallback(() => {
    const t = COLORS[Math.floor(Math.random() * COLORS.length)];
    const opts = [...COLORS].sort(() => Math.random() - 0.5);
    setTarget(t);
    setOptions(opts);
  }, []);

  const start = () => {
    reset();
    setScore(0);
    setRound(0);
    setPlaying(true);
    nextRound();
  };

  const pick = (c) => {
    if (!playing || result) return;
    const correct = c.name === target.name;
    const newScore = score + (correct ? 1 : 0);
    const newRound = round + 1;
    setScore(newScore);
    setRound(newRound);
    if (newRound >= 5) {
      setPlaying(false);
      finish('color-match', newScore * 20);
    } else {
      nextRound();
    }
  };

  return (
    <GameShell title="Color Match" emoji="🎨" subtitle="Pick the named color — 5 rounds!" gradient="from-fuchsia-600 to-pink-900" delay={0.35} pointsHint="2–5 pts">
      {!playing && !result && (
        <motion.button whileHover={{ scale: 1.03 }} onClick={start} className="w-full rounded-xl bg-white py-2.5 font-bold text-pink-700">Start</motion.button>
      )}
      {playing && target && (
        <>
          <motion.p key={target.name} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-3 text-center text-lg font-bold">
            Tap <span style={{ color: target.hex }}>{target.name}</span>
          </motion.p>
          <div className="grid grid-cols-2 gap-2">
            {options.map((c) => (
              <motion.button
                key={c.name}
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => pick(c)}
                style={{ backgroundColor: c.hex }}
                className="h-14 rounded-xl shadow-md ring-2 ring-white/30"
                aria-label={c.name}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-xs opacity-80">Round {round + 1}/5 · Score {score}</p>
        </>
      )}
      {result && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
          <p className="font-bold">+{result.pointsEarned} pts!</p>
          <button type="button" onClick={start} className="mt-2 rounded-full bg-white/20 px-4 py-1 text-sm">Again</button>
        </motion.div>
      )}
    </GameShell>
  );
}
