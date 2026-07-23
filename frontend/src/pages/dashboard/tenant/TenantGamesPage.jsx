import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Trophy, Sparkles, Zap, Star, Target, Flame, Crown } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import CricketGame from '../../../components/games/CricketGame';
import CakeCutGame from '../../../components/games/CakeCutGame';
import RoomRunner3D from '../../../components/games/RoomRunner3D';
import SpinWheelGame from '../../../components/games/SpinWheelGame';
import TapRaceGame from '../../../components/games/TapRaceGame';
import MemoryMatchGame from '../../../components/games/MemoryMatchGame';
import DiceLuckGame from '../../../components/games/DiceLuckGame';
import ColorMatchGame from '../../../components/games/ColorMatchGame';
import NumberGuessGame from '../../../components/games/NumberGuessGame';
import ReactionTimeGame from '../../../components/games/ReactionTimeGame';
import CoinFlipGame from '../../../components/games/CoinFlipGame';
import { getLeaderboard } from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import { PulseGlow } from '../../../components/animations';

const TABS = [
  { id: 'all', label: 'All Games', icon: Gamepad2, color: 'from-brand-500 to-violet-600' },
  { id: 'classic', label: 'Classic', icon: Star, color: 'from-amber-500 to-orange-600' },
  { id: 'quick', label: 'Quick Earn', icon: Zap, color: 'from-emerald-500 to-teal-600' },
];

const GAME_INFO = {
  classic: [
    { name: 'Room Runner 3D', pts: '6–28 pts', emoji: '🏃' },
    { name: 'Cricket', pts: '4–18 pts', emoji: '🏏' },
    { name: 'Cake Cut', pts: '5–22 pts', emoji: '🎂' },
  ],
  quick: [
    { name: 'Spin Wheel', pts: '1–5 pts', emoji: '🎡' },
    { name: 'Tap Race', pts: '1–4 pts', emoji: '👆' },
    { name: 'Memory Match', pts: '2–6 pts', emoji: '🧠' },
    { name: 'Dice Luck', pts: '1–3 pts', emoji: '🎲' },
    { name: 'Color Match', pts: '2–5 pts', emoji: '🎨' },
    { name: 'Number Guess', pts: '2–8 pts', emoji: '🔢' },
    { name: 'Reaction Time', pts: '1–6 pts', emoji: '⚡' },
    { name: 'Coin Flip', pts: '1–4 pts', emoji: '🪙' },
  ],
};

function GameSection({ title, subtitle, children, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-8"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </motion.section>
  );
}

export default function TenantGamesPage() {
  const { wallet } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [tab, setTab] = useState('all');

  useEffect(() => { getLeaderboard().then(setLeaderboard).catch(() => {}); }, []);

  const showClassic = tab === 'all' || tab === 'classic';
  const showQuick = tab === 'all' || tab === 'quick';

  return (
    <DashboardLayout role="tenant" title="Play & Earn Points">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 p-6 text-white shadow-2xl"
      >
        <motion.div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 4 }}
        />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <motion.h2 animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="flex items-center gap-2 text-2xl font-bold">
              <Sparkles size={24} /> Game Zone — 11 Mini Games
            </motion.h2>
            <p className="mt-2 max-w-xl text-sm text-white/90">
              Classic: up to <strong>28 pts</strong> · Quick games: <strong>1–8 pts</strong> · Redeem <strong>500 pts = ₹50</strong> off rent
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Daily play bonus', 'Leaderboard ranks', 'Zero cost to play'].map((tag) => (
                <span key={tag} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <PulseGlow>
              <div className="rounded-2xl bg-white/20 px-5 py-3 text-center backdrop-blur ring-1 ring-white/30">
                <p className="text-xs text-white/80">Your Points</p>
                <p className="text-2xl font-extrabold">{wallet?.points || 0}</p>
              </div>
            </PulseGlow>
            <div className="rounded-2xl bg-white/20 px-5 py-3 text-center backdrop-blur ring-1 ring-white/30">
              <p className="text-xs text-white/80">Games</p>
              <p className="text-2xl font-extrabold">11</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Target, label: 'Classic Games', value: '3', sub: 'High reward' },
          { icon: Flame, label: 'Quick Earn', value: '8', sub: 'Fast points' },
          { icon: Crown, label: 'Rent Discount', value: '₹50', sub: 'At 500 pts' },
        ].map(({ icon: Icon, label, value, sub }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-gray-100"
          >
            <Icon className="text-brand-500" size={22} />
            <p className="mt-2 text-xs font-medium text-gray-500">{label}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-brand-600">{sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map(({ id, label, icon: Icon, color }) => (
          <motion.button
            key={id}
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              tab === id
                ? `bg-gradient-to-r ${color} text-white shadow-lg`
                : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-brand-300'
            }`}
          >
            <Icon size={16} /> {label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
          {showClassic && (
            <GameSection title="Classic Games" subtitle="Bigger scores = bigger rewards — perfect for dedicated players">
              <motion.div layout className="md:col-span-2 xl:col-span-3 overflow-hidden rounded-3xl ring-2 ring-brand-100 shadow-xl">
                <RoomRunner3D />
              </motion.div>
              <motion.div layout whileHover={{ y: -6 }} className="game-card"><CricketGame /></motion.div>
              <motion.div layout whileHover={{ y: -6 }} className="game-card"><CakeCutGame /></motion.div>
            </GameSection>
          )}

          {showQuick && (
            <GameSection title="Quick Earn" subtitle="Short games, steady points — play between classes!" delay={0.1}>
              <motion.div layout whileHover={{ y: -6 }} className="game-card"><SpinWheelGame /></motion.div>
              <motion.div layout whileHover={{ y: -6 }} className="game-card"><TapRaceGame /></motion.div>
              <motion.div layout whileHover={{ y: -6 }} className="game-card"><MemoryMatchGame /></motion.div>
              <motion.div layout whileHover={{ y: -6 }} className="game-card"><DiceLuckGame /></motion.div>
              <motion.div layout whileHover={{ y: -6, rotate: 1 }} className="game-card"><ColorMatchGame /></motion.div>
              <motion.div layout whileHover={{ y: -6, rotate: -1 }} className="game-card"><NumberGuessGame /></motion.div>
              <motion.div layout whileHover={{ y: -6 }} className="game-card"><ReactionTimeGame /></motion.div>
              <motion.div layout whileHover={{ y: -6, rotate: 1 }} className="game-card"><CoinFlipGame /></motion.div>
            </GameSection>
          )}

          <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {(tab === 'quick' ? GAME_INFO.quick : tab === 'classic' ? GAME_INFO.classic : [...GAME_INFO.classic, ...GAME_INFO.quick]).map((g, i) => (
              <motion.div
                key={g.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 p-3 ring-1 ring-brand-100"
              >
                <span className="text-2xl">{g.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{g.name}</p>
                  <p className="text-xs text-brand-600">{g.pts}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-indigo-950 p-6 text-white shadow-2xl"
      >
        <h3 className="flex items-center gap-2 text-lg font-bold">
          <Trophy className="text-amber-400" size={22} /> Top Players
        </h3>
        {leaderboard.length === 0 ? (
          <p className="mt-4 text-sm text-indigo-200">Play any game to appear on the leaderboard!</p>
        ) : (
          <div className="mt-4 space-y-2">
            {leaderboard.map((entry, i) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.08)' }}
                className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
              >
                <span className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    i === 0 ? 'bg-amber-400 text-gray-900' : i === 1 ? 'bg-gray-300 text-gray-800' : i === 2 ? 'bg-orange-400 text-white' : 'bg-white/20'
                  }`}>
                    {i === 0 ? '👑' : i + 1}
                  </span>
                  {entry.name}
                </span>
                <span className="font-bold text-amber-300">{entry.totalPoints} pts</span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
