import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Send, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import { getComplaints, postComplaint, getRooms } from '../../../api/client';
import { JAIPUR_LOCATIONS } from '../../../utils/helpers';
import MediaUpload from '../../../components/MediaUpload';

const CATEGORIES = [
  { value: 'maintenance', label: 'Maintenance / Repairs' },
  { value: 'food', label: 'Food / Meals' },
  { value: 'cleanliness', label: 'Cleanliness' },
  { value: 'wifi', label: 'WiFi / Internet' },
  { value: 'security', label: 'Security / Safety' },
  { value: 'owner', label: 'Owner Behaviour' },
  { value: 'payment', label: 'Rent / Payment Issue' },
  { value: 'other', label: 'Other' },
];

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High — urgent' },
];

export default function TenantComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    complaintType: 'general',
    roomId: '',
    roomTitle: '',
    propertyArea: user?.preferredArea || '',
    category: 'maintenance',
    priority: 'normal',
    subject: '',
    description: '',
    images: [],
    videos: [],
  });

  const load = () => {
    getComplaints().then(setComplaints);
    getRooms().then((d) => setRooms(d.rooms || [])).catch(() => setRooms([]));
  };

  useEffect(() => { load(); }, []);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      let roomTitle = form.roomTitle;
      let roomId = form.roomId || null;
      if (form.complaintType === 'listing' && form.roomId) {
        const room = rooms.find((r) => r.id === form.roomId);
        roomTitle = room?.title || form.roomTitle;
      } else if (form.complaintType === 'general') {
        roomId = null;
        roomTitle = form.roomTitle.trim() || 'General complaint';
      }

      await postComplaint({
        roomId,
        roomTitle,
        propertyArea: form.propertyArea,
        category: form.category,
        priority: form.priority,
        subject: form.subject,
        description: form.description,
        attachments: [...form.images, ...form.videos],
      });
      setSuccess('Complaint submitted! Admin will review it shortly.');
      setForm({
        complaintType: 'general',
        roomId: '',
        roomTitle: '',
        propertyArea: user?.preferredArea || '',
        category: 'maintenance',
        priority: 'normal',
        subject: '',
        description: '',
        images: [],
        videos: [],
      });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = {
    open: 'bg-red-100 text-red-700',
    'in-progress': 'bg-amber-100 text-amber-700',
    resolved: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <DashboardLayout role="tenant" title="Complaints to Admin">
      <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-900 ring-1 ring-red-100">
        <div className="flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>
            Report issues with your room, PG, owner, or the platform. Every complaint is sent directly to the <strong>admin dashboard</strong> for action.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mb-8 space-y-4 rounded-2xl bg-white/90 p-6 shadow-md ring-1 ring-gray-100 backdrop-blur">
        <h3 className="font-bold text-gray-900">File a Complaint</h3>

        <div>
          <label className="form-label">Complaint about</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              { v: 'general', l: 'General / Property name' },
              { v: 'listing', l: 'Specific listing' },
            ].map(({ v, l }) => (
              <button
                key={v}
                type="button"
                onClick={() => update('complaintType', v)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${form.complaintType === v ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {form.complaintType === 'listing' ? (
          <div>
            <label className="form-label">Select listing (if available)</label>
            <select
              value={form.roomId}
              onChange={(e) => update('roomId', e.target.value)}
              className="form-input mt-1"
            >
              <option value="">— Or type property name below —</option>
              {rooms.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
            </select>
            {!rooms.length && (
              <p className="form-hint">No listings on site yet — use General complaint and enter property name.</p>
            )}
          </div>
        ) : null}

        <div>
          <label className="form-label">Property / PG name {form.complaintType === 'general' && <span className="text-red-500">*</span>}</label>
          <input
            required={form.complaintType === 'general'}
            value={form.roomTitle}
            onChange={(e) => update('roomTitle', e.target.value)}
            placeholder="e.g. Boys PG near MNIT, Sodala flat..."
            className="form-input mt-1"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label">Area in Jaipur</label>
            <select value={form.propertyArea} onChange={(e) => update('propertyArea', e.target.value)} className="form-input mt-1">
              <option value="">Select area</option>
              {JAIPUR_LOCATIONS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Category</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className="form-input mt-1">
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="form-label">Priority</label>
          <select value={form.priority} onChange={(e) => update('priority', e.target.value)} className="form-input mt-1">
            {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>

        <div>
          <label className="form-label">Subject <span className="text-red-500">*</span></label>
          <input required value={form.subject} onChange={(e) => update('subject', e.target.value)} placeholder="Short summary of the issue" className="form-input mt-1" />
        </div>

        <div>
          <label className="form-label">Full description <span className="text-red-500">*</span></label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Explain what happened, when, and what you need from admin..."
            className="form-input mt-1 resize-none"
          />
        </div>

        <div>
          <label className="form-label">Photos & videos (optional)</label>
          <p className="form-hint mb-2">Attach proof — no adult or offensive content allowed.</p>
          <MediaUpload
            images={form.images}
            videos={form.videos}
            maxFiles={6}
            onChange={({ images, videos }) => setForm((f) => ({ ...f, images, videos }))}
          />
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        {success && (
          <p className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            <CheckCircle size={16} /> {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          <Send size={16} /> {loading ? 'Submitting…' : 'Submit to Admin'}
        </button>
      </form>

      <h3 className="mb-3 font-bold text-gray-900">Your Complaints ({complaints.length})</h3>
      <div className="space-y-3">
        {complaints.length === 0 ? (
          <p className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">No complaints filed yet.</p>
        ) : (
          complaints.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold">{c.subject}</h4>
                  <p className="text-xs text-gray-400">{c.roomTitle} · {c.category} · {c.propertyArea || 'Jaipur'}</p>
                  <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${statusColor[c.status] || 'bg-gray-100'}`}>{c.status}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{c.description}</p>
              {c.adminNote && (
                <p className="mt-2 rounded-lg bg-brand-50 p-2 text-xs text-brand-800">
                  <strong>Admin response:</strong> {c.adminNote}
                </p>
              )}
            </motion.div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
