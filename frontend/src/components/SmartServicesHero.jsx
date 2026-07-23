import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Wrench, UtensilsCrossed, Zap } from 'lucide-react';
import { getServicesCatalog } from '../api/client';
import SectionHeading from './SectionHeading';

const FLOAT_EMOJIS = ['🍱', '🔧', '⚡', '👕', '🧹', '📦', '📶', '🪚'];

export default function SmartServicesHero() {
  const [services, setServices] = useState([]);
  const popular = services.filter((s) => s.popular).slice(0, 6);

  useEffect(() => {
    getServicesCatalog()
      .then((d) => setServices(d.services || []))
      .catch(() => setServices([]));
  }, []);

  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 10, delay: 1 }}
          className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-gradient-to-br from-violet-500/25 to-brand-500/20 blur-3xl"
        />
        {FLOAT_EMOJIS.map((emoji, i) => (
          <motion.span
            key={emoji}
            className="absolute text-2xl opacity-20 sm:text-3xl"
            style={{ left: `${8 + i * 11}%`, top: `${12 + (i % 3) * 28}%` }}
            animate={{ y: [0, -18, 0], rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4 + i * 0.5, delay: i * 0.3 }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          badge="Hero Product"
          title="Smart"
          highlight="Services"
          subtitle="Book tiffin, plumber, electrician, laundry & more — delivered to your PG or flat across Jaipur. Earn points on every booking."
        />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="glow-border overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-violet-600 to-indigo-800 p-8 text-white shadow-2xl"
            >
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
              >
                <Sparkles size={14} /> New — Smart Services Hub
              </motion.span>
              <h3 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
                Everything your PG life needs, one tap away
              </h3>
              <p className="mt-4 text-white/80">
                Veg & non-veg tiffin, monthly meal plans, verified plumbers & electricians, laundry pickup, deep cleaning, AC service, WiFi setup & local packers — all bookable from your dashboard.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: UtensilsCrossed, label: 'Tiffin & Meals', color: 'bg-amber-500/30' },
                  { icon: Wrench, label: 'Home Repairs', color: 'bg-cyan-500/30' },
                  { icon: Zap, label: 'Daily Living', color: 'bg-emerald-500/30' },
                ].map(({ icon: Icon, label, color }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className={`rounded-2xl ${color} p-4 text-center backdrop-blur`}
                  >
                    <Icon className="mx-auto mb-2" size={22} />
                    <p className="text-xs font-semibold">{label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-lg transition hover:scale-105"
                >
                  Explore All Services <ArrowRight size={16} />
                </Link>
                <Link
                  to="/login?redirect=/dashboard/tenant/services"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Book as Tenant
                </Link>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {(popular.length ? popular : [
              { id: '1', emoji: '🍱', name: 'Veg Tiffin', priceFrom: 80, unit: 'per meal', desc: 'Fresh meals to your PG' },
              { id: '2', emoji: '🔧', name: 'Plumber', priceFrom: 199, unit: 'visit', desc: 'Tap, flush & pipe fixes' },
              { id: '3', emoji: '👕', name: 'Laundry', priceFrom: 40, unit: 'per kg', desc: 'Doorstep wash & iron' },
              { id: '4', emoji: '⚡', name: 'Electrician', priceFrom: 149, unit: 'visit', desc: 'Fan, switch & wiring' },
              { id: '5', emoji: '📅', name: 'Meal Plan', priceFrom: 2200, unit: 'per month', desc: 'Full monthly package' },
              { id: '6', emoji: '🧹', name: 'Deep Clean', priceFrom: 399, unit: 'session', desc: 'Professional room clean' },
            ]).map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30, rotate: i % 2 ? 2 : -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: 'spring' }}
                whileHover={{ y: -10, scale: 1.03, rotate: i % 2 ? 1 : -1 }}
                className="premium-card group cursor-pointer rounded-2xl p-5"
              >
                <Link to="/services" className="block">
                  <motion.span
                    className="text-3xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {s.emoji}
                  </motion.span>
                  <h4 className="mt-3 font-bold text-gray-900 group-hover:text-brand-600">{s.name}</h4>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-500">{s.desc}</p>
                  <p className="mt-3 text-sm font-bold text-brand-600">
                    From ₹{s.priceFrom} <span className="font-normal text-gray-400">/ {s.unit}</span>
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
