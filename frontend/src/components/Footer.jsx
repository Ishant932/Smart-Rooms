import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, MapPin, Phone, Share2, Globe, MessageCircle,
  Building2, Users, Gamepad2, Shield, GraduationCap,
  Clock, CreditCard, Heart,
} from 'lucide-react';

const TENANT_LINKS = [
  ['Browse All Rooms', '/rooms'],
  ['Smart Services Hub', '/services'],
  ['Boys PG', '/rooms?type=pg-boys'],
  ['Girls PG', '/rooms?type=pg-girls'],
  ['Shared Rooms', '/rooms?type=shared-room'],
  ['Compare Properties', '/compare'],
  ['Post Requirement', '/post-requirement'],
  ['Room Partners', '/dashboard/tenant/room-partner'],
  ['Play & Earn Games', '/dashboard/tenant/games'],
];

const OWNER_LINKS = [
  ['Post Your Room Free', '/post'],
  ['Owner Dashboard', '/dashboard/owner'],
  ['Manage Listings', '/dashboard/owner/listings'],
  ['View Bookings', '/dashboard/owner/bookings'],
  ['Refer & Earn', '/dashboard/owner/referrals'],
  ['Sign Up as Owner', '/signup'],
];

const SUPPORT_LINKS = [
  ['Help Center', '/help'],
  ['Smart Services', '/services'],
  ['Contact Us', '/contact'],
  ['Privacy Policy', '/privacy'],
  ['Terms & Conditions', '/terms'],
  ['Complaints', '/dashboard/tenant/complaints'],
];

const AREAS = [
  'Malviya Nagar', 'Mansarovar', 'Vaishali Nagar', 'Sodala',
  'Khatipura', 'Jagatpura', 'Gopalpura', 'Vidhyadhar Nagar',
  'Raja Park', 'C-Scheme', 'Tonk Road', 'Sanganer',
];

const STATS = [
  { label: 'Jaipur Areas', value: '12+' },
  { label: 'Property Types', value: '5' },
  { label: 'Mini Games', value: '11' },
  { label: 'Brokerage', value: '₹0' },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900 text-gray-300">
      {/* Stats bar */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-brand-900/50 via-purple-900/30 to-gray-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:px-6 lg:px-8">
          {STATS.map(({ label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl font-extrabold text-white sm:text-3xl">{value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white">
              Smart<span className="text-brand-400">Roooms</span>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Jaipur&apos;s most loved student room platform. Browse verified PGs & flats, chat with owners,
              play reward games, find room partners, and list your property free — trusted by students
              at MNIT, JECRC, Amity, Poornima & every college in Pink City.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Zero Brokerage', 'Owner Chat', 'Free Listing', '11 Mini Games'].map((tag) => (
                <span key={tag} className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-brand-300 ring-1 ring-gray-700">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <a href="mailto:hello@smartroooms.in" title="Email" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition hover:bg-brand-500 hover:text-white">
                <Mail size={18} />
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" title="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition hover:bg-green-600 hover:text-white">
                <MessageCircle size={18} />
              </a>
              <a href="#" title="Website" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition hover:bg-brand-500 hover:text-white">
                <Globe size={18} />
              </a>
              <a href="#" title="Share" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition hover:bg-purple-600 hover:text-white">
                <Share2 size={18} />
              </a>
            </div>
          </div>

          {/* For Tenants */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-white">
              <Users size={16} className="text-brand-400" /> For Tenants
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {TENANT_LINKS.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="transition hover:text-brand-400 hover:underline">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-white">
              <Building2 size={16} className="text-brand-400" /> For Owners
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {OWNER_LINKS.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="transition hover:text-brand-400 hover:underline">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Jaipur Areas */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-white">
              <MapPin size={16} className="text-brand-400" /> Jaipur Areas
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {AREAS.map((area) => (
                <li key={area}>
                  <Link to={`/rooms?city=Jaipur&location=${encodeURIComponent(area)}`} className="transition hover:text-brand-400">
                    Rooms in {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-white">
              <Shield size={16} className="text-brand-400" /> Support
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SUPPORT_LINKS.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="transition hover:text-brand-400">{label}</Link>
                </li>
              ))}
            </ul>

            <h4 className="mt-6 flex items-center gap-2 font-semibold text-white">
              <GraduationCap size={16} className="text-brand-400" /> Contact
            </h4>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand-400" />
                <span>Katewa Nagar, New Sanganer Road, Jaipur, Rajasthan — 302020</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-brand-400" />
                <a href="mailto:hello@smartroooms.in" className="hover:text-brand-400">hello@smartroooms.in</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-brand-400" />
                <a href="tel:+919876543210" className="hover:text-brand-400">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} className="shrink-0 text-brand-400" />
                <span>Mon–Sat, 9 AM – 8 PM IST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Facilities & payment row */}
        <div className="mt-12 grid gap-6 rounded-2xl border border-gray-800 bg-gray-800/40 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h5 className="flex items-center gap-2 text-sm font-semibold text-white">
              <Heart size={14} className="text-pink-400" /> Facilities We Cover
            </h5>
            <p className="mt-2 text-xs leading-relaxed text-gray-400">
              WiFi · AC · Meals · Laundry · CCTV Security · Parking · RO Water · Power Backup ·
              Study Rooms · Gym · Verified Photos · Tenant Complaint Support
            </p>
          </div>
          <div>
            <h5 className="flex items-center gap-2 text-sm font-semibold text-white">
              <Gamepad2 size={14} className="text-amber-400" /> Rewards Program
            </h5>
            <p className="mt-2 text-xs leading-relaxed text-gray-400">
              Welcome bonus on signup · Refer friends · Play 11 games · 500 pts = ₹50 rent credit ·
              Wallet pay toward PG rent
            </p>
          </div>
          <div>
            <h5 className="flex items-center gap-2 text-sm font-semibold text-white">
              <CreditCard size={14} className="text-emerald-400" /> Payment & Trust
            </h5>
            <p className="mt-2 text-xs leading-relaxed text-gray-400">
              UPI · Wallet balance · Direct owner payment · No hidden brokerage · Admin-verified listings ·
              Previous tenant WhatsApp connect
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-xs text-gray-500 sm:flex-row">
          <p>&copy; 2026 SmartRoooms Pvt. Ltd. All rights reserved. Zero Brokerage Policy · Made with ❤️ in Jaipur</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/privacy" className="hover:text-gray-300">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-300">Terms</Link>
            <Link to="/help" className="hover:text-gray-300">Help</Link>
            <Link to="/contact" className="hover:text-gray-300">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
