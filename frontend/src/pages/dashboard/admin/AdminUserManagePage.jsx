import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronDown, ChevronUp, Mail, Phone, MapPin, Calendar, Shield,
  Trash2, Home, ExternalLink, Search,
} from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import DownloadCsvButton from '../../../components/DownloadCsvButton';
import {
  getAdminUsers, updateAdminUser, updateAdminWallet, deleteAdminRoom, getAdminUserListings,
  deleteAdminUser,
} from '../../../api/client';
import { LOOKING_FOR_OPTIONS, formatPrice, TYPE_LABELS } from '../../../utils/helpers';

/** Shared admin CRM for owners or tenants */
export default function AdminUserManagePage({ roleFilter, title, blurb }) {
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
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

  useEffect(() => {
    reload().catch(() => setActionError('Could not load users.'));
  }, [reload]);

  const baseUsers = useMemo(() => {
    const list = roleFilter === 'owner' ? data?.owners : data?.tenants;
    return (list || []).filter((u) => u.role !== 'admin');
  }, [data, roleFilter]);

  const users = useMemo(() => {
    const q = search.trim().toLowerCase();
    return baseUsers.filter((u) => {
      if (statusFilter !== 'all' && (u.status || 'active') !== statusFilter) return false;
      if (!q) return true;
      return [u.name, u.email, u.phone, u.college, u.preferredArea]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [baseUsers, search, statusFilter]);

  const csvRows = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    status: u.status || 'active',
    college: u.college || '',
    area: u.preferredArea || '',
    createdAt: u.createdAt || '',
    listings: u.listingCount || u.listings?.length || 0,
  }));

  const userListings = (u) => listingsByUser[u.id] || u.listings || [];

  const loadUserListings = async (userId) => {
    setLoadingListings(userId);
    try {
      const { listings } = await getAdminUserListings(userId);
      setListingsByUser((prev) => ({ ...prev, [userId]: listings || [] }));
    } catch {
      setActionError('Could not load listings.');
    } finally {
      setLoadingListings(null);
    }
  };

  const toggle = async (id) => {
    if (expanded === id) {
      setExpanded(null);
      return;
    }
    const u = data?.all?.find((x) => x.id === id);
    setExpanded(id);
    setWalletForm({ balance: '', points: '', reason: '' });
    setEditForm({ name: u?.name || '', email: u?.email || '', phone: u?.phone || '', role: u?.role || roleFilter });
    setActionError('');
    if (roleFilter === 'owner') await loadUserListings(id);
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
    if (!window.confirm(`Permanently delete "${name}"?`)) return;
    try {
      await deleteAdminUser(userId);
      setExpanded(null);
      await reload();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  const setStatus = async (id, status) => {
    if (!window.confirm(status === 'suspended' ? 'Suspend this account?' : 'Reactivate account?')) return;
    try {
      await updateAdminUser(id, { status });
      setExpanded(null);
      await reload();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed');
    }
  };

  const saveWallet = async (userId) => {
    try {
      const payload = { reason: walletForm.reason || 'Admin adjustment' };
      if (walletForm.balance !== '') payload.balance = Number(walletForm.balance);
      if (walletForm.points !== '') payload.points = Number(walletForm.points);
      await updateAdminWallet(userId, payload);
      alert('Wallet updated');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed');
    }
  };

  const removeListing = async (userId, roomId, roomTitle) => {
    if (!window.confirm(`Remove listing "${roomTitle}"?`)) return;
    try {
      await deleteAdminRoom(roomId);
      setListingsByUser((prev) => ({
        ...prev,
        [userId]: (prev[userId] || []).filter((r) => r.id !== roomId),
      }));
      await reload();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed');
    }
  };

  return (
    <DashboardLayout role="admin" title={title}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{blurb}</p>
        <DownloadCsvButton filename={`smartroooms-${roleFilter}s`} rows={csvRows} />
      </div>

      {actionError && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone…"
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm"
          />
        </div>
        {['all', 'active', 'suspended'].map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setStatusFilter(k)}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
              statusFilter === k ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200'
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {users.map((u, i) => {
          const listings = userListings(u);
          return (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 12) * 0.03 }}
              className="overflow-hidden rounded-2xl bg-white/90 shadow-md ring-1 ring-gray-100"
            >
              <button type="button" onClick={() => toggle(u.id)} className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-white ${roleFilter === 'owner' ? 'bg-violet-500' : 'bg-brand-500'}`}>
                    {u.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {roleFilter === 'owner' && (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
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
                      <Detail icon={MapPin} label="Area" value={u.preferredArea} />
                      <Detail label="College" value={u.college} />
                      {u.role === 'tenant' && (
                        <>
                          <Detail label="Looking For" value={LOOKING_FOR_OPTIONS.find((o) => o.value === u.lookingFor)?.label} />
                          <Detail label="Budget" value={u.budget ? `₹${u.budget}/mo` : null} />
                        </>
                      )}
                      <Detail icon={Shield} label="Terms" value={u.termsAcceptedAt ? 'Accepted' : '—'} />
                      <Detail icon={Calendar} label="Registered" value={u.createdAt ? new Date(u.createdAt).toLocaleString() : '—'} />
                    </div>

                    {roleFilter === 'owner' && (
                      <div className="mt-5 rounded-xl bg-white p-4 ring-1 ring-gray-100">
                        <div className="flex items-center gap-2">
                          <Home size={18} className="text-brand-500" />
                          <h4 className="font-bold">Listings ({listings.length})</h4>
                        </div>
                        {loadingListings === u.id ? (
                          <p className="mt-2 text-sm text-gray-500">Loading…</p>
                        ) : listings.length === 0 ? (
                          <p className="mt-2 text-sm text-gray-500">No listings.</p>
                        ) : (
                          <div className="mt-3 space-y-2">
                            {listings.map((room) => (
                              <div key={room.id} className="flex flex-wrap items-center gap-3 rounded-xl border bg-gray-50 p-3">
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-semibold">{room.title}</p>
                                  <p className="text-xs text-gray-500">
                                    {TYPE_LABELS[room.type] || room.type} · {room.location} · {formatPrice(room.price)}/mo
                                  </p>
                                </div>
                                <Link to={`/rooms/${room.id}`} className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
                                  <ExternalLink size={12} className="inline" /> View
                                </Link>
                                <button type="button" onClick={() => removeListing(u.id, room.id, room.title)} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white">
                                  <Trash2 size={12} className="inline" /> Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-4 rounded-xl bg-white p-4 ring-1 ring-brand-100">
                      <p className="text-sm font-bold">Edit User</p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" placeholder="Name" />
                        <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" placeholder="Email" />
                        <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" placeholder="Phone" />
                      </div>
                      <button type="button" onClick={() => saveUserEdit(u.id)} className="mt-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white">Save</button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
                      {u.status === 'suspended' ? (
                        <button type="button" onClick={() => setStatus(u.id, 'active')} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">Activate</button>
                      ) : (
                        <button type="button" onClick={() => setStatus(u.id, 'suspended')} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white">Suspend</button>
                      )}
                      <button type="button" onClick={() => deleteUser(u.id, u.name)} className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white">Delete</button>
                    </div>

                    <div className="mt-4 rounded-xl bg-white p-4 ring-1 ring-gray-100">
                      <p className="text-sm font-bold">Adjust Wallet</p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        <input type="number" placeholder="Balance ₹" value={walletForm.balance} onChange={(e) => setWalletForm({ ...walletForm, balance: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" />
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
        {!users.length && <p className="rounded-2xl bg-white p-8 text-center text-gray-500">No {roleFilter}s match your filters.</p>}
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
