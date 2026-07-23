import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ThreeDBackground from './ThreeDBackground';
import {
  LayoutDashboard, Wallet, Gamepad2, Users, Star, AlertCircle,
  Building2, BookOpen, LogOut, Menu, X, Gift, Home, UserCircle, FileText, MessageCircle,
  Wrench, MessageSquare, Ticket, BarChart3, UserCog,
} from 'lucide-react';
import { useState } from 'react';

const NAV = {
  tenant: [
    { to: '/dashboard/tenant', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/tenant/profile', label: 'My Profile', icon: UserCircle },
    { to: '/dashboard/tenant/wallet', label: 'Wallet & Points', icon: Wallet },
    { to: '/dashboard/tenant/games', label: 'Play & Earn', icon: Gamepad2 },
    { to: '/dashboard/tenant/pg', label: 'PG / Hostel', icon: Building2 },
    { to: '/dashboard/tenant/services', label: 'Smart Services', icon: Wrench },
    { to: '/dashboard/tenant/messages', label: 'Chat with Owners', icon: MessageCircle },
    { to: '/post-requirement', label: 'Post Requirement', icon: FileText },
    { to: '/dashboard/tenant/room-partner', label: 'Room Partner', icon: Users },
    { to: '/dashboard/tenant/reviews', label: 'Reviews', icon: Star },
    { to: '/dashboard/tenant/complaints', label: 'Complaints', icon: AlertCircle },
    { to: '/dashboard/tenant/feedback', label: 'Feedback', icon: MessageSquare },
    { to: '/dashboard/tenant/referrals', label: 'Referrals', icon: Gift },
  ],
  owner: [
    { to: '/dashboard/owner', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/owner/profile', label: 'My Profile', icon: UserCircle },
    { to: '/dashboard/owner/listings', label: 'My Listings', icon: Home },
    { to: '/dashboard/owner/wallet', label: 'Wallet & Points', icon: Wallet },
    { to: '/dashboard/owner/reviews', label: 'Reviews', icon: Star },
    { to: '/dashboard/owner/messages', label: 'Chat with Tenants', icon: MessageCircle },
    { to: '/dashboard/owner/bookings', label: 'Bookings', icon: BookOpen },
    { to: '/dashboard/owner/referrals', label: 'Referrals', icon: Gift },
    { to: '/dashboard/owner/feedback', label: 'Feedback', icon: MessageSquare },
  ],
  admin: [
    { to: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/dashboard/admin/owners', label: 'Owners', icon: Building2 },
    { to: '/dashboard/admin/tenants', label: 'Tenants', icon: Users },
    { to: '/dashboard/admin/users', label: 'All Users', icon: UserCog },
    { to: '/dashboard/admin/listings', label: 'All Listings', icon: Home },
    { to: '/dashboard/admin/vouchers', label: 'Vouchers', icon: Ticket },
    { to: '/dashboard/admin/requirements', label: 'Requirements', icon: FileText },
    { to: '/dashboard/admin/bookings', label: 'Bookings', icon: BookOpen },
    { to: '/dashboard/admin/complaints', label: 'Complaints', icon: AlertCircle },
    { to: '/dashboard/admin/services', label: 'Smart Services', icon: Wrench },
    { to: '/dashboard/admin/feedback', label: 'Feedback', icon: MessageSquare },
    { to: '/dashboard/admin/transactions', label: 'Revenue', icon: Wallet },
    { to: '/dashboard/admin/profile', label: 'My Profile', icon: UserCircle },
  ],
};

function isNavActive(pathname, to, end) {
  if (end) return pathname === to;
  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function DashboardLayout({ role, title, children }) {
  const { user, wallet, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = NAV[role] || [];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ThreeDBackground variant="dashboard" />
      <div className="relative z-10 flex">
        <motion.aside
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 18 }}
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition lg:static lg:translate-x-0 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col border-r border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/" className="text-lg font-bold">
                  Smart<span className="text-brand-500">Roooms</span>
                </Link>
              </motion.div>
              <button type="button" className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={20} /></button>
            </div>

            <motion.div
              whileHover={{ scale: 1.02, rotate: 0.5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 p-4 text-white shadow-lg"
            >
              <motion.p
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-sm capitalize"
              >
                {user?.role} dashboard
              </motion.p>
              <p className="font-bold truncate">{user?.name}</p>
              {wallet && (
                <div className="mt-3 flex gap-3 text-xs">
                  <motion.span whileHover={{ scale: 1.1 }} className="rounded-lg bg-white/20 px-2 py-1 backdrop-blur">₹{wallet.balance}</motion.span>
                  <motion.span whileHover={{ scale: 1.1 }} className="rounded-lg bg-white/20 px-2 py-1 backdrop-blur">{wallet.points} pts</motion.span>
                </div>
              )}
            </motion.div>

            <nav className="flex-1 space-y-1 overflow-y-auto overscroll-contain">
              {links.map(({ to, label, icon: Icon, end }, i) => {
                const active = isNavActive(location.pathname, to, end);
                return (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        active
                          ? 'text-white shadow-md shadow-brand-500/30'
                          : 'text-gray-600 hover:bg-brand-50 hover:text-brand-600 active:scale-[0.98]'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="dash-nav-pill"
                          className="absolute inset-0 rounded-xl bg-brand-500"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                      <Icon size={18} className="relative shrink-0" />
                      <span className="relative">{label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <Link to="/rooms" className="mb-2 block rounded-xl px-3 py-2 text-center text-xs font-medium text-brand-600 hover:bg-brand-50">
              ← Browse rooms
            </Link>
            <motion.button
              type="button"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-500 hover:bg-red-50"
            >
              <LogOut size={18} /> Logout
            </motion.button>
          </div>
        </motion.aside>

        {mobileOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            aria-label="Close overlay"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div className="relative flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/60 bg-white/80 px-4 py-4 backdrop-blur-xl sm:px-8">
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              className="rounded-lg p-1 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </motion.button>
            <AnimatePresence mode="wait">
              <motion.h1
                key={title}
                initial={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                transition={{ duration: 0.3 }}
                className="truncate text-xl font-bold text-gray-900 sm:text-2xl"
              >
                {title}
              </motion.h1>
            </AnimatePresence>
          </header>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex-1 p-4 sm:p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
