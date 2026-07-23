import { useState } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell';
import { useGameFinish } from '../../hooks/useGameFinish';

export default function CoinFlipGame() {
  const { result, finish, reset } = useGameFinish();
  const [pick, setPick] = useState(null);
  const [flipping, setFlipping] = useState(false);
  const [outcome, setOutcome] = useState(null);

  const flip = (choice) => {
    if (flipping) return;
    reset();
    setPick(choice);
    setFlipping(true);
    setOutcome(null);
    setTimeout(() => {
      const side = Math.random() > 0.5 ? 'heads' : 'tails';
      setOutcome(side);
      setFlipping(false);
      finish('coin-flip', side === choice ? 80 : 20);
    }, 1200);
  };

  return (
    <GameShell title="Coin Flip" emoji="🪙" subtitle="Heads or tails — double luck!" gradient="from-yellow-600 to-amber-800" delay={0.3} pointsHint="1–4 pts">
      <div className="text-center">
        <motion.div
          animate={flipping ? { rotateY: [0, 360, 720, 1080] } : {}}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 text-4xl shadow-xl ring-4 ring-white/30"
        >
          {flipping ? '🪙' : outcome ? (outcome === 'heads' ? '👑' : '🦅') : '🪙'}
        </motion.div>
        {outcome && pick && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 font-bold">
            {outcome === pick ? 'You win!' : `It was ${outcome}`}
          </motion.p>
        )}
        {result && <motion.p initial={{ y: 10 }} animate={{ y: 0 }} className="mt-2 font-bold">+{result.pointsEarned} pts</motion.p>}
        <div className="mt-4 flex justify-center gap-3">
          {['heads', 'tails'].map((side) => (
            <motion.button
              key={side}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={flipping}
              onClick={() => flip(side)}
              className="rounded-full bg-white/20 px-5 py-2 text-sm font-bold capitalize disabled:opacity-50"
            >
              {side}
            </motion.button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
