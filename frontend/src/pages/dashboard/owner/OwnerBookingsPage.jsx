import { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { getBookings } from '../../../api/client';

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => { getBookings().then(setBookings).catch(() => {}); }, []);

  return (
    <DashboardLayout role="owner" title="Bookings">
      <p className="mb-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-100">
        All bookings through SmartRoooms are <strong>100% FREE</strong> — zero commission charged to you or tenants.
      </p>
      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <p className="font-semibold">{b.roomTitle}</p>
            <p className="text-sm text-gray-500">{b.tenantName} · {b.tenantPhone} · {b.status}</p>
            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div><p className="text-xs text-gray-400">Rent</p><p className="font-bold">₹{b.rentAmount}/mo</p></div>
              <div><p className="text-xs text-gray-400">Type</p><p className="font-medium capitalize">{b.type}</p></div>
              <div><p className="text-xs text-gray-400">Commission</p><p className="font-bold text-emerald-600">₹0 FREE</p></div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && <p className="text-center text-gray-500 py-12">No bookings yet</p>}
      </div>
    </DashboardLayout>
  );
}
