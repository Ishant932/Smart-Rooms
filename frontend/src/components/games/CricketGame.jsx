import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { playGame } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function CricketGame() {
  const { setWallet } = useAuth();
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState(0);
  const [message, setMessage] = useState('Tap RUN to score! 6 balls per over.');
  const [playing, setPlaying] = useState(false);
  const [result, setResult] = useState(null);

  const bat = useCallback(() => {
    if (playing || balls >= 6) return;
    setPlaying(true);
    const outcomes = [0, 1, 2, 4, 6, 'OUT'];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

    setTimeout(() => {
      if (outcome === 'OUT') {
        setMessage(`OUT! Final score: ${score}. Submitting...`);
        finish(score);
      } else {
        const newScore = score + outcome;
        const newBalls = balls + 1;
        setScore(newScore);
        setBalls(newBalls);
        setMessage(outcome === 6 ? 'SIX! 🎉' : outcome === 4 ? 'FOUR! 🔥' : `+${outcome} run(s)`);
        if (newBalls >= 6) finish(newScore);
      }
      setPlaying(false);
    }, 400);
  }, [playing, balls, score]);

  const finish = async (finalScore) => {
    try {
      const data = await playGame('cricket', finalScore);
      setResult(data);
      setWallet((w) => ({ ...w, points: data.totalPoints }));
    } catch {
      setMessage('Could not save score');
    }
  };

  const reset = () => {
    setScore(0);
    setBalls(0);
    setResult(null);
    setMessage('Tap RUN to score! 6 balls per over.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl bg-gradient-to-br from-green-600 to-emerald-800 p-6 text-white shadow-xl"
    >
      <h3 className="text-xl font-bold">🏏 Cricket Mini Game</h3>
      <p className="mt-1 text-sm text-green-100">Score runs and earn points!</p>

      <div className="my-6 flex items-center justify-center gap-8">
        <div className="text-center">
          <p className="text-5xl font-black">{score}</p>
          <p className="text-xs opacity-70">Runs</p>
        </div>
        <div className="text-center">
          <p className="text-5xl font-black">{balls}/6</p>
          <p className="text-xs opacity-70">Balls</p>
        </div>
      </div>

      <p className="mb-4 text-center text-sm">{message}</p>

      {!result ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={bat}
          disabled={playing || balls >= 6}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold text-green-700 shadow-lg disabled:opacity-50"
        >
          RUN
        </motion.button>
      ) : (
        <div className="text-center">
          <p className="text-lg font-bold">+{result.pointsEarned} points earned!</p>
          <button onClick={reset} className="mt-3 rounded-full bg-white/20 px-6 py-2 text-sm font-semibold">
            Play Again
          </button>
        </div>
      )}
    </motion.div>
  );
}
