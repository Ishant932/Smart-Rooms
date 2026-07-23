import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Search, PlusCircle, Menu, X, User, LayoutDashboard, LogOut,
  Gamepad2, Scale, FileText, Users, ChevronDown, Building2, Heart,
  GraduationCap, BedDouble, DoorOpen, BookOpen, ClipboardList, ArrowRight,
  Wallet, Settings, Wrench,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import NavDropdown, { MobileNavAccordion, NavDropdownPanel } from './NavDropdown';

const dropdownMenus = [
  {
    id: 'houses',
    label: 'Houses & Flats',
    icon: Building2,
    accent: 'from-cyan-500 to-blue-600',
    description: 'Flats & shared rooms across Jaipur',
    footer: { label: 'Browse all properties', to: '/rooms' },
    items: [
      { to: '/rooms?type=shared-room', label: 'One Room Set', desc: 'Affordable single rooms with kitchen', icon: BedDouble, color: 'from-cyan-100 to-sky-50' },
      { to: '/rooms?type=shared-room&bedrooms=2', label: 'Two Room Set', desc: 'Spacious shared setups for students', icon: DoorOpen, color: 'from-blue-100 to-cyan-50' },
      { to: '/rooms?type=flat&bedrooms=1', label: '1 BHK Flats', desc: 'Independent flats near colleges', icon: Building2, color: 'from-teal-100 to-emerald-50' },
      { to: '/rooms?type=flat&bedrooms=2', label: '2 BHK Flats', desc: 'Family & group friendly apartments', icon: Home, color: 'from-indigo-100 to-violet-50' },
    ],
  },
  {
    id: 'pg',
    label: 'PG / Hostel',
    icon: GraduationCap,
    accent: 'from-violet-500 to-purple-600',
    description: 'Verified student accommodations',
    footer: { label: 'Explore all PG listings', to: '/rooms?type=pg-boys' },
    items: [
      { to: '/rooms?type=pg-boys', label: 'Boys PG', desc: 'Safe hostels with meals & WiFi', icon: Users, color: 'from-blue-100 to-indigo-50' },
      { to: '/rooms?type=pg-girls', label: 'Girls PG', desc: 'Secure PGs with CCTV & guards', icon: Heart, color: 'from-pink-100 to-rose-50' },
      { to: '/rooms?type=hostel', label: 'Student Hostels', desc: 'Budget stays near campus', icon: BookOpen, color: 'from-purple-100 to-violet-50' },
      { to: '/login?redirect=/dashboard/tenant/pg', label: 'Browse PG Listings', desc: 'View verified PGs — chat to connect', icon: ClipboardList, color: 'from-amber-100 to-orange-50' },
    ],
  },
  {
    id: 'need',
    label: "People's Need",
    icon: Users,
    accent: 'from-rose-500 to-orange-500',
    description: 'Tell us what you are looking for',
    footer: { label: 'See community needs', to: '/people-need' },
    items: [
      { to: '/people-need', label: 'Overview', desc: 'Browse what others need in Jaipur', icon: Search, color: 'from-rose-100 to-pink-50' },
      { to: '/post-requirement', label: 'Post Requirement', desc: 'Share budget, area & preferences', icon: FileText, color: 'from-orange-100 to-amber-50' },
      { to: '/dashboard/tenant/room-partner', label: 'Room Partners', desc: 'Find roommates to split rent', icon: Users, color: 'from-teal-100 to-cyan-50' },
    ],
  },
];

function NavLink({ to, label, icon: Icon, active }) {
  return (
    <motion.li whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
      <Link
        to={to}
        className={`nav-tab-link group relative flex items-center gap-2 overflow-hidden rounded-full px-3.5 py-2 text-sm font-semibold transition-all ${
          active
            ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 nav-link-active-glow'
            : 'text-gray-700 hover:bg-brand-50 hover:text-brand-700'
        }`}
      >
        <Icon size={15} className={active ? 'text-white' : 'text-brand-500 transition group-hover:scale-110'} />
        {label}
        {!active && (
          <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-brand-400 transition-all group-hover:w-1/2" />
        )}
      </Link>
    </motion.li>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, wallet, logout } = useAuth();
  const { items } = useCompare();
  const scrolled = location.pathname !== '/';

  const dashPath = user?.role === 'admin' ? '/dashboard/admin' : user?.role === 'owner' ? '/dashboard/owner' : '/dashboard/tenant';
  const profilePath = `${dashPath}/profile`;

  const mainLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/rooms', label: 'Browse Rooms', icon: Search },
    { to: '/services', label: 'Smart Services', icon: Wrench },
  ];

  const actionLinks = [
    ...(user?.role === 'owner' || user?.role === 'admin' ? [{ to: '/post', label: 'Post Room', icon: PlusCircle, accent: 'text-emerald-600' }] : []),
    { to: '/post-requirement', label: 'Post Requirement', icon: FileText, accent: 'text-orange-600' },
    { to: '/compare', label: `Compare${items.length ? ` (${items.length})` : ''}`, icon: Scale, accent: 'text-violet-600' },
    ...(user?.role === 'tenant' ? [{ to: '/dashboard/tenant/games', label: 'Play & Earn', icon: Gamepad2, accent: 'text-amber-600' }] : []),
  ];

  const handleDropdownToggle = (id, forceOpen) => {
    setDropdown((prev) => (forceOpen === true ? id : forceOpen === false ? null : prev === id ? null : id));
  };

  const closeDropdown = () => setDropdown(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
    setUserMenuOpen(false);
  };

  const closeMobile = () => {
    setOpen(false);
    setMobileAccordion(null);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-premium shadow-lg shadow-brand-500/8' : 'bg-white/40 backdrop-blur-md'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <motion.div
            whileHover={{ rotate: [0, -8, 8, 0], scale: 1.06 }}
            transition={{ duration: 0.4 }}
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-violet-600 text-lg font-bold text-white shadow-lg shadow-brand-500/35"
          >
            <span className="relative z-10">S</span>
            <motion.span
              className="absolute inset-0 rounded-2xl bg-white/20"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            />
          </motion.div>
          <div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Smart<span className="gradient-text">Roooms</span>
            </span>
            <p className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-600/70 sm:block">
              Jaipur · Zero Brokerage
            </p>
          </div>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {mainLinks.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} label={label} icon={icon} active={location.pathname === to} />
          ))}

          {dropdownMenus.map((menu) => (
            <li key={menu.id}>
              <NavDropdown
                menu={menu}
                isOpen={dropdown === menu.id}
                onToggle={handleDropdownToggle}
                onClose={closeDropdown}
              />
            </li>
          ))}

          {actionLinks.map(({ to, label, icon: Icon, accent }) => (
            <NavLink key={to} to={to} label={label} icon={Icon} active={location.pathname === to} />
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <div className="flex items-center gap-2">
              {wallet && (
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  className="rounded-full bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1.5 text-xs font-bold text-amber-800 ring-1 ring-amber-200/80"
                >
                  {wallet.points} pts · ₹{wallet.balance}
                </motion.span>
              )}

              <div className="relative">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-brand-100 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-violet-500 text-xs font-bold text-white">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                  <ChevronDown size={14} className={`text-gray-400 transition ${userMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {userMenuOpen && (
                  <button type="button" className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} aria-label="Close menu" />
                )}
                <AnimatePresence>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] z-50">
                      <NavDropdownPanel
                        menu={{
                          id: 'user',
                          label: user.name,
                          icon: User,
                          accent: 'from-brand-500 to-violet-600',
                          description: `${user.role} account · SmartRoooms`,
                          items: [
                            { to: profilePath, label: 'My Profile', desc: 'Edit name, phone & details', icon: Settings, color: 'from-brand-100 to-cyan-50' },
                            { to: dashPath, label: 'Dashboard', desc: 'Wallet, listings & more', icon: LayoutDashboard, color: 'from-violet-100 to-purple-50' },
                            ...(user.role === 'tenant' ? [{ to: '/dashboard/tenant/wallet', label: 'Wallet & Points', desc: 'Balance, rewards & referrals', icon: Wallet, color: 'from-amber-100 to-orange-50' }] : []),
                          ],
                          footer: { label: 'Logout from account', action: handleLogout },
                        }}
                        onClose={() => setUserMenuOpen(false)}
                        align="right"
                      />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/90 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-brand-300 hover:text-brand-700">
                <User size={16} /> Login
              </Link>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link to="/signup" className="flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-500 via-brand-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30">
                  Sign Up <ArrowRight size={14} />
                </Link>
              </motion.div>
            </>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className="rounded-xl p-2 text-gray-600 ring-1 ring-gray-200/80 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </motion.button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-brand-100/80 bg-gradient-to-b from-white to-brand-50/30 lg:hidden"
          >
            <div className="flex flex-col gap-3 p-4">
              <div className="grid gap-2">
                {mainLinks.map(({ to, label, icon: Icon }, i) => (
                  <motion.div key={to} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link to={to} onClick={closeMobile} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100">
                      <Icon size={18} className="text-brand-500" /> <span className="font-semibold text-gray-800">{label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <p className="px-1 text-[10px] font-bold uppercase tracking-widest text-brand-600">Categories</p>
              {dropdownMenus.map((menu, i) => (
                <motion.div key={menu.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                  <MobileNavAccordion
                    menu={menu}
                    isOpen={mobileAccordion === menu.id}
                    onToggle={(id) => setMobileAccordion((prev) => (prev === id ? null : id))}
                    onNavigate={closeMobile}
                  />
                </motion.div>
              ))}

              <p className="px-1 text-[10px] font-bold uppercase tracking-widest text-brand-600">Quick Actions</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {actionLinks.map(({ to, label, icon: Icon }, i) => (
                  <motion.div key={to} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.04 }}>
                    <Link to={to} onClick={closeMobile} className="flex items-center gap-2 rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:border-brand-200">
                      <Icon size={16} className="text-brand-500" /> {label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {user ? (
                <div className="mt-2 space-y-2 border-t border-brand-100 pt-4">
                  <Link to={profilePath} onClick={closeMobile} className="flex items-center gap-3 rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white">
                    <User size={18} /> My Profile
                  </Link>
                  <Link to={dashPath} onClick={closeMobile} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 font-semibold text-brand-600 ring-1 ring-brand-100">
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 hover:bg-red-50">
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-brand-100 pt-4">
                  <Link to="/login" onClick={closeMobile} className="rounded-xl border border-gray-200 py-3 text-center font-semibold">Login</Link>
                  <Link to="/signup" onClick={closeMobile} className="rounded-xl bg-gradient-to-r from-brand-500 to-violet-600 py-3 text-center font-bold text-white">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
