import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell';
import { useGameFinish } from '../../hooks/useGameFinish';

export default function ReactionTimeGame() {
  const { result, finish, reset } = useGameFinish();
  const [phase, setPhase] = useState('idle');
  const [message, setMessage] = useState('Tap Start — wait for green, then click fast!');
  const timerRef = useRef(null);
  const startRef = useRef(0);

  const start = () => {
    reset();
    setPhase('waiting');
    setMessage('Wait for green…');
    const delay = 1500 + Math.random() * 2500;
    timerRef.current = setTimeout(() => {
      startRef.current = Date.now();
      setPhase('go');
      setMessage('CLICK NOW!');
    }, delay);
  };

  const click = () => {
    if (phase === 'waiting') {
      clearTimeout(timerRef.current);
      setPhase('idle');
      setMessage('Too early! Try again.');
      finish('reaction-time', 5);
      return;
    }
    if (phase !== 'go') return;
    const ms = Date.now() - startRef.current;
    setPhase('done');
    setMessage(`${ms} ms reaction!`);
    finish('reaction-time', Math.max(10, 500 - ms));
  };

  const bg = phase === 'go' ? 'from-emerald-500 to-green-700' : phase === 'waiting' ? 'from-amber-500 to-orange-700' : 'from-rose-600 to-pink-800';

  return (
    <GameShell title="Reaction Time" emoji="⚡" subtitle="Click when screen turns green" gradient={bg} delay={0.25} pointsHint="1–6 pts">
      <div className="text-center">
        <motion.button
          type="button"
          onClick={phase === 'idle' || phase === 'done' ? start : click}
          whileTap={{ scale: 0.92 }}
          animate={phase === 'go' ? { scale: [1, 1.06, 1] } : {}}
          transition={phase === 'go' ? { repeat: Infinity, duration: 0.4 } : {}}
          className="mx-auto flex h-32 w-full max-w-xs items-center justify-center rounded-2xl bg-white/15 text-lg font-bold ring-4 ring-white/25 backdrop-blur"
        >
          {phase === 'idle' || phase === 'done' ? 'START' : phase === 'waiting' ? '…' : 'TAP!'}
        </motion.button>
        <motion.p key={message} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm font-medium">{message}</motion.p>
        {result && phase === 'done' && <motion.p initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="mt-2 font-bold">+{result.pointsEarned} pts</motion.p>}
      </div>
    </GameShell>
  );
}
