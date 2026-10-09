import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { DEMO_ACCOUNT, useAuth } from '../hooks/useAuth.jsx';

const inputClass =
  'w-full rounded-xl border border-white/15 bg-navy-900/70 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-brand focus:outline-none';

export default function Login() {
  const { user, login, signup, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const result =
      mode === 'login' ? login(email, password) : signup(name, email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError('');
    navigate(redirectTo);
  };

  const fillDemo = () => {
    setMode('login');
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    setError('');
  };

  const switchMode = (next) => {
    setMode(next);
    setError('');
  };

  if (user) {
    return (
      <section className="mx-auto w-full max-w-md px-4 py-20">
        <div className="rounded-3xl border border-acid/30 bg-navy-800/80 p-8 text-center">
          <span className="text-5xl" aria-hidden="true">
            👋
          </span>
          <h1 className="mt-4 text-2xl font-bold text-white">
            You are already logged in
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Signed in as <span className="font-semibold text-acid">{user.name}</span>{' '}
            ({user.email}). That is genuinely convenient. Suspiciously so.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-navy transition hover:bg-brand-soft"
            >
              Continue shopping
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-acid/60 hover:bg-white/5"
            >
              Log out
            </button>
          </div>
        </div>
      </section>
    );
  }

  const isSignup = mode === 'signup';

  return (
    <section className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 lg:grid-cols-2 lg:items-center">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-acid/40 bg-acid/10 px-3 py-1 text-xs font-semibold text-acid">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          A demo login, for a demo store
        </span>
        <h1 className="mt-4 text-4xl font-bold leading-tight text-white">
          {isSignup ? 'Create an ' : 'Welcome back to '}
          <span className="text-brand">Oops</span>Kart
        </h1>
        <p className="mt-3 max-w-md text-sm text-white/65">
          An account lets you track orders that will never arrive. It exists only
          in your browser — no servers, no emails, no real passwords. Please do
          not type a real password.
        </p>
        <ul className="mt-5 space-y-2 text-sm text-white/60">
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-acid" aria-hidden="true" />
            No data leaves this device.
          </li>
          <li className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-acid" aria-hidden="true" />
            Cart and chaos persist with or without an account.
          </li>
        </ul>
      </div>

      <div className="rounded-3xl border border-white/10 bg-navy-800/80 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="mb-5 flex rounded-xl border border-white/10 bg-navy-900/60 p-1">
          <button
            type="button"
            onClick={() => switchMode('login')}
            aria-pressed={!isSignup}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              !isSignup ? 'bg-brand text-navy' : 'text-white/70 hover:text-white'
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            aria-pressed={isSignup}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              isSignup ? 'bg-brand text-navy' : 'text-white/70 hover:text-white'
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={submit} noValidate className="space-y-4">
          {isSignup && (
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-white/80"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Ada Placeholder"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-white/80"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'auth-error' : undefined}
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-white/80"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'auth-error' : undefined}
                className={`${inputClass} pr-10`}
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p id="auth-error" role="alert" className="text-xs text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="chaos-btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-navy transition hover:bg-brand-soft"
          >
            {isSignup ? (
              <>
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Create demo account
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Log in
              </>
            )}
          </button>
        </form>

        <button
          type="button"
          onClick={fillDemo}
          className="mt-3 w-full rounded-xl border border-acid/40 bg-acid/10 px-4 py-2.5 text-xs font-semibold text-acid transition hover:bg-acid/20"
        >
          Use demo account ({DEMO_ACCOUNT.email} / {DEMO_ACCOUNT.password})
        </button>

        <p className="mt-4 text-center text-xs text-white/45">
          {isSignup ? 'Already have an account? ' : 'No account? '}
          <button
            type="button"
            onClick={() => switchMode(isSignup ? 'login' : 'signup')}
            className="font-semibold text-brand-soft underline-offset-2 hover:underline"
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>

        <p className="mt-4 text-center text-xs text-white/35">
          <Link to="/" className="hover:text-white">
            Continue as guest
          </Link>{' '}
          — login is only required for the demo checkout.
        </p>
      </div>
    </section>
  );
}
