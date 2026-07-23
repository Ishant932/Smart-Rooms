import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Building2, MessageCircle, Shield, Sparkles, ArrowRight,
  Gamepad2, Wallet, Camera, TrendingUp,
} from 'lucide-react';
import SectionHeading from './SectionHeading';

const TENANT_PERKS = [
  { icon: Shield, title: 'Zero brokerage', desc: 'Every listing is owner-posted. No hidden agent fees — ever.' },
  { icon: MessageCircle, title: 'Chat before you visit', desc: 'Message owners directly, ask about meals, WiFi & visit timing.' },
  { icon: Gamepad2, title: 'Play & earn points', desc: '6 mini games on your dashboard — turn spare time into rent savings.' },
  { icon: Wallet, title: 'Smart wallet', desc: 'Redeem 500 reward points for ₹50 rent credit. Pay PG rent from balance.' },
];

const OWNER_PERKS = [
  { icon: Camera, title: 'Free listing forever', desc: 'Upload photos & videos, pick Jaipur area on map — go live in minutes.' },
  { icon: TrendingUp, title: 'Reach real students', desc: 'MNIT, JECRC, Amity, Poornima & thousands of Jaipur seekers see your PG.' },
  { icon: MessageCircle, title: 'Tenant inbox built-in', desc: 'Reply to inquiries from one dashboard — no sharing personal WhatsApp publicly.' },
  { icon: Sparkles, title: 'Edit anytime', desc: 'Update rent, amenities & availability when a room goes vacant.' },
];

function PerkCard({ perk, index }) {
  const Icon = perk.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/10 hover:shadow-xl"
    >
      <div className="mb-3 inline-flex rounded-xl bg-white/15 p-2.5 text-cyan-200 ring-1 ring-white/20 transition group-hover:scale-110 group-hover:bg-white/25">
        <Icon size={22} />
      </div>
      <h4 className="font-bold text-white">{perk.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{perk.desc}</p>
    </motion.div>
  );
}

export default function AudienceSections() {
  return (
    <>
      {/* Tenants */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-brand-950 to-violet-950" />
        <motion.div
          className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 8 }}
        />
        <motion.div
          className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ repeat: Infinity, duration: 10 }}
        />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            badge="For Students & Tenants"
            title="Your perfect room is"
            highlight="one search away"
            subtitle="Whether you're joining MNIT, shifting to Mansarovar, or hunting a girls PG near college — SmartRoooms makes Jaipur renting stress-free."
            dark
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TENANT_PERKS.map((p, i) => (
              <PerkCard key={p.title} perk={p} index={i} />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-brand-700 shadow-2xl transition hover:scale-105"
            >
              Browse Jaipur Rooms <ArrowRight size={18} />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 font-bold text-white transition hover:bg-white/10"
            >
              Join Free — 80 Welcome Points
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Owners */}
      <section className="relative bg-gradient-to-b from-white to-brand-50/40 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            badge="For PG Owners & Landlords"
            title="Fill your rooms"
            highlight="without brokers"
            subtitle="List boys PG, girls PG, hostels or flats — connect with verified tenants, chat in-app, and mark rooms available with previous-tenant WhatsApp connect."
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 p-8 text-white shadow-2xl"
            >
              <Users className="absolute -right-4 -top-4 text-white/10" size={120} />
              <h3 className="relative text-2xl font-extrabold">Why owners love us</h3>
              <ul className="relative mt-6 space-y-4">
                {OWNER_PERKS.map((p, i) => (
                  <motion.li
                    key={p.title}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-3"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                      <p.icon size={20} />
                    </span>
                    <div>
                      <p className="font-bold">{p.title}</p>
                      <p className="text-sm text-white/80">{p.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center rounded-3xl border border-brand-100 bg-white p-8 shadow-xl ring-1 ring-brand-50"
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Start in 2 minutes</p>
              <h3 className="mt-2 text-3xl font-extrabold text-gray-900">
                Post your first listing — <span className="gradient-text">100% free</span>
              </h3>
              <p className="mt-4 leading-relaxed text-gray-600">
                No subscription. No commission on chat leads. Upload real photos, set your Jaipur locality,
                and start receiving tenant messages today. Edit listings anytime from your owner dashboard.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/post" className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-700">
                  Post Room Free
                </Link>
                <Link to="/signup" className="rounded-full border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50">
                  Create Owner Account
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {['Zero commission', 'Photo & video upload', 'Tenant chat inbox', 'Previous tenant connect'].map((t) => (
                  <span key={t} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{t}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
