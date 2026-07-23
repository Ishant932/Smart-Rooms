import { useState } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell';
import { useGameFinish } from '../../hooks/useGameFinish';

export default function DiceLuckGame() {
  const { result, finish, reset } = useGameFinish();
  const [rolls, setRolls] = useState([]);
  const [left, setLeft] = useState(3);

  const roll = () => {
    if (left <= 0 || result) return;
    const v = Math.floor(Math.random() * 6) + 1;
    const next = [...rolls, v];
    setRolls(next);
    const rem = left - 1;
    setLeft(rem);
    if (rem === 0) finish('dice-luck', next.reduce((a, b) => a + b, 0));
  };

  const again = () => { reset(); setRolls([]); setLeft(3); };

  return (
    <GameShell title="Lucky Dice" emoji="🎲" subtitle="Roll 3 dice — low stakes fun!" gradient="from-orange-600 to-red-800" delay={0.3} pointsHint="1–3 pts">
      <div className="flex justify-center gap-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={rolls[i] ? { rotate: [0, 360], scale: [1, 1.2, 1] } : {}}
            className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-2xl font-black text-orange-700 shadow-lg"
          >
            {rolls[i] || '?'}
          </motion.div>
        ))}
      </div>
      {!result ? (
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={roll} disabled={left <= 0} className="mt-4 w-full rounded-xl bg-white py-2.5 font-bold text-orange-700 disabled:opacity-50">
          Roll ({left} left)
        </motion.button>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
          <p className="font-bold">+{result.pointsEarned} pts!</p>
          <button type="button" onClick={again} className="mt-2 rounded-full bg-white/20 px-4 py-1 text-sm">Again</button>
        </motion.div>
      )}
    </GameShell>
  );
}
