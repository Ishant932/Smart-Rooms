import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, ArrowRight, CheckCircle, Star, Wrench, UtensilsCrossed,
  Home, Cpu, Search,
} from 'lucide-react';
import { getServicesCatalog } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ThreeDBackground from '../components/ThreeDBackground';
import ServiceBookingModal from '../components/ServiceBookingModal';

const CATEGORY_META = {
  'Food & Tiffin': { icon: UtensilsCrossed, color: 'from-amber-500 to-orange-600' },
  'Home Repair': { icon: Wrench, color: 'from-cyan-500 to-blue-600' },
  'Daily Living': { icon: Home, color: 'from-emerald-500 to-teal-600' },
  Appliances: { icon: Cpu, color: 'from-violet-500 to-purple-600' },
};

export default function ServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    getServicesCatalog()
      .then((d) => setServices(d.services || []))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(services.map((s) => s.category))];
    return ['all', ...cats];
  }, [services]);

  const filtered = services.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q);
    const matchCat = category === 'all' || s.category === category;
    return matchSearch && matchCat;
  });

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((s) => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return map;
  }, [filtered]);

  const openBook = (service) => {
    setSelected(service);
    setModalOpen(true);
  };

  const onBookSuccess = (data) => {
    setToast(data.message || 'Booking submitted!');
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className="page-enter overflow-hidden">
      <section className="relative min-h-[55vh] overflow-hidden px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <ThreeDBackground variant="hero" />
        <div className="relative mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass-premium px-5 py-2 text-sm font-semibold text-brand-700"
          >
            <Sparkles size={16} className="text-amber-500" />
            Smart Services — Jaipur&apos;s #1 tenant facilities hub
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl"
          >
            Tiffin, Plumber &{' '}
            <span className="gradient-text">12+ Services</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-500"
          >
            Book verified home services for your PG or flat — meals delivered daily, repairs on demand, laundry at your doorstep. Earn reward points on every request.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-3"
          >
            {user?.role === 'tenant' ? (
              <Link to="/dashboard/tenant/services" className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg">
                My Bookings
              </Link>
            ) : (
              <Link to="/login?redirect=/dashboard/tenant/services" className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg">
                Login to Book
              </Link>
            )}
            <Link to="/signup" className="rounded-full border-2 border-brand-200 bg-white/80 px-6 py-3 text-sm font-semibold text-brand-700 backdrop-blur">
              Join Free
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {[
              { label: 'Services', value: '12+' },
              { label: 'Categories', value: '4' },
              { label: 'Points per book', value: '+5' },
              { label: 'Jaipur only', value: '100%' },
            ].map(({ label, value }, i) => (
              <motion.div
                key={label}
                whileHover={{ y: -6, scale: 1.03 }}
                className="premium-card rounded-2xl p-4 text-center"
              >
                <p className="text-2xl font-extrabold text-brand-600">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tiffin, plumber, laundry…"
                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    category === c ? 'bg-brand-600 text-white shadow-md' : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-brand-300'
                  }`}
                >
                  {c === 'all' ? 'All' : c}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <motion.div key={i} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-48 rounded-3xl bg-gray-100" />
              ))}
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <p className="text-center text-gray-500">No services match your search.</p>
          ) : (
            Object.entries(grouped).map(([cat, items], ci) => {
              const meta = CATEGORY_META[cat] || { icon: Sparkles, color: 'from-gray-500 to-gray-600' };
              const CatIcon = meta.icon;
              return (
                <div key={cat} className="mb-14">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-6 flex items-center gap-3"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.color} text-white shadow-lg`}>
                      <CatIcon size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{cat}</h2>
                      <p className="text-sm text-gray-500">{items.length} service{items.length !== 1 ? 's' : ''} available</p>
                    </div>
                  </motion.div>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((s, i) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="premium-card group relative overflow-hidden rounded-3xl p-6"
                      >
                        {s.popular && (
                          <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-700">
                            <Star size={10} fill="currentColor" /> Popular
                          </span>
                        )}
                        <motion.span
                          className="text-4xl"
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 4, delay: i * 0.2 }}
                        >
                          {s.emoji}
                        </motion.span>
                        <h3 className="mt-4 text-lg font-bold text-gray-900">{s.name}</h3>
                        <p className="mt-2 text-sm text-gray-500">{s.desc}</p>
                        <p className="mt-4 text-lg font-extrabold text-brand-600">
                          ₹{s.priceFrom}
                          <span className="text-sm font-normal text-gray-400"> / {s.unit}</span>
                        </p>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => openBook(s)}
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-md"
                        >
                          Book Now <ArrowRight size={16} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="mx-4 mb-20 sm:mx-6 lg:mx-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-7xl rounded-[2rem] bg-gradient-to-br from-brand-600 to-violet-700 p-10 text-center text-white sm:p-14"
        >
          <h2 className="text-2xl font-bold sm:text-3xl">How Smart Services works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { step: '1', title: 'Pick a service', desc: 'Choose tiffin, plumber, laundry or any of 12+ options.' },
              { step: '2', title: 'Share your PG details', desc: 'Area, address & preferred time — we handle the rest.' },
              { step: '3', title: 'Get confirmed', desc: 'Our team assigns a verified partner & updates you in dashboard.' },
            ].map(({ step, title, desc }) => (
              <motion.div key={step} whileHover={{ y: -4 }} className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                <span className="text-4xl font-black text-white/20">{step}</span>
                <h3 className="mt-2 font-bold">{title}</h3>
                <p className="mt-2 text-sm text-white/75">{desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            {['Verified partners', 'Jaipur-wide coverage', '+5 reward points'].map((t) => (
              <span key={t} className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2">
                <CheckCircle size={14} /> {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-xl"
        >
          {toast}
        </motion.div>
      )}

      <ServiceBookingModal
        service={selected}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={onBookSuccess}
      />
    </div>
  );
}
