import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../../components/DashboardLayout';
import DownloadCsvButton from '../../../components/DownloadCsvButton';
import { getAdminRequirements, updateAdminRequirement, deleteAdminRequirement } from '../../../api/client';

export default function AdminRequirementsPage() {
  const [requirements, setRequirements] = useState([]);

  const load = () => getAdminRequirements().then(setRequirements);
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await updateAdminRequirement(id, { status });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this requirement?')) return;
    await deleteAdminRequirement(id);
    load();
  };

  return (
    <DashboardLayout role="admin" title="Tenant Requirements">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">Requirements posted by registered tenants — contact them directly (zero brokerage).</p>
        <DownloadCsvButton
          filename="smartroooms-requirements"
          rows={requirements.map((r) => ({
            id: r.id, name: r.userName, email: r.userEmail, type: r.type, area: r.area, budget: r.budget, status: r.status,
          }))}
        />
      </div>

      {requirements.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center text-gray-500 ring-1 ring-gray-100">No requirements posted yet.</div>
      ) : (
        <div className="space-y-4">
          {requirements.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold">{r.userName}</h3>
                  <p className="text-sm text-gray-500">{r.type?.toUpperCase()} · {r.area} · Budget ₹{r.budget}/mo</p>
                  <p className="mt-1 text-xs text-gray-400">{r.userEmail} · {r.userPhone}</p>
                </div>
                <select value={r.status || 'open'} onChange={(e) => setStatus(r.id, e.target.value)} className="rounded-lg border px-3 py-1.5 text-sm">
                  <option value="open">Open</option>
                  <option value="matched">Matched</option>
                  <option value="closed">Closed</option>
                </select>
                <button type="button" onClick={() => remove(r.id)} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white">Delete</button>
              </div>
              {r.facilities?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.facilities.map((f) => <span key={f} className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">{f}</span>)}
                </div>
              )}
              {r.notes && <p className="mt-2 text-sm text-gray-600">{r.notes}</p>}
              <p className="mt-2 text-xs text-gray-400">Posted {new Date(r.createdAt).toLocaleString()}</p>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
