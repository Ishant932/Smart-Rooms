import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, MapPin, Phone, MessageCircle, Bot,
  Building2, Users, Gamepad2, Shield, GraduationCap,
  Clock, CreditCard, Sparkles, ArrowUpRight,
} from 'lucide-react';

const TENANT_LINKS = [
  ['Browse All Rooms', '/rooms'],
  ['Smart Services Hub', '/services'],
  ['Boys PG', '/rooms?type=pg-boys'],
  ['Girls PG', '/rooms?type=pg-girls'],
  ['Shared Rooms', '/rooms?type=shared-room'],
  ['Compare Properties', '/compare'],
  ['Post Requirement', '/post-requirement'],
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
  ['Ask Saathi AI', '/help'],
  ['Contact Us', '/contact'],
  ['Privacy Policy', '/privacy'],
  ['Terms & Conditions', '/terms'],
];

const AREAS = [
  'Malviya Nagar', 'Mansarovar', 'Vaishali Nagar', 'Sodala',
  'Khatipura', 'Jagatpura', 'Gopalpura', 'Vidhyadhar Nagar',
  'Raja Park', 'C-Scheme', 'Tonk Road', 'Sanganer',
];

const STATS = [
  { label: 'Jaipur Areas', value: '12+' },
  { label: 'Property Types', value: '5' },
  { label: 'Mini Games', value: '6' },
  { label: 'Brokerage', value: '₹0' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-gray-300">
      <div className="pointer-events-none absolute inset-0 crazy-mesh opacity-40" />
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-rose-500/20 blur-3xl" />

      <div className="relative border-b border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:px-6 lg:px-8">
          {STATS.map(({ label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl bg-white/5 p-4 text-center ring-1 ring-white/10 backdrop-blur"
            >
              <p className="title-multicolor text-2xl font-black sm:text-3xl">{value}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-black tracking-tight text-white">
              Smart<span className="gradient-text">Roooms</span>
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-400">
              Jaipur student housing — zero brokerage, owner chat, Saathi AI guide, and Play & Earn points you redeem for rent.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Zero Brokerage', 'Owner Chat', 'Saathi AI', '6 Mini Games'].map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-cyan-200 ring-1 ring-white/10">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <a href="mailto:hello@smartroooms.in" className="flex items-center gap-2 hover:text-cyan-300">
                <Mail size={16} /> hello@smartroooms.in
              </a>
              <p className="flex items-center gap-2"><MapPin size={16} /> Katewa Nagar, Jaipur</p>
              <p className="flex items-center gap-2 text-gray-500"><Bot size={16} /> Tap the Saathi button anytime</p>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-cyan-300">For Tenants</h4>
            <ul className="space-y-2 text-sm">
              {TENANT_LINKS.map(([label, to]) => (
                <li key={to + label}>
                  <Link to={to} className="group inline-flex items-center gap-1 hover:text-white">
                    {label}
                    <ArrowUpRight size={12} className="opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-violet-300">For Owners</h4>
            <ul className="space-y-2 text-sm">
              {OWNER_LINKS.map(([label, to]) => (
                <li key={to + label}>
                  <Link to={to} className="group inline-flex items-center gap-1 hover:text-white">
                    {label}
                    <ArrowUpRight size={12} className="opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-rose-300">Jaipur Areas</h4>
            <div className="flex flex-wrap gap-2">
              {AREAS.map((area) => (
                <Link
                  key={area}
                  to={`/rooms?city=Jaipur&location=${encodeURIComponent(area)}`}
                  className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-gray-300 ring-1 ring-white/10 transition hover:bg-cyan-500/20 hover:text-white"
                >
                  {area}
                </Link>
              ))}
            </div>
            <h4 className="mb-3 mt-6 text-xs font-bold uppercase tracking-widest text-amber-300">Support</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {SUPPORT_LINKS.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 sm:grid-cols-4">
          {[
            { icon: Shield, t: 'Verified listings' },
            { icon: Gamepad2, t: '6 arcade games' },
            { icon: GraduationCap, t: 'Student-first' },
            { icon: CreditCard, t: 'Wallet rewards' },
          ].map(({ icon: Icon, t }) => (
            <div key={t} className="flex items-center gap-2 text-xs font-semibold text-gray-300">
              <Icon size={16} className="text-cyan-400" /> {t}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} SmartRoooms · Jaipur</p>
          <p className="flex items-center gap-1">
            <Sparkles size={12} className="text-amber-400" />
            Welcome bonus · Refer friends · Play 6 games · 500 pts = ₹50 rent credit
          </p>
          <p className="flex items-center gap-1"><Clock size={12} /> Built for Pink City students</p>
        </div>
      </div>
    </footer>
  );
}
