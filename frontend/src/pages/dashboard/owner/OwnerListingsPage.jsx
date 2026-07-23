import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, UserCheck, Home, Loader2, Pencil } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import {
  getRooms, updateRoomAvailability, getRoomPastTenants, getOwnerTenantDirectory,
} from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import { formatPrice, TYPE_LABELS } from '../../../utils/helpers';

export default function OwnerListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [pastTenants, setPastTenants] = useState([]);
  const [allTenants, setAllTenants] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    if (!user?.id) return;
    getRooms()
      .then((d) => setListings(
        d.rooms.filter((r) => r.ownerId === user.id || r.owner?.name?.toLowerCase() === user.name?.toLowerCase())
      ))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [user]);

  const openAvailableModal = async (room) => {
    setError('');
    setSelectedTenantId('');
    setModal(room);
    try {
      const [past, directory] = await Promise.all([
        getRoomPastTenants(room.id).catch(() => []),
        getOwnerTenantDirectory().catch(() => []),
      ]);
      setPastTenants(past);
      setAllTenants(directory);
      if (past[0]?.tenantId) setSelectedTenantId(past[0].tenantId);
    } catch {
      setPastTenants([]);
      setAllTenants([]);
    }
  };

  const markAvailable = async () => {
    if (!modal) return;
    setSaving(true);
    setError('');
    try {
      await updateRoomAvailability(modal.id, {
        status: 'available',
        tenantId: selectedTenantId || undefined,
      });
      setModal(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update listing');
    } finally {
      setSaving(false);
    }
  };

  const markOccupied = async (roomId) => {
    setSaving(true);
    try {
      await updateRoomAvailability(roomId, { status: 'occupied' });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Could not update listing');
    } finally {
      setSaving(false);
    }
  };

  const tenantOptions = pastTenants.length > 0
    ? pastTenants
    : allTenants.map((t) => ({ tenantId: t.id, name: t.name, phone: t.phone }));

  return (
    <DashboardLayout role="owner" title="My Listings">
      <p className="mb-4 text-sm text-gray-500">
        Mark a room as <strong>Available</strong> when it is vacant. The last tenant&apos;s WhatsApp will be shown to new seekers so they can ask about the property.
      </p>

      <div className="mb-4 flex justify-end">
        <Link to="/post" className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white">+ Add Listing</Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-500" size={32} /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((room) => (
            <div key={room.id} className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100">
              <img src={room.images[0]} alt="" className="h-36 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-brand-600">{TYPE_LABELS[room.type]}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    room.listingStatus === 'available'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {room.listingStatus === 'available' ? 'Available' : 'Occupied'}
                  </span>
                </div>
                <h3 className="mt-1 font-semibold">{room.title}</h3>
                <p className="text-lg font-bold">{formatPrice(room.price)}/mo</p>

                {room.listingStatus === 'available' && room.lastTenant && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-emerald-700">
                    <UserCheck size={12} />
                    Previous tenant: {room.lastTenant.name}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to={`/rooms/${room.id}`} className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100">
                    View
                  </Link>
                  <Link to={`/dashboard/owner/listings/${room.id}/edit`} className="inline-flex items-center gap-1 rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-600">
                    <Pencil size={12} /> Edit
                  </Link>
                  {room.listingStatus === 'available' ? (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => markOccupied(room.id)}
                      className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                    >
                      Mark Occupied
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openAvailableModal(room)}
                      className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600"
                    >
                      Mark Available
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {listings.length === 0 && (
            <p className="col-span-full py-12 text-center text-gray-500">
              No listings yet. <Link to="/post" className="text-brand-600">Post your first room</Link>
            </p>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-2">
              <Home className="text-brand-500" size={20} />
              <h3 className="font-bold text-gray-900">Mark as Available</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Select the <strong>previous tenant</strong> for <em>{modal.title}</em>. New seekers will be able to WhatsApp them for honest feedback.
            </p>

            {tenantOptions.length === 0 ? (
              <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                No registered tenants with phone numbers yet. Tenants must sign up on SmartRoooms first.
              </p>
            ) : (
              <div className="mt-4">
                <label className="text-xs font-medium uppercase text-gray-400">Previous tenant</label>
                <select
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                >
                  {tenantOptions.map((t) => (
                    <option key={t.tenantId} value={t.tenantId}>
                      {t.name} · {t.phone}
                      {pastTenants.some((p) => p.tenantId === t.tenantId) ? ' (last stayed)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-6 flex gap-2">
              <button type="button" onClick={() => setModal(null)} className="flex-1 rounded-xl border py-2.5 text-sm font-medium text-gray-600">
                Cancel
              </button>
              <button
                type="button"
                disabled={saving || tenantOptions.length === 0 || !selectedTenantId}
                onClick={markAvailable}
                className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Confirm Available'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
