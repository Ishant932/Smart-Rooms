import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Building2, BookOpen, Gamepad2, Wallet, AlertCircle, Ticket, TrendingUp,
} from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import DownloadCsvButton from '../../../components/DownloadCsvButton';
import { getAdminAnalytics } from '../../../api/client';

function Bar({ label, value, max, color }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-xs font-medium text-gray-600">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminAnalytics()
      .then(setData)
      .catch(() => setError('Could not load analytics'));
  }, []);

  const summary = data?.summary || {};
  const byType = data?.listingsByType || {};
  const games = data?.gamesById || {};
  const maxType = Math.max(1, ...Object.values(byType));
  const maxGame = Math.max(1, ...Object.values(games));

  const csvRows = [
    { metric: 'tenants', value: summary.tenants },
    { metric: 'owners', value: summary.owners },
    { metric: 'listings', value: summary.listings },
    { metric: 'bookings', value: summary.bookings },
    { metric: 'complaintsOpen', value: summary.complaintsOpen },
    { metric: 'totalPointsIssued', value: summary.totalPointsIssued },
    { metric: 'vouchersActive', value: summary.vouchersActive },
    { metric: 'gameSessions', value: summary.gameSessions },
    ...Object.entries(byType).map(([k, v]) => ({ metric: `listing_${k}`, value: v })),
    ...Object.entries(games).map(([k, v]) => ({ metric: `game_${k}`, value: v })),
  ];

  const cards = [
    { icon: Users, label: 'Tenants', value: summary.tenants, color: 'from-cyan-500 to-blue-600' },
    { icon: Building2, label: 'Owners', value: summary.owners, color: 'from-violet-500 to-purple-600' },
    { icon: BookOpen, label: 'Listings', value: summary.listings, color: 'from-emerald-500 to-teal-600' },
    { icon: Wallet, label: 'Bookings', value: summary.bookings, color: 'from-amber-500 to-orange-600' },
    { icon: AlertCircle, label: 'Open complaints', value: summary.complaintsOpen, color: 'from-rose-500 to-red-600' },
    { icon: Gamepad2, label: 'Game sessions', value: summary.gameSessions, color: 'from-fuchsia-500 to-pink-600' },
    { icon: TrendingUp, label: 'Points issued', value: summary.totalPointsIssued, color: 'from-brand-500 to-cyan-700' },
    { icon: Ticket, label: 'Active vouchers', value: summary.vouchersActive, color: 'from-yellow-500 to-amber-600' },
  ];

  return (
    <DashboardLayout role="admin" title="Complete Analytics">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">Platform snapshot — users, listings, games, vouchers.</p>
        <DownloadCsvButton filename="smartroooms-analytics" rows={csvRows} />
      </div>
      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-2xl bg-gradient-to-br ${color} p-4 text-white shadow-lg`}
          >
            <Icon size={20} className="opacity-90" />
            <p className="mt-3 text-2xl font-extrabold">{value ?? '—'}</p>
            <p className="text-xs font-medium text-white/85">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100">
          <h3 className="mb-4 font-bold text-gray-900">Listings by type</h3>
          {Object.entries(byType).map(([k, v]) => (
            <Bar key={k} label={k} value={v} max={maxType} color="bg-brand-500" />
          ))}
          {!Object.keys(byType).length && <p className="text-sm text-gray-500">No listing data.</p>}
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100">
          <h3 className="mb-4 font-bold text-gray-900">Game plays</h3>
          {Object.entries(games).map(([k, v]) => (
            <Bar key={k} label={k} value={v} max={maxGame} color="bg-violet-500" />
          ))}
          {!Object.keys(games).length && <p className="text-sm text-gray-500">No game sessions yet.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
