import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Building2, Gamepad2, Wallet, Users, Shield,
  GraduationCap, Phone, Mail, ArrowRight, Sparkles,
} from 'lucide-react';

const LOCATIONS = [
  'Malviya Nagar', 'Mansarovar', 'Vaishali Nagar', 'Sodala',
  'Khatipura', 'Jagatpura', 'Gopalpura', 'Vidhyadhar Nagar',
  'Raja Park', 'C-Scheme', 'Tonk Road', 'Sanganer',
];

const COLLEGES = ['MNIT Jaipur', 'JECRC', 'Amity University', 'Poornima', 'Manipal Jaipur', 'IIS University'];

const HIGHLIGHTS = [
  { icon: Shield, label: 'Zero Brokerage', desc: 'Deal directly with owners — no middlemen fees ever' },
  { icon: Wallet, label: 'Smart Wallet', desc: 'Earn points, redeem 500 pts for ₹50 rent credit' },
  { icon: Gamepad2, label: 'Play & Earn', desc: '6 fun mini games with daily reward points' },
  { icon: Users, label: 'Room Partners', desc: 'Split rent with verified students near your college' },
];

export default function SlideTopPanel({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed left-0 right-0 top-0 z-[80] max-h-[85vh] overflow-y-auto bg-white shadow-2xl ring-1 ring-brand-100"
          >
            <div className="bg-gradient-to-br from-brand-600 via-purple-600 to-indigo-800 px-4 py-6 text-white sm:px-8">
              <div className="mx-auto flex max-w-7xl items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-amber-200">
                    <Sparkles size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">About SmartRoooms</span>
                  </div>
                  <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                    Jaipur&apos;s Student-First Room Platform
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                    We connect students and working professionals with verified PGs, hostels, flats & shared rooms
                    across Jaipur — with zero brokerage, wallet rewards, mini games, room partner matching, and
                    admin-backed support. Inspired by the best of OLX, Airbnb & local PG portals, built for Rajasthan.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
                  aria-label="Close panel"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
              <div className="grid gap-8 lg:grid-cols-3">
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-gray-900">
                    <MapPin size={18} className="text-brand-500" /> Popular Locations
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {LOCATIONS.map((area) => (
                      <Link
                        key={area}
                        to={`/rooms?city=Jaipur&location=${encodeURIComponent(area)}`}
                        onClick={onClose}
                        className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 transition hover:bg-brand-500 hover:text-white"
                      >
                        {area}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 font-bold text-gray-900">
                    <GraduationCap size={18} className="text-brand-500" /> Colleges We Serve
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    {COLLEGES.map((c) => (
                      <li key={c} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/rooms?type=shared-room"
                    onClick={onClose}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Find rooms near college <ArrowRight size={14} />
                  </Link>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 font-bold text-gray-900">
                    <Building2 size={18} className="text-brand-500" /> Why Choose Us
                  </h3>
                  <div className="mt-4 space-y-3">
                    {HIGHLIGHTS.map(({ icon: Icon, label, desc }) => (
                      <div key={label} className="flex gap-3 rounded-xl bg-gray-50 p-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{label}</p>
                          <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gradient-to-r from-brand-50 to-purple-50 p-5">
                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                  <a href="mailto:hello@smartroooms.in" className="flex items-center gap-2 hover:text-brand-600">
                    <Mail size={16} className="text-brand-500" /> hello@smartroooms.in
                  </a>
                  <span className="flex items-center gap-2">
                    <Phone size={16} className="text-brand-500" /> +91 98765 43210
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-brand-500" /> Katewa Nagar, Jaipur 302020
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link
                    to="/rooms"
                    onClick={onClose}
                    className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-brand-600"
                  >
                    Browse Rooms
                  </Link>
                  <Link
                    to="/signup"
                    onClick={onClose}
                    className="rounded-full border border-brand-300 px-5 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50"
                  >
                    Sign Up Free
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
