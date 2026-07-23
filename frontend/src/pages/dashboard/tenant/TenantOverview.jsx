import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Star, Gamepad2, Building2, Users, Gift, ArrowRight, User, AlertCircle, FileText, MessageCircle } from 'lucide-react';
import { StaggerGrid, AnimatedItem, PulseGlow } from '../../../components/animations';
import DashboardLayout from '../../../components/DashboardLayout';
import StatCard from '../../../components/StatCard';
import { useAuth } from '../../../context/AuthContext';
import { getBookings, getWallet } from '../../../api/client';

export default function TenantOverview() {
  const { user, wallet } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [walletData, setWalletData] = useState(null);

  useEffect(() => {
    getBookings().then(setBookings).catch(() => {});
    getWallet().then(setWalletData).catch(() => {});
  }, []);

  const quickLinks = [
    { to: '/dashboard/tenant/profile', label: 'My Profile', icon: User, desc: 'Edit your details' },
    { to: '/dashboard/tenant/wallet', label: 'Wallet', icon: Wallet, desc: 'Pay rent with balance' },
    { to: '/dashboard/tenant/games', label: 'Play Games', icon: Gamepad2, desc: 'Earn reward points' },
    { to: '/dashboard/tenant/messages', label: 'Chat with Owners', icon: MessageCircle, desc: 'Message property owners' },
    { to: '/dashboard/tenant/pg', label: 'PG / Hostel', icon: Building2, desc: 'Browse PGs — chat with owners' },
    { to: '/post-requirement', label: 'Post Requirement', icon: FileText, desc: 'Tell us what you need' },
    { to: '/dashboard/tenant/room-partner', label: 'Room Partner', icon: Users, desc: 'Find roommates' },
    { to: '/dashboard/tenant/reviews', label: 'Reviews', icon: Star, desc: 'Rate owners & rooms' },
    { to: '/dashboard/tenant/complaints', label: 'Complaints', icon: AlertCircle, desc: 'Report issues' },
    { to: '/dashboard/tenant/referrals', label: 'Refer & Earn', icon: Gift, desc: 'Share code — earn rewards' },
  ];

  return (
    <DashboardLayout role="tenant" title={`Hi, ${user?.name?.split(' ')[0]}! 👋`}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Wallet Balance" value={`₹${wallet?.balance || 0}`} icon={Wallet} delay={0} />
        <StatCard label="Reward Points" value={wallet?.points || 0} icon={Star} color="amber" delay={0.1} />
        <StatCard label="Active Bookings" value={bookings.filter((b) => b.status === 'active').length} icon={Building2} color="green" delay={0.2} />
        <StatCard label="Referral Code" value={wallet?.referralCode || '—'} icon={Gift} color="pink" delay={0.3} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative mt-8 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-500 to-purple-600 p-6 text-white shadow-xl"
      >
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
          style={{ background: 'linear-gradient(90deg, transparent, white, transparent)', width: '50%' }}
        />
        <div className="relative">
          <h2 className="text-lg font-bold">Earn While You Live 🎮</h2>
          <p className="mt-1 text-sm text-white/80">
            11 mini games — classic up to 28 pts, quick games from 1 pt. Redeem 500 pts for ₹50 rent credit!
          </p>
          <PulseGlow className="inline-block">
            <Link to="/dashboard/tenant/games" className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand-600">
              Play Now <ArrowRight size={14} />
            </Link>
          </PulseGlow>
        </div>
      </motion.div>

      <StaggerGrid className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link, i) => (
          <AnimatedItem key={link.to} index={i}>
            <Link to={link.to} className="dash-card glow-border group flex items-center gap-4 rounded-2xl bg-white/90 p-5 shadow-md ring-1 ring-gray-100 backdrop-blur">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white"
              >
                <link.icon size={22} />
              </motion.div>
              <div>
                <p className="font-semibold text-gray-900">{link.label}</p>
                <p className="text-xs text-gray-500">{link.desc}</p>
              </div>
            </Link>
          </AnimatedItem>
        ))}
      </StaggerGrid>

      {bookings.length > 0 && (
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100">
          <h3 className="font-bold text-gray-900">Your Bookings</h3>
          <div className="mt-4 space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="font-medium">{b.roomTitle}</p>
                  <p className="text-sm text-gray-500">₹{b.rentAmount}/mo · {b.type}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{b.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
