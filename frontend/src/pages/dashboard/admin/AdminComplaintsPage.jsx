import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import DownloadCsvButton from '../../../components/DownloadCsvButton';
import { getComplaints, updateComplaint, deleteAdminComplaint } from '../../../api/client';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = () => getComplaints().then(setComplaints).catch(() => setComplaints([]));
  useEffect(() => { load(); }, []);

  const update = async (id, status, adminNote) => {
    await updateComplaint(id, { status, adminNote });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this complaint permanently?')) return;
    await deleteAdminComplaint(id);
    load();
  };

  const filtered = filter === 'all' ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <DashboardLayout role="admin" title="Tenant Complaints">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Complaints filed by registered tenants appear here automatically. Update status and add admin notes.
        </p>
        <DownloadCsvButton
          filename="smartroooms-complaints"
          rows={filtered.map((c) => ({
            id: c.id, subject: c.subject || c.title, status: c.status, email: c.email || c.userEmail, createdAt: c.createdAt,
          }))}
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { k: 'all', label: `All (${complaints.length})` },
          { k: 'open', label: `Open (${complaints.filter((c) => c.status === 'open').length})` },
          { k: 'in-progress', label: 'In Progress' },
          { k: 'resolved', label: 'Resolved' },
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
          <AlertCircle className="mx-auto text-gray-300" size={40} />
          <p className="mt-4 font-semibold text-gray-700">No complaints yet</p>
          <p className="mt-1 text-sm text-gray-500">When tenants submit from their dashboard, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{c.subject}</h3>
                  <p className="mt-1 text-sm text-gray-600">{c.roomTitle} · {c.category} · Priority: {c.priority || 'normal'}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Mail size={12} /> {c.tenantEmail || c.tenantName}</span>
                    {c.tenantPhone && <span className="flex items-center gap-1"><Phone size={12} /> {c.tenantPhone}</span>}
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  {c.propertyArea && <p className="mt-1 text-xs text-gray-400">Area: {c.propertyArea}</p>}
                </div>
                <select
                  value={c.status}
                  onChange={(e) => update(c.id, e.target.value, c.adminNote)}
                  className="rounded-lg border px-3 py-1.5 text-sm"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <p className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">{c.description}</p>
              <label className="mt-3 block text-xs font-medium text-gray-500">Admin note (visible to tenant)</label>
              <input
                placeholder="Your response or action taken..."
                defaultValue={c.adminNote}
                onBlur={(e) => update(c.id, c.status, e.target.value)}
                className="mt-1 w-full rounded-xl border px-4 py-2 text-sm"
              />
              <Link to="/dashboard/admin/users" className="mt-2 inline-block text-xs font-semibold text-brand-600 hover:underline">
                View tenant in Users →
              </Link>
              <button
                type="button"
                onClick={() => remove(c.id)}
                className="mt-3 flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white"
              >
                <Trash2 size={12} /> Delete Complaint
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
