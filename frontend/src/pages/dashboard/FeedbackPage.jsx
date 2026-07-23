import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Star, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { getFeedback, postFeedback } from '../../api/client';

const CATEGORIES = {
  tenant: [
    { value: 'platform', label: 'Platform Experience' },
    { value: 'services', label: 'Smart Services' },
    { value: 'listings', label: 'Room Listings' },
    { value: 'payments', label: 'Wallet & Points' },
    { value: 'games', label: 'Games & Rewards' },
    { value: 'other', label: 'Other' },
  ],
  owner: [
    { value: 'platform', label: 'Platform Experience' },
    { value: 'listings', label: 'Listing Tools' },
    { value: 'tenants', label: 'Tenant Interactions' },
    { value: 'payments', label: 'Wallet & Earnings' },
    { value: 'support', label: 'Support & Admin' },
    { value: 'other', label: 'Other' },
  ],
};

export default function FeedbackPage({ role }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ rating: 5, category: 'platform', subject: '', message: '' });

  const load = () => getFeedback().then(setList).catch(() => setList([]));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = await postFeedback(form);
      setSuccess(data.message || 'Feedback submitted!');
      setForm({ rating: 5, category: 'platform', subject: '', message: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const title = role === 'owner' ? 'Owner Feedback' : 'Tenant Feedback';

  return (
    <DashboardLayout role={role} title={title}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-2xl bg-gradient-to-r from-violet-500 to-brand-600 p-5 text-white"
      >
        <p className="flex items-center gap-2 text-sm font-semibold">
          <MessageSquare size={16} /> Share your voice
        </p>
        <p className="mt-1 text-sm text-white/85">
          Help us improve SmartRoooms — {role === 'owner' ? 'owners' : 'tenants'} earn +3 points for thoughtful feedback.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={submit}
          className="rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-gray-100"
        >
          <h3 className="font-bold text-gray-900">Submit Feedback</h3>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase text-gray-500">Rating</label>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, rating: n }))}
                  className={`rounded-xl p-2 transition ${form.rating >= n ? 'text-amber-500' : 'text-gray-300 hover:text-amber-300'}`}
                >
                  <Star size={24} fill={form.rating >= n ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase text-gray-500">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
            >
              {CATEGORIES[role].map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase text-gray-500">Subject</label>
            <input
              required
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              placeholder="Brief summary…"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
            />
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase text-gray-500">Message</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Tell us what you love or what we should improve…"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
            />
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {success && (
            <p className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle size={16} /> {success}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-semibold text-white disabled:opacity-50"
          >
            <Send size={16} /> {loading ? 'Sending…' : 'Submit Feedback'}
          </motion.button>
        </motion.form>

        <div>
          <h3 className="mb-4 font-bold text-gray-900">Your Past Feedback</h3>
          {list.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white/60 p-10 text-center">
              <MessageSquare className="mx-auto text-gray-300" size={36} />
              <p className="mt-3 text-sm text-gray-500">No feedback yet — be the first to share!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {list.map((f, i) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{f.subject}</p>
                      <div className="mt-1 flex items-center gap-1">
                        {[...Array(5)].map((_, n) => (
                          <Star key={n} size={12} className={n < f.rating ? 'text-amber-500' : 'text-gray-200'} fill={n < f.rating ? 'currentColor' : 'none'} />
                        ))}
                        <span className="ml-2 text-xs capitalize text-gray-400">{f.category}</span>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      f.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {f.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">{f.message}</p>
                  {f.adminReply && (
                    <p className="mt-3 rounded-lg bg-brand-50 p-3 text-sm text-brand-800">
                      <strong>Team reply:</strong> {f.adminReply}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">{new Date(f.createdAt).toLocaleString()}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
