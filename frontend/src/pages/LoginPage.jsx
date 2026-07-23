import { useState } from 'react';

import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';

import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

import AuthShell, { FormField, FormInput, FormButton, FormAlert } from '../components/AuthShell';



export default function LoginPage() {

  const { login } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [showPass, setShowPass] = useState(false);

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');

    if (!email.trim()) { setError('Please enter your email'); return; }

    if (!password) { setError('Please enter your password'); return; }

    setLoading(true);

    try {

      const data = await login(email.trim(), password);

      const redirect = searchParams.get('redirect') || location.state?.from?.pathname;

      if (redirect) navigate(redirect);

      else if (data.user.role === 'admin') navigate('/dashboard/admin');

      else if (data.user.role === 'owner') navigate('/dashboard/owner');

      else navigate('/dashboard/tenant');

    } catch (err) {

      setError(err.response?.data?.error || 'Login failed. Check email and password.');

    } finally {

      setLoading(false);

    }

  };



  return (

    <AuthShell

      title="Welcome back"

      subtitle="Sign in to chat with owners, save listings, and open your dashboard."

      sideTitle="Jaipur's student room platform"

      sidePoints={[

        'Chat with owners — no direct rent booking online',

        'Contact Now via SmartRoooms verified helpline',

        'Redeem 500 points for ₹50 rent credit',

        'Verified listings across Jaipur',

      ]}

      footer={

        <div className="mt-8 space-y-4 border-t border-gray-100 pt-6">

          <p className="text-center text-sm text-gray-500">

            New here?{' '}

            <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">

              Create free account

            </Link>

          </p>

          <p className="rounded-xl bg-gray-50 px-4 py-3 text-center text-xs text-gray-500">

            Demo admin: <span className="font-mono text-gray-700">admin@smartroooms.in</span> / <span className="font-mono text-gray-700">admin123</span>

          </p>

        </div>

      }

    >

      <form onSubmit={handleSubmit} className="space-y-6">

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



        <FormField label="Password" required>

          <FormInput

            icon={Lock}

            type={showPass ? 'text' : 'password'}

            autoComplete="current-password"

            value={password}

            onChange={(e) => setPassword(e.target.value)}

            placeholder="Enter your password"

            rightSlot={(

              <button

                type="button"

                onClick={() => setShowPass(!showPass)}

                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"

                aria-label={showPass ? 'Hide password' : 'Show password'}

              >

                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}

              </button>

            )}

          />

        </FormField>



        {error && <FormAlert>{error}</FormAlert>}



        <FormButton type="submit" loading={loading}>

          <LogIn size={18} />

          {loading ? 'Signing in…' : 'Sign in'}

        </FormButton>

      </form>

    </AuthShell>

  );

}


