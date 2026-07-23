import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Trophy, Sparkles, Zap, Crown, Filter } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import SpinWheelGame from '../../../components/games/SpinWheelGame';
import TapRaceGame from '../../../components/games/TapRaceGame';
import MemoryMatchGame from '../../../components/games/MemoryMatchGame';
import DiceLuckGame from '../../../components/games/DiceLuckGame';
import ReactionTimeGame from '../../../components/games/ReactionTimeGame';
import CoinFlipGame from '../../../components/games/CoinFlipGame';
import { getLeaderboard } from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import { PulseGlow } from '../../../components/animations';

const GAMES = [
  { id: 'spin-wheel', name: 'Spin Wheel', tag: 'luck', speed: 'instant', pts: '1–3', Component: SpinWheelGame },
  { id: 'tap-race', name: 'Tap Race', tag: 'skill', speed: 'fast', pts: '1–2', Component: TapRaceGame },
  { id: 'memory-match', name: 'Memory Match', tag: 'skill', speed: 'medium', pts: '1–3', Component: MemoryMatchGame },
  { id: 'dice-luck', name: 'Lucky Dice', tag: 'luck', speed: 'instant', pts: '1–2', Component: DiceLuckGame },
  { id: 'reaction-time', name: 'Reaction', tag: 'skill', speed: 'fast', pts: '1–3', Component: ReactionTimeGame },
  { id: 'coin-flip', name: 'Coin Flip', tag: 'luck', speed: 'instant', pts: '1–2', Component: CoinFlipGame },
];

export default function TenantGamesPage() {
  const { wallet } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [tag, setTag] = useState('all');
  const [speed, setSpeed] = useState('all');

  useEffect(() => { getLeaderboard().then(setLeaderboard).catch(() => {}); }, []);

  const filtered = useMemo(() => GAMES.filter((g) => {
    if (tag !== 'all' && g.tag !== tag) return false;
    if (speed !== 'all' && g.speed !== speed) return false;
    return true;
  }), [tag, speed]);

  return (
    <DashboardLayout role="tenant" title="Play & Earn Points">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6 overflow-hidden rounded-3xl crazy-mesh p-6 text-white shadow-2xl"
      >
        <motion.div
          className="pointer-events-none absolute -right-8 top-0 h-48 w-48 rounded-full bg-cyan-400/30 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              <Sparkles className="text-amber-300" /> Arcade Zone — 6 Games
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/90">
              Fully animated mini games with <strong>tiny rewards</strong> (1–3 pts). Stack points slowly — redeem <strong>500 pts = ₹50</strong> rent credit.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Low stakes', 'High vibes', 'Daily play'].map((t) => (
                <span key={t} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">{t}</span>
              ))}
            </div>
          </div>
          <PulseGlow>
            <div className="rounded-2xl bg-white/15 px-5 py-3 text-center ring-1 ring-white/30 backdrop-blur">
              <p className="text-xs text-white/80">Your Points</p>
              <p className="text-3xl font-black">{wallet?.points || 0}</p>
            </div>
          </PulseGlow>
        </div>
      </motion.div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Filter size={16} className="text-gray-400" />
        {[
          { k: 'all', label: 'All' },
          { k: 'luck', label: 'Luck' },
          { k: 'skill', label: 'Skill' },
        ].map(({ k, label }) => (
          <button
            key={k}
            type="button"
            onClick={() => setTag(k)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${tag === k ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200'}`}
          >
            {label}
          </button>
        ))}
        <span className="mx-1 text-gray-300">|</span>
        {[
          { k: 'all', label: 'Any speed' },
          { k: 'instant', label: 'Instant' },
          { k: 'fast', label: 'Fast' },
          { k: 'medium', label: 'Medium' },
        ].map(({ k, label }) => (
          <button
            key={k}
            type="button"
            onClick={() => setSpeed(k)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${speed === k ? 'bg-violet-500 text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Gamepad2, label: 'Games', value: '6' },
          { icon: Zap, label: 'Typical win', value: '1–3 pts' },
          { icon: Crown, label: 'Redeem', value: '500→₹50' },
        ].map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
          >
            <div className="rounded-xl bg-brand-50 p-2 text-brand-600"><Icon size={18} /></div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="font-bold text-gray-900">{value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(({ id, Component }) => (
            <motion.div
              key={id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <Component />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      {!filtered.length && (
        <p className="mt-6 rounded-2xl bg-white p-8 text-center text-gray-500">No games match these filters.</p>
      )}

      <div className="mt-10 rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100">
        <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900"><Trophy className="text-amber-500" size={18} /> Leaderboard</h3>
        <div className="space-y-2">
          {leaderboard.slice(0, 8).map((row, i) => (
            <div key={row.userId} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm">
              <span className="font-medium text-gray-800">#{i + 1} {row.name}</span>
              <span className="font-bold text-brand-600">{row.totalPoints} pts</span>
            </div>
          ))}
          {!leaderboard.length && <p className="text-sm text-gray-500">Play a game to appear here.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
