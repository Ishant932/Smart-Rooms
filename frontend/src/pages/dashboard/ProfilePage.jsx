import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, GraduationCap, Save, Shield, Home } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import {
  JAIPUR_LOCATIONS, COLLEGES, GENDER_OPTIONS, LOOKING_FOR_OPTIONS,
  PROPERTY_TYPE_OPTIONS, FACILITY_OPTIONS,
} from '../../utils/helpers';

export default function ProfilePage({ role }) {
  const { user, wallet, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState(() => buildForm(user));

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleArray = (key, val) => {
    setForm((f) => ({
      ...f,
      [key]: f[key]?.includes(val) ? f[key].filter((x) => x !== val) : [...(f[key] || []), val],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      await api.patch('/auth/profile', {
        ...form,
        age: form.age ? Number(form.age) : null,
        budget: form.budget ? Number(form.budget) : null,
      });
      await refreshUser();
      setEditing(false);
      setMsg('Profile updated successfully');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 rounded-xl bg-gray-50/80 px-4 py-3">
      <Icon size={18} className="mt-0.5 shrink-0 text-brand-500" />
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
        <p className="font-medium text-gray-900">{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout role={role} title="My Profile">
      <div className="mx-auto max-w-3xl space-y-6">
        {msg && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`rounded-xl px-4 py-3 text-sm ${msg.includes('success') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
            {msg}
          </motion.p>
        )}

        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-indigo-600 to-purple-700 p-6 text-white shadow-xl sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm opacity-80 capitalize">{user?.role} account</p>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-sm opacity-80">{user?.email}</p>
              </div>
            </div>
            {wallet && (
              <div className="flex gap-3 text-sm">
                <span className="rounded-xl bg-white/20 px-4 py-2 backdrop-blur">₹{wallet.balance}</span>
                <span className="rounded-xl bg-white/20 px-4 py-2 backdrop-blur">{wallet.points} pts</span>
              </div>
            )}
          </div>
        </motion.div>

        <div className="flex justify-end gap-2">
          {!editing ? (
            <button onClick={() => setEditing(true)} className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-600">
              Edit Profile
            </button>
          ) : (
            <>
              <button onClick={() => { setEditing(false); setForm(buildForm(user)); }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>

        {!editing ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-3 sm:grid-cols-2">
            <DetailRow icon={User} label="Full Name" value={`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.name} />
            <DetailRow icon={Phone} label="Phone" value={user?.phone} />
            <DetailRow icon={Mail} label="Email" value={user?.email} />
            <DetailRow icon={GraduationCap} label="College" value={user?.college} />
            <DetailRow icon={MapPin} label="Preferred Area" value={user?.preferredArea} />
            <DetailRow icon={MapPin} label="Address" value={user?.address} />
            <DetailRow icon={User} label="Gender / Age" value={[user?.gender, user?.age].filter(Boolean).join(' · ')} />
            {user?.role === 'tenant' && (
              <>
                <DetailRow icon={Home} label="Looking For" value={LOOKING_FOR_OPTIONS.find((o) => o.value === user?.lookingFor)?.label || user?.lookingFor} />
                <DetailRow icon={Home} label="Budget" value={user?.budget ? `₹${user.budget}/mo` : null} />
              </>
            )}
            {user?.role === 'owner' && (
              <DetailRow icon={Home} label="Property Types" value={user?.propertyTypes?.join(', ')} />
            )}
            <DetailRow icon={Shield} label="Terms Accepted" value={user?.termsAcceptedAt ? new Date(user.termsAcceptedAt).toLocaleDateString() : 'Yes'} />
            <DetailRow icon={Shield} label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'} />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="First name" value={form.firstName} onChange={(v) => update('firstName', v)} />
              <Field label="Last name" value={form.lastName} onChange={(v) => update('lastName', v)} />
              <Field label="Phone" value={form.phone} onChange={(v) => update('phone', v)} />
              <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className="input-field">
                <option value="">Gender</option>
                {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              <Field label="Age" type="number" value={form.age} onChange={(v) => update('age', v)} />
              <select value={form.college} onChange={(e) => update('college', e.target.value)} className="input-field">
                <option value="">College</option>
                {COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={form.preferredArea} onChange={(e) => update('preferredArea', e.target.value)} className="input-field">
                <option value="">Preferred area</option>
                {JAIPUR_LOCATIONS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <Field label="Address" value={form.address} onChange={(v) => update('address', v)} />
            </div>
            {user?.role === 'tenant' && (
              <>
                <select value={form.lookingFor} onChange={(e) => update('lookingFor', e.target.value)} className="input-field">
                  {LOOKING_FOR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <Field label="Monthly budget (₹)" type="number" value={form.budget} onChange={(v) => update('budget', v)} />
              </>
            )}
            {user?.role === 'owner' && (
              <div>
                <p className="mb-2 text-sm font-medium">Property types</p>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPE_OPTIONS.map((o) => (
                    <Chip key={o.value} active={form.propertyTypes?.includes(o.value)} onClick={() => toggleArray('propertyTypes', o.value)}>{o.label}</Chip>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="mb-2 text-sm font-medium">Facilities</p>
              <div className="flex flex-wrap gap-2">
                {FACILITY_OPTIONS.map((f) => (
                  <Chip key={f} active={form.facilities?.includes(f)} onClick={() => toggleArray('facilities', f)}>{f}</Chip>
                ))}
              </div>
            </div>
            <Field label="Bio" value={form.bio} onChange={(v) => update('bio', v)} />
          </motion.div>
        )}

        {/* Facilities summary */}
        {user?.facilities?.length > 0 && !editing && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100">
            <h3 className="font-bold text-gray-900">My Preferred Facilities</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {user.facilities.map((f) => (
                <span key={f} className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 ring-1 ring-brand-100">{f}</span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

function buildForm(user) {
  return {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    college: user?.college || '',
    preferredArea: user?.preferredArea || '',
    address: user?.address || '',
    gender: user?.gender || '',
    age: user?.age || '',
    lookingFor: user?.lookingFor || 'pg',
    budget: user?.budget || '',
    propertyTypes: user?.propertyTypes || [],
    facilities: user?.facilities || [],
    bio: user?.bio || '',
  };
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="input-field" />
    </div>
  );
}

function Chip({ children, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-full px-3 py-1.5 text-xs font-medium ${active ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
      {children}
    </button>
  );
}
