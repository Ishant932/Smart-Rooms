import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../../components/DashboardLayout';
import { getRoomPartners, postRoomPartner } from '../../../api/client';
import { CITIES } from '../../../utils/helpers';

export default function TenantRoomPartnerPage() {
  const [partners, setPartners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ college: '', city: 'Jaipur', preferredLocation: '', budget: '', gender: 'any', description: '' });
  const [msg, setMsg] = useState('');

  const load = () => getRoomPartners().then(setPartners);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postRoomPartner({ ...form, budget: Number(form.budget), lookingFor: 'roommate' });
      setMsg('Posted! +30 points earned.');
      setShowForm(false);
      load();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed');
    }
  };

  return (
    <DashboardLayout role="tenant" title="Find Room Partner">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">Connect with students near your college looking for roommates</p>
        <button onClick={() => setShowForm(!showForm)} className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
          {showForm ? 'Cancel' : '+ Post Listing'}
        </button>
      </div>

      {msg && <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{msg}</p>}

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleSubmit}
          className="mb-6 space-y-3 rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="College name" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} className="rounded-xl border px-4 py-2 text-sm" />
            <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-xl border px-4 py-2 text-sm">
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input required placeholder="Preferred area" value={form.preferredLocation} onChange={(e) => setForm({ ...form, preferredLocation: e.target.value })} className="rounded-xl border px-4 py-2 text-sm" />
            <input required type="number" placeholder="Budget (₹/month)" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="rounded-xl border px-4 py-2 text-sm" />
          </div>
          <textarea required placeholder="About you & what you're looking for..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border px-4 py-2 text-sm" />
          <button type="submit" className="rounded-xl bg-brand-500 px-6 py-2 text-sm font-semibold text-white">Post (+30 pts)</button>
        </motion.form>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {partners.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{p.tenantName || 'Student'}</h3>
                <p className="text-sm text-brand-600">🎓 {p.college}</p>
              </div>
              <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-medium text-brand-600">₹{p.budget}/mo</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">{p.preferredLocation}, {p.city}</p>
            <p className="mt-2 text-sm text-gray-600">{p.description}</p>
            {p.contact && (
              <a href={`tel:${p.contact}`} className="mt-3 inline-block rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white">Contact</a>
            )}
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
