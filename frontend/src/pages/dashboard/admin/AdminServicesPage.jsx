import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, MapPin, Phone, Calendar } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import DownloadCsvButton from '../../../components/DownloadCsvButton';
import { getAdminServiceBookings, updateAdminServiceBooking } from '../../../api/client';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminServicesPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = () => getAdminServiceBookings().then(setBookings).catch(() => setBookings([]));
  useEffect(() => { load(); }, []);

  const update = async (id, status, adminNote) => {
    await updateAdminServiceBooking(id, { status, adminNote });
    load();
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <DashboardLayout role="admin" title="Smart Services Bookings">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Tenant service requests — tiffin, plumber, laundry & more. Update status and add notes.
        </p>
        <DownloadCsvButton
          filename="smartroooms-services"
          rows={filtered.map((b) => ({
            id: b.id, service: b.serviceName || b.category, status: b.status, area: b.area, phone: b.phone, createdAt: b.createdAt,
          }))}
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { k: 'all', label: `All (${bookings.length})` },
          { k: 'pending', label: `Pending (${bookings.filter((b) => b.status === 'pending').length})` },
          { k: 'confirmed', label: 'Confirmed' },
          { k: 'completed', label: 'Completed' },
          { k: 'cancelled', label: 'Cancelled' },
        ].map(({ k, label }) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${filter === k ? 'bg-brand-500 text-white' : 'bg-white ring-1 ring-gray-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white/80 p-12 text-center">
          <Wrench className="mx-auto text-gray-300" size={40} />
          <p className="mt-4 font-semibold text-gray-700">No service bookings yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-gray-900">{b.serviceName}</p>
                  <p className="text-sm text-gray-500">{b.userName} · {b.category}</p>
                  <p className="text-sm font-medium text-brand-600">From ₹{b.priceFrom}/{b.unit}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_COLORS[b.status] || 'bg-gray-100'}`}>
                  {b.status}
                </span>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                <p className="flex items-center gap-2"><MapPin size={14} className="text-brand-500" /> {b.area} — {b.address}</p>
                {b.userPhone && <p className="flex items-center gap-2"><Phone size={14} className="text-brand-500" /> {b.userPhone}</p>}
                {b.preferredDate && <p className="flex items-center gap-2"><Calendar size={14} className="text-brand-500" /> {b.preferredDate} {b.preferredTime && `· ${b.preferredTime}`}</p>}
              </div>
              {b.notes && <p className="mt-2 text-sm text-gray-500">Tenant note: {b.notes}</p>}

              <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                <select
                  defaultValue={b.status}
                  onChange={(e) => update(b.id, e.target.value, b.adminNote)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <input
                  type="text"
                  defaultValue={b.adminNote}
                  placeholder="Admin note to tenant…"
                  onBlur={(e) => update(b.id, b.status, e.target.value)}
                  className="min-w-[200px] flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <p className="mt-2 text-xs text-gray-400">{new Date(b.createdAt).toLocaleString()}</p>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
