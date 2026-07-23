import { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { getAdminBookings } from '../../../api/client';

export default function AdminTransactionsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getAdminBookings().then(setBookings);
  }, []);

  const totalRent = bookings.reduce((s, b) => s + (b.rentAmount || 0), 0);

  return (
    <DashboardLayout role="admin" title="Platform Activity">
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold">{bookings.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100">
          <p className="text-sm text-gray-500">Rent Value Booked</p>
          <p className="text-2xl font-bold">₹{totalRent}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-5 ring-1 ring-emerald-100">
          <p className="text-sm text-emerald-700">Platform Commission</p>
          <p className="text-2xl font-bold text-emerald-800">₹0 — FREE</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-brand-50 p-4 text-sm text-brand-800">
        SmartRoooms offers <strong>free property posting</strong> and <strong>owner–tenant chat</strong>. No commission charged to tenants or owners.
      </div>

      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div>
              <p className="font-semibold">{b.roomTitle}</p>
              <p className="text-sm text-gray-500">{b.tenantName} · {b.type} · {b.status}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">₹{b.rentAmount}/mo</p>
              <p className="text-xs text-emerald-600">Zero commission</p>
            </div>
          </div>
        ))}
        {bookings.length === 0 && <p className="py-12 text-center text-gray-500">No activity yet</p>}
      </div>
    </DashboardLayout>
  );
}
