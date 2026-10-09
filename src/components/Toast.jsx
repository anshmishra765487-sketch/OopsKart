import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AlertTriangle, Info, PartyPopper, Sparkles, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  info: Info,
  success: PartyPopper,
  chaos: Sparkles,
  warn: AlertTriangle,
};

const TONE = {
  info: 'border-sky-400/40 text-sky-100',
  success: 'border-acid/50 text-acid-soft',
  chaos: 'border-brand/50 text-brand-soft',
  warn: 'border-amber-400/50 text-amber-100',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);
  const timersRef = useRef(new Map());

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const pushToast = useCallback(
    (message, type = 'info', duration = 4200) => {
      if (!message) return null;
      const id = (idRef.current += 1);
      setToasts((prev) => [...prev, { id, message, type }].slice(-4));
      if (duration > 0) {
        const timer = window.setTimeout(() => dismissToast(id), duration);
        timersRef.current.set(id, timer);
      }
      return id;
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({ pushToast, dismissToast }),
    [pushToast, dismissToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-3 sm:inset-x-auto sm:right-4 sm:items-end"
      role="region"
      aria-label="Notifications"
    >
      <div
        className="flex w-full max-w-sm flex-col gap-2"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] || Info;
          return (
            <div
              key={toast.id}
              className={`oops-pop pointer-events-auto flex items-start gap-3 rounded-xl border bg-navy-800/95 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur ${
                TONE[toast.type] || TONE.info
              }`}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p className="flex-1 text-sm leading-snug text-white/95">
                {toast.message}
              </p>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="rounded-md p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
