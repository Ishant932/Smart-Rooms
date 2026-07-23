import { useState } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell';
import { useGameFinish } from '../../hooks/useGameFinish';

const SEGMENTS = [2, 4, 6, 8, 10, 12, 3, 5];

export default function SpinWheelGame() {
  const { result, finish, reset } = useGameFinish();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spin = async () => {
    if (spinning || result) return;
    setSpinning(true);
    const idx = Math.floor(Math.random() * SEGMENTS.length);
    const turns = 4 + Math.random() * 2;
    const deg = turns * 360 + idx * (360 / SEGMENTS.length);
    setRotation((r) => r + deg);
    setTimeout(async () => {
      setSpinning(false);
      await finish('spin-wheel', SEGMENTS[idx] * 10);
    }, 2800);
  };

  return (
    <GameShell title="Spin Wheel" emoji="🎡" subtitle="Spin for quick low points!" gradient="from-violet-600 to-purple-900" delay={0.15} pointsHint="1–3 pts">
      <div className="flex flex-col items-center">
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 2.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative flex h-36 w-36 items-center justify-center rounded-full border-4 border-white/40 bg-gradient-to-br from-indigo-400 to-purple-600 text-4xl shadow-inner"
        >
          🎯
        </motion.div>
        {!result ? (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={spin}
            disabled={spinning}
            className="mt-4 rounded-xl bg-white px-6 py-2.5 font-bold text-purple-700 shadow-lg disabled:opacity-50"
          >
            {spinning ? 'Spinning…' : 'SPIN!'}
          </motion.button>
        ) : (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 text-center">
            <p className="text-lg font-bold">+{result.pointsEarned} pts!</p>
            <button type="button" onClick={() => { reset(); setRotation(0); }} className="mt-2 rounded-full bg-white/20 px-4 py-1 text-sm">Again</button>
          </motion.div>
        )}
      </div>
    </GameShell>
  );
}
