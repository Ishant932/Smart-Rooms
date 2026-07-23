import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Calendar, MapPin, Clock, Package } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import ServiceBookingModal from '../../../components/ServiceBookingModal';
import { getServicesCatalog, getServiceBookings } from '../../../api/client';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function TenantServicesPage() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState('book');

  const load = () => {
    getServicesCatalog().then((d) => setServices(d.services || [])).catch(() => setServices([]));
    getServiceBookings().then(setBookings).catch(() => setBookings([]));
  };

  useEffect(() => { load(); }, []);

  const popular = services.filter((s) => s.popular);

  return (
    <DashboardLayout role="tenant" title="Smart Services">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-500 via-violet-600 to-indigo-700 p-6 text-white shadow-lg"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-white/80">
              <Sparkles size={16} /> Hero Product
            </p>
            <h2 className="mt-1 text-2xl font-bold">Book tiffin, plumber & more</h2>
            <p className="mt-2 max-w-lg text-sm text-white/80">
              Verified services for your PG or flat across Jaipur. Earn +5 points on every booking request.
            </p>
          </div>
          <Link to="/services" className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/30">
            Full catalog <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>

      <div className="mb-6 flex gap-2">
        {[
          { k: 'book', label: 'Book Service' },
          { k: 'orders', label: `My Orders (${bookings.length})` },
        ].map(({ k, label }) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              tab === k ? 'bg-brand-600 text-white shadow-md' : 'bg-white text-gray-600 ring-1 ring-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'book' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(popular.length ? popular : services).map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100"
            >
              <span className="text-3xl">{s.emoji}</span>
              <h3 className="mt-3 font-bold text-gray-900">{s.name}</h3>
              <p className="mt-1 text-xs text-gray-500">{s.category}</p>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">{s.desc}</p>
              <p className="mt-3 font-bold text-brand-600">From ₹{s.priceFrom} / {s.unit}</p>
              <button
                type="button"
                onClick={() => { setSelected(s); setModalOpen(true); }}
                className="mt-4 w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Book Request
              </button>
            </motion.div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white/80 p-12 text-center">
          <Package className="mx-auto text-gray-300" size={40} />
          <p className="mt-4 font-semibold text-gray-700">No service bookings yet</p>
          <p className="mt-1 text-sm text-gray-500">Book tiffin, plumber or laundry from the Book Service tab.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-gray-900">{b.serviceName}</p>
                  <p className="text-sm text-gray-500">{b.category} · From ₹{b.priceFrom}/{b.unit}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-700'}`}>
                  {b.status}
                </span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                <p className="flex items-center gap-2"><MapPin size={14} className="text-brand-500" /> {b.area} — {b.address}</p>
                {b.preferredDate && <p className="flex items-center gap-2"><Calendar size={14} className="text-brand-500" /> {b.preferredDate}</p>}
                {b.preferredTime && <p className="flex items-center gap-2"><Clock size={14} className="text-brand-500" /> {b.preferredTime}</p>}
              </div>
              {b.notes && <p className="mt-2 text-sm text-gray-500">Note: {b.notes}</p>}
              {b.adminNote && <p className="mt-2 rounded-lg bg-brand-50 p-3 text-sm text-brand-800">Admin: {b.adminNote}</p>}
              <p className="mt-3 text-xs text-gray-400">Submitted {new Date(b.createdAt).toLocaleString()}</p>
            </motion.div>
          ))}
        </div>
      )}

      <ServiceBookingModal
        service={selected}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => { load(); setTab('orders'); }}
      />
    </DashboardLayout>
  );
}
