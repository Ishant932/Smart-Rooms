import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronDown, ChevronUp, Mail, Phone, MapPin, Calendar, Shield,
  Trash2, Home, ExternalLink,
} from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import DownloadCsvButton from '../../../components/DownloadCsvButton';
import {
  getAdminUsers, updateAdminUser, updateAdminWallet, deleteAdminRoom, getAdminUserListings,
  deleteAdminUser,
} from '../../../api/client';
import { LOOKING_FOR_OPTIONS, formatPrice, TYPE_LABELS } from '../../../utils/helpers';

export default function AdminUsersPage() {
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');
  const [walletForm, setWalletForm] = useState({ balance: '', points: '', reason: '' });
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', role: '' });
  const [listingsByUser, setListingsByUser] = useState({});
  const [loadingListings, setLoadingListings] = useState(null);
  const [actionError, setActionError] = useState('');

  const reload = useCallback(async () => {
    const d = await getAdminUsers();
    setData(d);
    const map = {};
    d.all?.forEach((u) => {
      if (u.role === 'owner' && u.listings) map[u.id] = u.listings;
    });
    setListingsByUser(map);
  }, []);

  useEffect(() => { reload().catch(() => setActionError('Could not load users. Make sure the backend is running.')); }, [reload]);

  const users = (filter === 'tenant' ? data?.tenants : filter === 'owner' ? data?.owners : data?.all)?.filter((u) => u.role !== 'admin');

  const userListings = (u) => listingsByUser[u.id] || u.listings || [];

  const loadUserListings = async (userId) => {
    setLoadingListings(userId);
    try {
      const { listings } = await getAdminUserListings(userId);
      setListingsByUser((prev) => ({ ...prev, [userId]: listings || [] }));
    } catch {
      setActionError('Could not load listings. Restart the backend server (close START WEBSITE.bat and open again).');
    } finally {
      setLoadingListings(null);
    }
  };

  const toggle = async (id) => {
    if (expanded === id) {
      setExpanded(null);
      setWalletForm({ balance: '', points: '', reason: '' });
      return;
    }
    const u = data?.all?.find((x) => x.id === id);
    setExpanded(id);
    setWalletForm({ balance: '', points: '', reason: '' });
    setEditForm({ name: u?.name || '', email: u?.email || '', phone: u?.phone || '', role: u?.role || 'tenant' });
    setActionError('');
    await loadUserListings(id);
  };

  const saveUserEdit = async (userId) => {
    try {
      await updateAdminUser(userId, editForm);
      alert('User updated');
      await reload();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update user');
    }
  };

  const deleteUser = async (userId, name) => {
    if (!window.confirm(`Permanently delete user "${name}" and remove their data?`)) return;
    try {
      const result = await deleteAdminUser(userId);
      alert(`User deleted.${result.listingsRemoved ? ` ${result.listingsRemoved} listing(s) removed.` : ''}`);
      setExpanded(null);
      await reload();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const setStatus = async (id, status) => {
    const label = status === 'suspended' ? 'suspend this account and remove their listings from the platform' : 'reactivate this account';
    if (!window.confirm(`Are you sure you want to ${label}?`)) return;
    setActionError('');
    try {
      const result = await updateAdminUser(id, { status });
      const msg = status === 'suspended'
        ? `Account suspended.${result.listingsRemoved ? ` ${result.listingsRemoved} listing(s) removed.` : ''} User cannot log in.`
        : 'Account reactivated. User can log in again.';
      alert(msg);
      setExpanded(null);
      await reload();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update account. Restart the backend and try again.';
      setActionError(msg);
      alert(msg);
    }
  };

  const saveWallet = async (userId) => {
    try {
      const payload = { reason: walletForm.reason || 'Admin adjustment' };
      if (walletForm.balance !== '') payload.balance = Number(walletForm.balance);
      if (walletForm.points !== '') payload.points = Number(walletForm.points);
      await updateAdminWallet(userId, payload);
      setWalletForm({ balance: '', points: '', reason: '' });
      alert('Wallet updated');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update wallet');
    }
  };

  const removeListing = async (userId, roomId, title) => {
    if (!window.confirm(`Remove listing "${title}"? This cannot be undone.`)) return;
    setActionError('');
    try {
      await deleteAdminRoom(roomId);
      setListingsByUser((prev) => ({
        ...prev,
        [userId]: (prev[userId] || []).filter((r) => r.id !== roomId),
      }));
      await reload();
      alert('Listing removed from platform.');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to remove listing. Restart the backend and try again.';
      setActionError(msg);
      alert(msg);
    }
  };

  return (
    <DashboardLayout role="admin" title="Registered Users">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Click an owner to view their listings and remove fake posts. Suspending an owner removes all their listings and blocks login.
        </p>
        <DownloadCsvButton
          filename="smartroooms-users"
          rows={(users || []).map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: u.role,
            status: u.status || 'active',
            createdAt: u.createdAt || '',
          }))}
        />
      </div>

      {actionError && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {actionError}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { k: 'all', label: `All (${data?.all?.filter((u) => u.role !== 'admin')?.length || 0})` },
          { k: 'tenant', label: `Tenants (${data?.tenants?.length || 0})` },
          { k: 'owner', label: `Owners (${data?.owners?.length || 0})` },
        ].map(({ k, label }) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === k ? 'bg-brand-500 text-white shadow-md' : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-brand-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {(users || []).map((u, i) => {
          const listings = userListings(u);
          return (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="overflow-hidden rounded-2xl bg-white/90 shadow-md ring-1 ring-gray-100 backdrop-blur"
            >
              <button
                type="button"
                onClick={() => toggle(u.id)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-gray-50/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-white ${u.role === 'owner' ? 'bg-purple-500' : 'bg-brand-500'}`}>
                    {u.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{u.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{u.role} · {u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {u.role === 'owner' && (
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
                      {listings.length} listing{listings.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${u.status === 'suspended' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                    {u.status || 'active'}
                  </span>
                  {expanded === u.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              <AnimatePresence>
                {expanded === u.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-100 bg-gray-50/50 px-4 pb-4"
                  >
                    <div className="grid gap-3 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                      <Detail icon={Mail} label="Email" value={u.email} />
                      <Detail icon={Phone} label="Phone" value={u.phone} />
                      <Detail icon={MapPin} label="Preferred Area" value={u.preferredArea} />
                      <Detail icon={MapPin} label="Address" value={u.address} />
                      <Detail label="College" value={u.college} />
                      <Detail label="Gender / Age" value={[u.gender, u.age].filter(Boolean).join(' · ')} />
                      {u.role === 'tenant' && (
                        <>
                          <Detail label="Looking For" value={LOOKING_FOR_OPTIONS.find((o) => o.value === u.lookingFor)?.label} />
                          <Detail label="Budget" value={u.budget ? `₹${u.budget}/mo` : null} />
                        </>
                      )}
                      {u.role === 'owner' && (
                        <Detail label="Property Types" value={u.propertyTypes?.join(', ')} />
                      )}
                      <Detail icon={Shield} label="Terms Accepted" value={u.termsAcceptedAt ? new Date(u.termsAcceptedAt).toLocaleString() : 'Yes'} />
                      <Detail icon={Calendar} label="Registered" value={u.createdAt ? new Date(u.createdAt).toLocaleString() : '—'} />
                    </div>

                    <div className="mt-5 rounded-xl bg-white p-4 ring-1 ring-gray-100">
                      <div className="flex items-center gap-2">
                        <Home size={18} className="text-brand-500" />
                        <h4 className="font-bold text-gray-900">
                          {u.role === 'owner' ? `Property Listings (${listings.length})` : 'Property Listings'}
                        </h4>
                      </div>
                      {u.role !== 'owner' ? (
                        <p className="mt-2 text-sm text-gray-500">Tenant accounts do not post property listings.</p>
                      ) : loadingListings === u.id ? (
                        <p className="mt-2 text-sm text-gray-500">Loading listings…</p>
                      ) : listings.length === 0 ? (
                        <p className="mt-2 text-sm text-gray-500">This owner has no active listings.</p>
                      ) : (
                        <div className="mt-3 space-y-3">
                          {listings.map((room) => (
                            <div key={room.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                              {room.images?.[0] && (
                                <img src={room.images[0]} alt="" className="h-14 w-20 rounded-lg object-cover" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold text-gray-900">{room.title}</p>
                                <p className="text-xs text-gray-500">
                                  {TYPE_LABELS[room.type] || room.type} · {room.location} · {formatPrice(room.price)}/mo
                                </p>
                                <div className="mt-1 flex gap-1">
                                  {room.verified && <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">Verified</span>}
                                  {room.featured && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">Featured</span>}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Link to={`/rooms/${room.id}`} className="flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100">
                                  <ExternalLink size={12} /> View
                                </Link>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); removeListing(u.id, room.id, room.title); }}
                                  className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                                >
                                  <Trash2 size={12} /> Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {u.facilities?.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium uppercase text-gray-400">Facilities</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {u.facilities.map((f) => (
                            <span key={f} className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">{f}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 rounded-xl bg-white p-4 ring-1 ring-brand-100">
                      <p className="text-sm font-bold text-gray-800">Edit User</p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" placeholder="Name" />
                        <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" placeholder="Email" />
                        <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" placeholder="Phone" />
                        {u.role !== 'admin' && (
                          <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="rounded-lg border px-3 py-2 text-sm">
                            <option value="tenant">Tenant</option>
                            <option value="owner">Owner</option>
                          </select>
                        )}
                      </div>
                      <button type="button" onClick={() => saveUserEdit(u.id)} className="mt-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white">Save Profile</button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-200 pt-4">
                      {u.status === 'suspended' ? (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setStatus(u.id, 'active'); }}
                          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
                        >
                          Activate Account
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setStatus(u.id, 'suspended'); }}
                          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                        >
                          Suspend & Remove from Platform
                        </button>
                      )}
                      {u.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); deleteUser(u.id, u.name); }}
                          className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
                        >
                          Delete User
                        </button>
                      )}
                    </div>

                    <div className="mt-4 rounded-xl bg-white p-4 ring-1 ring-gray-100">
                      <p className="text-sm font-bold text-gray-800">Adjust Wallet</p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        <input type="number" placeholder="Balance (₹)" value={walletForm.balance} onChange={(e) => setWalletForm({ ...walletForm, balance: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" />
                        <input type="number" placeholder="Points" value={walletForm.points} onChange={(e) => setWalletForm({ ...walletForm, points: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" />
                        <input placeholder="Reason" value={walletForm.reason} onChange={(e) => setWalletForm({ ...walletForm, reason: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" />
                      </div>
                      <button type="button" onClick={() => saveWallet(u.id)} className="mt-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white">Save Wallet</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-white p-3 ring-1 ring-gray-100">
      <p className="flex items-center gap-1 text-xs font-medium uppercase text-gray-400">
        {Icon && <Icon size={12} />} {label}
      </p>
      <p className="mt-1 text-sm font-medium text-gray-800">{value || '—'}</p>
    </div>
  );
}
