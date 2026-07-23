import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Lock, Phone, Gift, MapPin, ChevronRight, ChevronLeft,
  Check, Shield, Home, Building2, Eye, EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthShell, {
  FormField, FormInput, FormSelect, FormButton, FormAlert,
  StepIndicator, RoleCard, ChipToggle,
} from '../components/AuthShell';
import {
  JAIPUR_LOCATIONS, COLLEGES, GENDER_OPTIONS, LOOKING_FOR_OPTIONS,
  PROPERTY_TYPE_OPTIONS, FACILITY_OPTIONS,
} from '../utils/helpers';

const STEPS = ['Account type', 'About you', 'Contact', 'Preferences', 'Password', 'Confirm'];

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    role: 'tenant',
    firstName: '',
    lastName: '',
    gender: '',
    age: '',
    email: '',
    phone: '',
    college: '',
    preferredArea: '',
    address: '',
    lookingFor: 'pg',
    budget: '',
    propertyTypes: [],
    facilities: [],
    password: '',
    confirmPassword: '',
    referralCode: searchParams.get('ref') || '',
    termsAccepted: false,
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleArray = (key, val) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val],
    }));
  };

  const validateStep = () => {
    setError('');
    if (step === 1) {
      if (!form.firstName.trim()) return setError('First name is required'), false;
      if (!form.gender) return setError('Please select gender'), false;
    }
    if (step === 2) {
      if (!form.email.trim()) return setError('Email is required'), false;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        return setError('Enter a valid email address'), false;
      }
      if (!form.phone.trim()) return setError('Phone number is required'), false;
      if (!/^\d{10}$/.test(form.phone.replace(/\D/g, '').slice(-10))) {
        return setError('Enter a valid 10-digit mobile number'), false;
      }
    }
    if (step === 4) {
      if (form.password.length < 6) return setError('Password must be at least 6 characters'), false;
      if (form.password !== form.confirmPassword) return setError('Passwords do not match'), false;
    }
    if (step === 5 && !form.termsAccepted) return setError('Accept Terms & Conditions to continue'), false;
    return true;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => { setError(''); setStep((s) => Math.max(s - 1, 0)); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        name: `${form.firstName} ${form.lastName}`.trim(),
        phone: form.phone.replace(/\D/g, '').slice(-10),
        age: form.age ? Number(form.age) : null,
        budget: form.budget ? Number(form.budget) : null,
      };
      delete payload.confirmPassword;
      const data = await register(payload);
      navigate(data.user.role === 'owner' ? '/dashboard/owner' : '/dashboard/tenant');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join SmartRoooms — earn 80 bonus points on signup."
      sideTitle="Register in 6 easy steps"
      sidePoints={[
        'Choose tenant or owner role',
        'Add phone, email & college',
        'Set password & accept terms',
        'Real profiles — no dummy accounts',
      ]}
      footer={
        <p className="mt-6 text-center text-sm text-gray-500">
          Already registered? <Link to="/login" className="font-semibold text-brand-600 hover:underline">Sign in</Link>
        </p>
      }
    >
      <StepIndicator steps={STEPS} current={step} />

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <RoleCard
                  selected={form.role === 'tenant'}
                  onClick={() => update('role', 'tenant')}
                  icon={User}
                  title="Tenant / Student"
                  desc="Find PG, flat or room partner in Jaipur"
                />
                <RoleCard
                  selected={form.role === 'owner'}
                  onClick={() => update('role', 'owner')}
                  icon={Building2}
                  title="Owner / Landlord"
                  desc="List your property — free, zero brokerage"
                />
              </div>
            )}

            {step === 1 && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="First name" required>
                    <FormInput icon={User} value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="Rahul" />
                  </FormField>
                  <FormField label="Last name">
                    <FormInput icon={User} value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Sharma" />
                  </FormField>
                </div>
                <FormField label="Gender" required>
                  <FormSelect icon={User} value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                    <option value="">Select gender</option>
                    {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </FormSelect>
                </FormField>
                <FormField label="Age" hint="Optional">
                  <FormInput type="number" min="16" max="60" value={form.age} onChange={(e) => update('age', e.target.value)} placeholder="20" />
                </FormField>
              </>
            )}

            {step === 2 && (
              <>
                <FormField label="Email" required>
                  <FormInput icon={Mail} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@email.com" />
                </FormField>
                <FormField label="Mobile number" required hint="10-digit Indian number">
                  <FormInput icon={Phone} type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="9876543210" />
                </FormField>
                <FormField label="College / Institute">
                  <FormSelect icon={Home} value={form.college} onChange={(e) => update('college', e.target.value)}>
                    <option value="">Select college</option>
                    {COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </FormSelect>
                </FormField>
                <FormField label="Address" hint="Optional">
                  <FormInput icon={MapPin} value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Street, area, Jaipur" />
                </FormField>
              </>
            )}

            {step === 3 && (
              <>
                <FormField label="Preferred area in Jaipur">
                  <FormSelect icon={MapPin} value={form.preferredArea} onChange={(e) => update('preferredArea', e.target.value)}>
                    <option value="">Select area</option>
                    {JAIPUR_LOCATIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </FormSelect>
                </FormField>
                {form.role === 'tenant' ? (
                  <>
                    <FormField label="Looking for">
                      <FormSelect value={form.lookingFor} onChange={(e) => update('lookingFor', e.target.value)}>
                        {LOOKING_FOR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </FormSelect>
                    </FormField>
                    <FormField label="Monthly budget (₹)">
                      <FormInput icon={Home} type="number" value={form.budget} onChange={(e) => update('budget', e.target.value)} placeholder="6000" />
                    </FormField>
                  </>
                ) : (
                  <FormField label="Property types you offer">
                    <div className="flex flex-wrap gap-2">
                      {PROPERTY_TYPE_OPTIONS.map((o) => (
                        <ChipToggle key={o.value} active={form.propertyTypes.includes(o.value)} onClick={() => toggleArray('propertyTypes', o.value)}>{o.label}</ChipToggle>
                      ))}
                    </div>
                  </FormField>
                )}
                <FormField label="Preferred facilities">
                  <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                    {FACILITY_OPTIONS.slice(0, 14).map((f) => (
                      <ChipToggle key={f} active={form.facilities.includes(f)} onClick={() => toggleArray('facilities', f)}>{f}</ChipToggle>
                    ))}
                  </div>
                </FormField>
              </>
            )}

            {step === 4 && (
              <>
                <FormField label="Password" required hint="Minimum 6 characters">
                  <FormInput
                    icon={Lock}
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="Create password"
                    rightSlot={(
                      <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-gray-600" aria-label="Toggle password">
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    )}
                  />
                </FormField>
                <FormField label="Confirm password" required>
                  <FormInput icon={Lock} type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="Re-enter password" />
                </FormField>
                <FormField label="Referral code" hint="Optional — get bonus if referred">
                  <FormInput icon={Gift} value={form.referralCode} onChange={(e) => update('referralCode', e.target.value.toUpperCase())} placeholder="ABCD1234" />
                </FormField>
              </>
            )}

            {step === 5 && (
              <>
                <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-brand-50/30 p-5 ring-1 ring-gray-100">
                  <p className="font-semibold text-gray-900">Review your details</p>
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    {[
                      ['Name', `${form.firstName} ${form.lastName}`.trim()],
                      ['Role', form.role],
                      ['Email', form.email],
                      ['Phone', form.phone],
                      ['Area', form.preferredArea || '—'],
                      ['College', form.college || '—'],
                    ].map(([k, v]) => (
                      <div key={k}><dt className="text-gray-400">{k}</dt><dd className="font-medium text-gray-800">{v}</dd></div>
                    ))}
                  </dl>
                </div>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-gray-100 p-4 transition hover:border-brand-200 has-[:checked]:border-brand-400 has-[:checked]:bg-brand-50/30">
                  <input type="checkbox" checked={form.termsAccepted} onChange={(e) => update('termsAccepted', e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600" />
                  <span className="text-sm text-gray-600">
                    I agree to the <Link to="/terms" target="_blank" className="font-semibold text-brand-600 hover:underline">Terms</Link>
                    {' '}and <Link to="/privacy" target="_blank" className="font-semibold text-brand-600 hover:underline">Privacy Policy</Link>
                  </span>
                </label>
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-100">
                  <Shield size={18} className="shrink-0" /> Zero brokerage · Secure signup · 80 welcome points
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {error && <div className="mt-4"><FormAlert>{error}</FormAlert></div>}

        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <button type="button" onClick={back} className="flex items-center gap-1 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50">
              <ChevronLeft size={18} /> Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-600">
              Continue <ChevronRight size={18} />
            </button>
          ) : (
            <FormButton type="submit" loading={loading} className="flex-1">
              <Check size={18} /> {loading ? 'Creating account…' : 'Create account — 80 pts'}
            </FormButton>
          )}
        </div>
      </form>
    </AuthShell>
  );
}
