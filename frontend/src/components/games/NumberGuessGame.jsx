import { useState } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell';
import { useGameFinish } from '../../hooks/useGameFinish';

export default function NumberGuessGame() {
  const { result, finish, reset } = useGameFinish();
  const [target] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [guess, setGuess] = useState('');
  const [hint, setHint] = useState('');
  const [tries, setTries] = useState(0);
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (done) return;
    const n = Number(guess);
    if (!n || n < 1 || n > 10) {
      setHint('Pick a number between 1 and 10');
      return;
    }
    const next = tries + 1;
    setTries(next);
    if (n === target) {
      setDone(true);
      setHint('Correct!');
      finish('number-guess', Math.max(10, 100 - next * 15));
    } else {
      setHint(n < target ? 'Higher ↑' : 'Lower ↓');
      if (next >= 5) {
        setDone(true);
        finish('number-guess', 20);
      }
    }
  };

  const restart = () => {
    reset();
    setGuess('');
    setHint('');
    setTries(0);
    setDone(false);
    window.location.reload();
  };

  return (
    <GameShell title="Number Guess" emoji="🔢" subtitle="Guess 1–10 in 5 tries" gradient="from-indigo-600 to-blue-800" delay={0.15} pointsHint="2–8 pts">
      <form onSubmit={submit} className="text-center">
        <motion.input
          animate={!done ? { scale: [1, 1.02, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          type="number"
          min={1}
          max={10}
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={done}
          className="mx-auto w-24 rounded-xl border-2 border-white/30 bg-white/10 px-3 py-2 text-center text-2xl font-bold text-white backdrop-blur"
        />
        {hint && (
          <motion.p initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-3 font-semibold">{hint}</motion.p>
        )}
        {!done && (
          <motion.button whileTap={{ scale: 0.95 }} type="submit" className="mt-4 rounded-full bg-white/20 px-6 py-2 text-sm font-bold">Guess</motion.button>
        )}
        {result && (
          <motion.p initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mt-3 font-bold">+{result.pointsEarned} pts</motion.p>
        )}
        {done && <button type="button" onClick={restart} className="mt-2 text-sm underline opacity-80">Play again</button>}
      </form>
    </GameShell>
  );
}
