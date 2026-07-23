import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, KeyRound, Eye, EyeOff, ArrowLeft, ShieldCheck, Copy, Check } from 'lucide-react';
import AuthShell, { FormField, FormInput, FormButton, FormAlert } from '../components/AuthShell';
import { forgotPassword, resetPassword } from '../api/client';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [step, setStep] = useState('email'); // email | reset | done
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [issuedOtp, setIssuedOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const title = useMemo(() => {
    if (step === 'done') return 'Password updated';
    if (step === 'reset') return 'Reset your password';
    return 'Forgot password';
  }, [step]);

  const subtitle = useMemo(() => {
    if (step === 'done') return 'You can sign in with your new password now.';
    if (step === 'reset') return 'Use the OTP below, then set a new password (min 6 characters).';
    return 'Enter your account email to get a one-time password reset code.';
  }, [step]);

  const sendOtp = async (e) => {
    e?.preventDefault?.();
    setError('');
    setInfo('');
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const data = await forgotPassword(email.trim().toLowerCase());
      if (data.error) {
        setError(data.error);
        return;
      }
      const code = data.otp ? String(data.otp) : '';
      setIssuedOtp(code);
      setOtp(code);
      setInfo(data.message || 'OTP ready. Continue below.');
      setStep('reset');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyOtp = async () => {
    if (!issuedOtp) return;
    try {
      await navigator.clipboard.writeText(issuedOtp);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    setError('');
    const code = (otp || issuedOtp).trim();
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit OTP shown above');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const data = await resetPassword({
        email: email.trim().toLowerCase(),
        otp: code,
        newPassword: password,
      });
      setInfo(data.message || 'Password updated.');
      setIssuedOtp('');
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed. Click “Get new OTP” and use the latest code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={title}
      subtitle={subtitle}
      sideTitle="Secure password recovery"
      sidePoints={[
        'Works for tenants, owners & admin',
        '6-digit OTP (valid 10 minutes)',
        'Do not request multiple codes — use the latest one',
        'Then sign in with your new password',
      ]}
      footer={
        <div className="mt-8 space-y-3 border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
          <Link to="/login" className="inline-flex items-center gap-2 font-semibold text-brand-600 hover:underline">
            <ArrowLeft size={16} /> Back to sign in
          </Link>
        </div>
      }
    >
      {step === 'email' && (
        <form onSubmit={sendOtp} className="space-y-6">
          <FormField label="Email address" required>
            <FormInput
              icon={Mail}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
          </FormField>
          {error && <FormAlert>{error}</FormAlert>}
          {info && <FormAlert type="success">{info}</FormAlert>}
          <FormButton type="submit" loading={loading}>
            <KeyRound size={18} />
            {loading ? 'Getting OTP…' : 'Get OTP'}
          </FormButton>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={submitReset} className="space-y-5">
          {issuedOtp && (
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Your OTP</p>
              <p className="mt-2 font-mono text-3xl font-extrabold tracking-[0.35em] text-gray-900">{issuedOtp}</p>
              <button
                type="button"
                onClick={copyOtp}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:underline"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy OTP'}
              </button>
              <p className="mt-2 text-xs text-gray-500">Use this latest code only. Getting a new OTP cancels the old one.</p>
            </div>
          )}

          <FormField label="Email" required>
            <FormInput icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
          <FormField label="6-digit OTP" required>
            <FormInput
              icon={ShieldCheck}
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
            />
          </FormField>
          <FormField label="New password" required>
            <FormInput
              icon={Lock}
              type={showPass ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              rightSlot={(
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            />
          </FormField>
          <FormField label="Confirm new password" required>
            <FormInput
              icon={Lock}
              type={showPass ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter password"
            />
          </FormField>
          {error && <FormAlert>{error}</FormAlert>}
          {info && !issuedOtp && <FormAlert type="success">{info}</FormAlert>}
          <FormButton type="submit" loading={loading}>
            <Lock size={18} />
            {loading ? 'Updating…' : 'Reset password'}
          </FormButton>
          <button
            type="button"
            disabled={loading}
            onClick={sendOtp}
            className="w-full text-center text-sm font-semibold text-brand-600 hover:underline disabled:opacity-50"
          >
            Get new OTP
          </button>
        </form>
      )}

      {step === 'done' && (
        <div className="space-y-6 text-center">
          {info && <FormAlert type="success">{info}</FormAlert>}
          <FormButton type="button" onClick={() => navigate('/login')}>
            Go to sign in
          </FormButton>
        </div>
      )}
    </AuthShell>
  );
}
