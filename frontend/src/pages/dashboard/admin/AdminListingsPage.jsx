import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Edit2, ExternalLink, Save, X } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import DownloadCsvButton from '../../../components/DownloadCsvButton';
import { getAdminRooms, updateAdminRoom, deleteAdminRoom } from '../../../api/client';
import { formatPrice, TYPE_LABELS } from '../../../utils/helpers';

export default function AdminListingsPage() {
  const [rooms, setRooms] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const load = () => getAdminRooms().then((d) => setRooms(d.rooms || []));

  useEffect(() => { load(); }, []);

  const startEdit = (room) => {
    setEditing(room.id);
    setForm({
      title: room.title,
      price: room.price,
      deposit: room.deposit,
      location: room.location,
      type: room.type,
      verified: room.verified,
      featured: room.featured,
    });
  };

  const saveEdit = async (id) => {
    await updateAdminRoom(id, {
      ...form,
      price: Number(form.price),
      deposit: Number(form.deposit),
    });
    setEditing(null);
    load();
  };

  const remove = async (id, title) => {
    if (!window.confirm(`Delete listing "${title}" permanently?`)) return;
    await deleteAdminRoom(id);
    load();
  };

  return (
    <DashboardLayout role="admin" title="All Listings">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-100">
          <strong>100% FREE property posting</strong> for owners — no commission. Admin can edit or delete any listing.
        </div>
        <DownloadCsvButton
          filename="smartroooms-listings"
          rows={rooms.map((r) => ({
            id: r.id, title: r.title, type: r.type, location: r.location, price: r.price,
            verified: r.verified, featured: r.featured, ownerId: r.ownerId || '',
          }))}
        />
      </div>

      <div className="space-y-4">
        {rooms.map((room, i) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100"
          >
            {editing === room.id ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border px-3 py-2 text-sm sm:col-span-2" placeholder="Title" />
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" placeholder="Rent" />
                <input type="number" value={form.deposit} onChange={(e) => setForm({ ...form, deposit: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" placeholder="Deposit" />
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" placeholder="Location" />
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-lg border px-3 py-2 text-sm">
                  {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} /> Verified</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
                <div className="flex gap-2 sm:col-span-2">
                  <button type="button" onClick={() => saveEdit(room.id)} className="flex items-center gap-1 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white"><Save size={14} /> Save</button>
                  <button type="button" onClick={() => setEditing(null)} className="flex items-center gap-1 rounded-lg border px-4 py-2 text-sm"><X size={14} /> Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-4">
                {room.images?.[0] && <img src={room.images[0]} alt="" className="h-16 w-24 rounded-lg object-cover" />}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-900">{room.title}</p>
                  <p className="text-sm text-gray-500">{TYPE_LABELS[room.type]} · {room.location} · {formatPrice(room.price)}/mo</p>
                  <p className="text-xs text-gray-400">Owner: {room.owner?.name || '—'}</p>
                  <div className="mt-1 flex gap-1">
                    {room.verified && <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">Verified</span>}
                    {room.featured && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">Featured</span>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/rooms/${room.id}`} className="flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700"><ExternalLink size={12} /> View</Link>
                  <button type="button" onClick={() => startEdit(room)} className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700"><Edit2 size={12} /> Edit</button>
                  <button type="button" onClick={() => remove(room.id, room.title)} className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white"><Trash2 size={12} /> Delete</button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
        {rooms.length === 0 && <p className="py-12 text-center text-gray-500">No listings on platform.</p>}
      </div>
    </DashboardLayout>
  );
}
