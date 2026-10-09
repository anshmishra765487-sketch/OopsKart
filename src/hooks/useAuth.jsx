import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useToast } from '../components/Toast.jsx';
import { useChaos } from './useChaos.jsx';

const STORAGE_KEY = 'oopskart.user.v1';

/** Public demo account. Not a real account. Not a real password. */
export const DEMO_ACCOUNT = {
  name: 'Demo Human',
  email: 'demo@oopskart.test',
  password: 'chaos123',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthContext = createContext(null);

function loadUser() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.email === 'string' && typeof parsed.name === 'string') {
      return { name: parsed.name, email: parsed.email };
    }
    return null;
  } catch {
    return null;
  }
}

function nameFromEmail(email) {
  const base = email.split('@')[0].replace(/[._-]+/g, ' ');
  return base.replace(/\b\w/g, (c) => c.toUpperCase()) || 'Valued Human';
}

export function AuthProvider({ children }) {
  const { pushToast } = useToast();
  const { record } = useChaos();
  const [user, setUser] = useState(loadUser);

  useEffect(() => {
    try {
      if (user) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* storage unavailable - non-critical */
    }
  }, [user]);

  const login = useCallback(
    (email, password) => {
      const normalized = email.trim().toLowerCase();
      if (!EMAIL_RE.test(normalized)) {
        return { ok: false, error: 'Please enter a valid email address.' };
      }
      if (password.length < 6) {
        return { ok: false, error: 'Password must be at least 6 characters.' };
      }
      const name =
        normalized === DEMO_ACCOUNT.email
          ? DEMO_ACCOUNT.name
          : nameFromEmail(normalized);
      setUser({ name, email: normalized });
      record({
        weight: 5,
        message: `Welcome, ${name}. You are now “logged in” to a website that does not exist.`,
        type: 'success',
      });
      return { ok: true };
    },
    [record],
  );

  const signup = useCallback(
    (name, email, password) => {
      const trimmed = name.trim();
      const normalized = email.trim().toLowerCase();
      if (trimmed.length < 2) {
        return { ok: false, error: 'Please enter a name of at least 2 characters.' };
      }
      if (!EMAIL_RE.test(normalized)) {
        return { ok: false, error: 'Please enter a valid email address.' };
      }
      if (password.length < 6) {
        return { ok: false, error: 'Password must be at least 6 characters.' };
      }
      setUser({ name: trimmed, email: normalized });
      record({
        weight: 6,
        message: `Account “created”, ${trimmed}! It lives only in your browser and nowhere else.`,
        type: 'success',
      });
      return { ok: true };
    },
    [record],
  );

  const logout = useCallback(() => {
    setUser(null);
    record({
      weight: 2,
      message: 'Logged out. Your fictional account already misses you.',
      type: 'info',
    });
  }, [record]);

  const value = useMemo(
    () => ({ user, isAuthed: Boolean(user), login, signup, logout }),
    [user, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
