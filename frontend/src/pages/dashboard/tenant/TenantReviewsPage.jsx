import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import { getReviews, postReview, getRooms } from '../../../api/client';

export default function TenantReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ roomId: '', targetId: '', targetRole: 'owner', rating: 5, comment: '' });

  useEffect(() => {
    getReviews().then(setReviews);
    getRooms().then((d) => setRooms(d.rooms));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await postReview(form);
    setForm({ ...form, comment: '' });
    getReviews().then(setReviews);
  };

  return (
    <DashboardLayout role="tenant" title="Reviews">
      <p className="mb-6 text-sm text-gray-500">Review owners & rooms. Earn +25 points per review!</p>

      <form onSubmit={submit} className="mb-8 space-y-3 rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100">
        <h3 className="font-bold">Write a Review</h3>
        <select required value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })} className="w-full rounded-xl border px-4 py-2 text-sm">
          <option value="">Select room</option>
          {rooms.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
        </select>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} className={`p-1 ${form.rating >= n ? 'text-amber-500' : 'text-gray-300'}`}>
              <Star size={24} fill={form.rating >= n ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
        <textarea required rows={3} placeholder="Your experience..." value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} className="w-full rounded-xl border px-4 py-2 text-sm" />
        <button type="submit" className="rounded-xl bg-brand-500 px-6 py-2 text-sm font-semibold text-white">Submit Review</button>
      </form>

      <div className="space-y-4">
        {reviews.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{r.reviewerName}</span>
              <span className="flex items-center gap-1 text-amber-500"><Star size={14} fill="currentColor" />{r.rating}</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">{r.reviewerRole} → {r.targetRole}</p>
            <p className="mt-2 text-sm text-gray-600">{r.comment}</p>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
