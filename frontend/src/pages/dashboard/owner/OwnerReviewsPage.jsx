import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import { getReviews, postReview, getRooms } from '../../../api/client';

export default function OwnerReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ roomId: '', targetId: '', targetRole: 'tenant', rating: 5, comment: '' });

  useEffect(() => {
    getReviews({ role: 'owner' }).then(setReviews);
    getReviews().then(setReviews);
    getRooms().then((d) => setRooms(d.rooms));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await postReview(form);
    getReviews().then(setReviews);
  };

  return (
    <DashboardLayout role="owner" title="Reviews">
      <form onSubmit={submit} className="mb-8 space-y-3 rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100">
        <h3 className="font-bold">Review a Tenant</h3>
        <select required value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })} className="w-full rounded-xl border px-4 py-2 text-sm">
          <option value="">Select your room</option>
          {rooms.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
        </select>
        <input required placeholder="Tenant user ID (from booking or admin)" value={form.targetId} onChange={(e) => setForm({ ...form, targetId: e.target.value })} className="w-full rounded-xl border px-4 py-2 text-sm" />
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} className={form.rating >= n ? 'text-amber-500' : 'text-gray-300'}>
              <Star size={24} fill={form.rating >= n ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
        <textarea required rows={3} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} className="w-full rounded-xl border px-4 py-2 text-sm" placeholder="Review tenant..." />
        <button type="submit" className="rounded-xl bg-brand-500 px-6 py-2 text-sm font-semibold text-white">Submit (+25 pts)</button>
      </form>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="flex justify-between"><span className="font-semibold">{r.reviewerName}</span><span className="text-amber-500">★ {r.rating}</span></div>
            <p className="mt-2 text-sm text-gray-600">{r.comment}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
