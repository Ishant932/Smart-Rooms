import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, KeyRound, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import AuthShell, { FormField, FormInput, FormButton, FormAlert } from '../components/AuthShell';
import { forgotPassword, resetPassword } from '../api/client';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [step, setStep] = useState('email'); // email | reset | done
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const title = useMemo(() => {
    if (step === 'done') return 'Password updated';
    if (step === 'reset') return 'Enter email OTP';
    return 'Forgot password';
  }, [step]);

  const subtitle = useMemo(() => {
    if (step === 'done') return 'You can sign in with your new password now.';
    if (step === 'reset') return `We emailed a 6-digit OTP to ${email}. Check inbox/spam, then continue.`;
    return 'We will email a one-time OTP to your registered address. Enter that code to reset your password.';
  }, [step, email]);

  const sendOtp = async (e) => {
    e?.preventDefault?.();
    setError('');
    setInfo('');
    setOtp('');
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const data = await forgotPassword(email.trim().toLowerCase());
      setInfo(data.message || 'If this email is registered, an OTP was sent.');
      setStep('reset');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not send OTP email. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(otp.trim())) {
      setError('Enter the 6-digit OTP from your email');
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
        otp: otp.trim(),
        newPassword: password,
      });
      setInfo(data.message || 'Password updated.');
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed. Use the latest OTP from your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={title}
      subtitle={subtitle}
      sideTitle="Email OTP reset"
      sidePoints={[
        'OTP is sent to your real email inbox',
        'Code expires in 10 minutes',
        'Check spam/junk if you do not see it',
        'Works for tenant, owner & admin accounts',
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
            {loading ? 'Sending email…' : 'Send OTP to email'}
          </FormButton>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={submitReset} className="space-y-5">
          <FormField label="Email" required>
            <FormInput icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
          <FormField label="OTP from your email" required>
            <FormInput
              icon={ShieldCheck}
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit code"
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
          {info && <FormAlert type="success">{info}</FormAlert>}
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
            Resend OTP email
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
