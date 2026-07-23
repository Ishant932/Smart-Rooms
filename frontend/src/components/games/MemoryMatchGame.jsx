import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell';
import { useGameFinish } from '../../hooks/useGameFinish';

const EMOJIS = ['🏠', '🛏️', '🔑', '🪑'];

function buildDeck() {
  return [...EMOJIS, ...EMOJIS]
    .sort(() => Math.random() - 0.5)
    .map((e, i) => ({ id: i, emoji: e }));
}

export default function MemoryMatchGame() {
  const { result, finish, reset } = useGameFinish();
  const [gameKey, setGameKey] = useState(0);
  const deck = useMemo(() => buildDeck(), [gameKey]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  const flip = (id, emoji) => {
    if (done || flipped.length >= 2 || flipped.includes(id) || matched.includes(emoji)) return;
    const next = [...flipped, id];
    setFlipped(next);
    if (next.length === 2) {
      const a = deck.find((c) => c.id === next[0]);
      const b = deck.find((c) => c.id === next[1]);
      const newMoves = moves + 1;
      setMoves(newMoves);
      if (a?.emoji === b?.emoji) {
        setMatched((m) => {
          const nm = [...m, a.emoji];
          if (nm.length >= EMOJIS.length) {
            setDone(true);
            finish('memory-match', Math.max(10, 50 - newMoves * 5));
          }
          return nm;
        });
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 600);
      }
    }
  };

  const restart = () => {
    reset();
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setDone(false);
    setGameKey((k) => k + 1);
  };

  return (
    <GameShell title="Room Memory" emoji="🧠" subtitle="Match pairs with fewer moves!" gradient="from-teal-600 to-emerald-900" delay={0.25} pointsHint="2–6 pts">
      <p className="mb-2 text-center text-sm">Moves: {moves}</p>
      <div className="grid grid-cols-4 gap-2">
        {deck.map((c) => {
          const show = flipped.includes(c.id) || matched.includes(c.emoji);
          return (
            <motion.button
              key={`${gameKey}-${c.id}`}
              type="button"
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => flip(c.id, c.emoji)}
              className="flex aspect-square items-center justify-center rounded-xl bg-white/20 text-2xl backdrop-blur"
            >
              {show ? c.emoji : '?'}
            </motion.button>
          );
        })}
      </div>
      {result && (
        <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-3 text-center font-bold">+{result.pointsEarned} pts!</motion.p>
      )}
      {(done || result) && (
        <button type="button" onClick={restart} className="mt-2 w-full rounded-lg bg-white/20 py-1 text-sm">Play Again</button>
      )}
    </GameShell>
  );
}
