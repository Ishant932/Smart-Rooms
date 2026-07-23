import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Phone, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../api/client';
import { JAIPUR_LOCATIONS } from '../utils/helpers';

export default function ServiceBookingModal({ service, open, onClose, onSuccess }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    address: user?.address || '',
    area: user?.preferredArea || '',
    phone: user?.phone || '',
    notes: '',
    preferredDate: '',
    preferredTime: '',
  });

  if (!service) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent('/services')}`);
      return;
    }
    if (user.role !== 'tenant') {
      setError('Only tenants can book Smart Services. Login as a tenant.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await bookService({ serviceId: service.id, ...form });
      onSuccess?.(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed inset-x-4 top-[10vh] z-[95] mx-auto max-h-[85vh] max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-brand-600 to-violet-600 px-5 py-4 text-white">
              <div>
                <p className="flex items-center gap-2 text-lg font-bold">
                  <span className="text-2xl">{service.emoji}</span> Book {service.name}
                </p>
                <p className="text-xs text-white/80">From ₹{service.priceFrom} {service.unit}</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-full bg-white/20 p-2"><X size={18} /></button>
            </div>

            <form onSubmit={submit} className="space-y-4 p-5">
              {!user && (
                <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                  <Link to="/login" className="font-semibold underline">Login</Link> as tenant to book services.
                </p>
              )}

              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Area in Jaipur</label>
                <select required value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm">
                  <option value="">Select area</option>
                  {JAIPUR_LOCATIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-semibold uppercase text-gray-500"><MapPin size={12} /> Full address / PG name</label>
                <input required value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="PG name, flat no, landmark…" className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="flex items-center gap-1 text-xs font-semibold uppercase text-gray-500"><Phone size={12} /> Phone</label>
                  <input required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-xs font-semibold uppercase text-gray-500"><Calendar size={12} /> Preferred date</label>
                  <input type="date" value={form.preferredDate} onChange={(e) => setForm((f) => ({ ...f, preferredDate: e.target.value }))} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Preferred time</label>
                <select value={form.preferredTime} onChange={(e) => setForm((f) => ({ ...f, preferredTime: e.target.value }))} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm">
                  <option value="">Any time</option>
                  <option value="9-12">Morning (9 AM – 12 PM)</option>
                  <option value="12-17">Afternoon (12 – 5 PM)</option>
                  <option value="17-21">Evening (5 – 9 PM)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Notes (optional)</label>
                <textarea rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Any special instructions…" className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-violet-600 py-3.5 font-semibold text-white shadow-lg disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                {loading ? 'Submitting…' : 'Confirm Booking Request'}
              </motion.button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
