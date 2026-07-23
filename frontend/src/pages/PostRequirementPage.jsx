import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import ThreeDBackground from '../components/ThreeDBackground';
import { JAIPUR_LOCATIONS, LOOKING_FOR_OPTIONS, FACILITY_OPTIONS } from '../utils/helpers';

export default function PostRequirementPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: 'pg',
    area: '',
    budget: '',
    moveInDate: '',
    gender: '',
    facilities: [],
    notes: '',
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleFacility = (f) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(f) ? prev.facilities.filter((x) => x !== f) : [...prev.facilities, f],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login?redirect=/post-requirement'); return; }
    setLoading(true);
    try {
      await api.post('/requirements', { ...form, budget: Number(form.budget) || 0, city: 'Jaipur' });
      setDone(true);
    } catch {
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <CheckCircle className="mx-auto text-emerald-500" size={64} />
          <h2 className="mt-4 text-2xl font-bold">Requirement Posted!</h2>
          <p className="mt-2 text-gray-500">Owners in Jaipur will contact you directly. Zero brokerage.</p>
          <Link to="/rooms" className="mt-6 inline-block rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white">Browse Rooms</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-12">
      <ThreeDBackground variant="subtle" />
      <div className="relative mx-auto max-w-xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white/95 p-8 shadow-xl ring-1 ring-gray-100 backdrop-blur">
          <h1 className="text-2xl font-bold">Post Your Requirement</h1>
          <p className="mt-1 text-sm text-gray-500">Tell owners what you need — inspired by Room Rent Jaipur&apos;s Post Requirement</p>

          {!user && (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
              <Link to="/login" className="font-semibold underline">Login</Link> or <Link to="/signup" className="font-semibold underline">Sign up</Link> to post your requirement.
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <select value={form.type} onChange={(e) => update('type', e.target.value)} className="input-field">
              {LOOKING_FOR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={form.area} onChange={(e) => update('area', e.target.value)} required className="input-field">
              <option value="">Preferred area in Jaipur *</option>
              {JAIPUR_LOCATIONS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <input type="number" placeholder="Max budget (₹/month) *" required value={form.budget} onChange={(e) => update('budget', e.target.value)} className="input-field" />
            <input type="date" value={form.moveInDate} onChange={(e) => update('moveInDate', e.target.value)} className="input-field" />
            <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className="input-field">
              <option value="">Gender preference</option>
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
              <option value="any">Any</option>
            </select>
            <div>
              <p className="mb-2 text-sm font-medium">Required facilities</p>
              <div className="flex flex-wrap gap-2">
                {FACILITY_OPTIONS.slice(0, 12).map((f) => (
                  <button key={f} type="button" onClick={() => toggleFacility(f)} className={`rounded-full px-3 py-1 text-xs font-medium ${form.facilities.includes(f) ? 'bg-brand-500 text-white' : 'bg-gray-100'}`}>{f}</button>
                ))}
              </div>
            </div>
            <textarea placeholder="Additional notes..." value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={3} className="input-field resize-none" />
            <motion.button whileHover={{ scale: 1.02 }} type="submit" disabled={loading || !user} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 py-3.5 font-semibold text-white disabled:opacity-50">
              <Send size={18} /> {loading ? 'Posting...' : 'Post Requirement — Free'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
