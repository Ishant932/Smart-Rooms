import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import DownloadCsvButton from '../../../components/DownloadCsvButton';
import { getAdminBookings, updateAdminBooking, deleteAdminBooking } from '../../../api/client';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);

  const load = () => getAdminBookings().then(setBookings);
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await updateAdminBooking(id, { status });
    load();
  };

  const remove = async (id, title) => {
    if (!window.confirm(`Delete booking for "${title}"?`)) return;
    await deleteAdminBooking(id);
    load();
  };

  return (
    <DashboardLayout role="admin" title="All Bookings">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-100">
          <strong>Legacy bookings only</strong> — direct booking is disabled. Tenants connect via chat. Edit status or delete any record.
        </div>
        <DownloadCsvButton
          filename="smartroooms-bookings"
          rows={bookings.map((b) => ({
            id: b.id, room: b.roomTitle, tenant: b.tenantName, type: b.type, rent: b.rentAmount, status: b.status,
          }))}
        />
      </div>
      <div className="space-y-3">
        {bookings.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
          >
            <div>
              <p className="font-semibold">{b.roomTitle}</p>
              <p className="text-sm text-gray-500">{b.tenantName} · {b.type} · ₹{b.rentAmount}/mo</p>
              <p className="text-xs text-emerald-600">Free booking · No commission</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select value={b.status} onChange={(e) => setStatus(b.id, e.target.value)} className="rounded-lg border px-3 py-1.5 text-sm">
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button type="button" onClick={() => remove(b.id, b.roomTitle)} className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
        {bookings.length === 0 && <p className="py-12 text-center text-gray-500">No bookings yet</p>}
      </div>
    </DashboardLayout>
  );
}
