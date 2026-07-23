import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import DownloadCsvButton from '../../../components/DownloadCsvButton';
import { getAdminFeedback, updateAdminFeedback } from '../../../api/client';

export default function AdminFeedbackPage() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = () => getAdminFeedback().then(setList).catch(() => setList([]));
  useEffect(() => { load(); }, []);

  const update = async (id, status, adminReply) => {
    await updateAdminFeedback(id, { status, adminReply });
    load();
  };

  const filtered = filter === 'all' ? list : list.filter((f) => f.status === filter);

  return (
    <DashboardLayout role="admin" title="Platform Feedback">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Feedback from tenants and owners — reply and mark as resolved.
        </p>
        <DownloadCsvButton
          filename="smartroooms-feedback"
          rows={filtered.map((f) => ({
            id: f.id, role: f.role, category: f.category, subject: f.subject, status: f.status, rating: f.rating, createdAt: f.createdAt,
          }))}
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { k: 'all', label: `All (${list.length})` },
          { k: 'open', label: `Open (${list.filter((f) => f.status === 'open').length})` },
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
          <MessageSquare className="mx-auto text-gray-300" size={40} />
          <p className="mt-4 font-semibold text-gray-700">No feedback yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-gray-900">{f.subject}</p>
                  <p className="text-sm text-gray-500">
                    {f.userName} · <span className="capitalize">{f.userRole}</span> · {f.category}
                  </p>
                  <div className="mt-1 flex gap-0.5">
                    {[...Array(5)].map((_, n) => (
                      <Star key={n} size={12} className={n < f.rating ? 'text-amber-500' : 'text-gray-200'} fill={n < f.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                  f.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {f.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-700">{f.message}</p>
              <p className="mt-2 text-xs text-gray-400">{new Date(f.createdAt).toLocaleString()}</p>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                <select
                  defaultValue={f.status}
                  onChange={(e) => update(f.id, e.target.value, f.adminReply)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="open">Open</option>
                  <option value="resolved">Resolved</option>
                </select>
                <input
                  type="text"
                  defaultValue={f.adminReply}
                  placeholder="Admin reply…"
                  onBlur={(e) => update(f.id, f.status, e.target.value)}
                  className="min-w-[200px] flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
