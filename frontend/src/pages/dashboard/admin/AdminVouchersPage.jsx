import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import DownloadCsvButton from '../../../components/DownloadCsvButton';
import { getAdminVouchers, createAdminVoucher, updateAdminVoucher, deleteAdminVoucher } from '../../../api/client';

const empty = {
  code: '',
  title: '',
  description: '',
  discountType: 'flat',
  discountValue: 50,
  minPoints: 0,
  maxUses: 100,
  active: true,
  audience: 'all',
};

export default function AdminVouchersPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  const reload = () => getAdminVouchers().then(setList).catch(() => setError('Could not load vouchers'));

  useEffect(() => { reload(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createAdminVoucher({
        ...form,
        code: form.code.trim().toUpperCase(),
        discountValue: Number(form.discountValue),
        minPoints: Number(form.minPoints) || 0,
        maxUses: Number(form.maxUses) || 0,
      });
      setForm(empty);
      await reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create voucher');
    }
  };

  const toggle = async (v) => {
    await updateAdminVoucher(v.id, { active: !v.active });
    await reload();
  };

  const remove = async (v) => {
    if (!window.confirm(`Delete voucher ${v.code}?`)) return;
    await deleteAdminVoucher(v.id);
    await reload();
  };

  const csvRows = list.map((v) => ({
    code: v.code,
    title: v.title,
    type: v.discountType,
    value: v.discountValue,
    audience: v.audience,
    active: v.active,
    used: v.usedCount || 0,
    maxUses: v.maxUses,
    createdAt: v.createdAt,
  }));

  return (
    <DashboardLayout role="admin" title="Vouchers & Discounts">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">Create promo codes and rent discounts for tenants or everyone.</p>
        <DownloadCsvButton filename="smartroooms-vouchers" rows={csvRows} />
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={create}
        className="mb-8 grid gap-3 rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-2 font-bold text-gray-900">
          <Plus size={18} className="text-brand-500" /> New voucher
        </div>
        <input required placeholder="CODE" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="rounded-xl border px-3 py-2 text-sm uppercase" />
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl border px-3 py-2 text-sm" />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl border px-3 py-2 text-sm" />
        <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="rounded-xl border px-3 py-2 text-sm">
          <option value="flat">Flat ₹ off</option>
          <option value="percent">Percent %</option>
          <option value="points">Bonus points</option>
        </select>
        <input type="number" min="1" required value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="rounded-xl border px-3 py-2 text-sm" placeholder="Value" />
        <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} className="rounded-xl border px-3 py-2 text-sm">
          <option value="all">Everyone</option>
          <option value="tenant">Tenants only</option>
          <option value="owner">Owners only</option>
        </select>
        <input type="number" min="0" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="rounded-xl border px-3 py-2 text-sm" placeholder="Max uses" />
        <button type="submit" className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white sm:col-span-2 lg:col-span-1">Create</button>
      </motion.form>

      <div className="space-y-3">
        {list.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 p-2.5 text-white">
                <Ticket size={18} />
              </div>
              <div>
                <p className="font-mono text-lg font-bold text-gray-900">{v.code}</p>
                <p className="font-semibold text-gray-800">{v.title}</p>
                <p className="text-xs text-gray-500">
                  {v.discountType === 'flat' && `₹${v.discountValue} off`}
                  {v.discountType === 'percent' && `${v.discountValue}% off`}
                  {v.discountType === 'points' && `+${v.discountValue} pts`}
                  {' · '}{v.audience} · used {v.usedCount || 0}/{v.maxUses || '∞'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => toggle(v)} className="inline-flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold">
                {v.active ? <ToggleRight className="text-emerald-600" size={18} /> : <ToggleLeft className="text-gray-400" size={18} />}
                {v.active ? 'Active' : 'Off'}
              </button>
              <button type="button" onClick={() => remove(v)} className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
        {!list.length && <p className="rounded-2xl bg-white p-8 text-center text-gray-500">No vouchers yet — create one above.</p>}
      </div>
    </DashboardLayout>
  );
}
