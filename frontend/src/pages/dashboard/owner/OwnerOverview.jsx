import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Star, Wallet, BookOpen, Gift, ArrowRight, UserCircle, TrendingUp, MessageCircle } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import StatCard from '../../../components/StatCard';
import { StaggerGrid, AnimatedItem } from '../../../components/animations';
import { useAuth } from '../../../context/AuthContext';
import { getRooms, getBookings } from '../../../api/client';

export default function OwnerOverview() {
  const { user, wallet } = useAuth();
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getRooms().then((d) => setListings(d.rooms.filter((r) => r.owner?.name === user?.name || r.ownerId === user?.id)));
    getBookings().then(setBookings).catch(() => {});
  }, [user]);

  const availableCount = listings.filter((r) => r.listingStatus === 'available').length;

  return (
    <DashboardLayout role="owner" title={`Owner Dashboard — ${user?.name}`}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My Listings" value={listings.length} icon={Home} />
        <StatCard label="Available Now" value={availableCount} icon={TrendingUp} color="green" delay={0.1} />
        <StatCard label="Active Bookings" value={bookings.filter((b) => b.status === 'active').length} icon={BookOpen} color="amber" delay={0.2} />
        <StatCard label="Points" value={wallet?.points || 0} icon={Star} color="purple" delay={0.3} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-8 grid gap-4 sm:grid-cols-2"
      >
        <motion.div whileHover={{ scale: 1.02, y: -4 }}>
          <Link to="/post" className="dash-card glow-border group flex items-center gap-4 rounded-2xl bg-gradient-to-r from-brand-500 to-purple-600 p-6 text-white shadow-xl">
            <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
              <Home size={32} />
            </motion.div>
            <div>
              <p className="font-bold">Post New Room</p>
              <p className="text-sm text-white/80">+40 points on listing</p>
            </div>
            <ArrowRight className="ml-auto transition group-hover:translate-x-2" />
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02, y: -4 }}>
          <Link to="/dashboard/owner/listings" className="dash-card premium-card group flex items-center gap-4 rounded-2xl p-6">
            <Home size={32} className="text-brand-500" />
            <div>
              <p className="font-bold">Manage Listings</p>
              <p className="text-sm text-gray-500">{listings.length} total · {availableCount} available</p>
            </div>
            <ArrowRight className="ml-auto text-gray-400 transition group-hover:translate-x-1 group-hover:text-brand-500" />
          </Link>
        </motion.div>
      </motion.div>

      <StaggerGrid className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { to: '/dashboard/owner/profile', label: 'Profile', icon: UserCircle },
          { to: '/dashboard/owner/wallet', label: 'Wallet', icon: Wallet },
          { to: '/dashboard/owner/messages', label: 'Chat with Tenants', icon: MessageCircle },
          { to: '/dashboard/owner/bookings', label: 'Bookings', icon: BookOpen },
          { to: '/dashboard/owner/reviews', label: 'Reviews', icon: Star },
          { to: '/dashboard/owner/referrals', label: 'Referrals', icon: Gift },
          { to: '/rooms', label: 'Browse Rooms', icon: Home },
        ].map(({ to, label, icon: Icon }, i) => (
          <AnimatedItem key={to} index={i}>
            <Link to={to} className="dash-card flex items-center gap-3 rounded-xl bg-white/90 p-4 text-sm font-semibold text-gray-700 ring-1 ring-gray-100 hover:text-brand-600 hover:ring-brand-200">
              <motion.span whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <Icon size={18} className="text-brand-500" />
              </motion.span>
              {label}
            </Link>
          </AnimatedItem>
        ))}
      </StaggerGrid>

      {bookings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100"
        >
          <h3 className="font-bold">Recent Bookings</h3>
          <div className="mt-4 space-y-3">
            {bookings.slice(0, 5).map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ x: 4 }}
                className="flex justify-between rounded-xl bg-gray-50 p-4"
              >
                <div>
                  <p className="font-medium">{b.tenantName}</p>
                  <p className="text-sm text-gray-500">{b.roomTitle}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{b.rentAmount}</p>
                  <p className="text-xs text-emerald-600">Free booking</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
