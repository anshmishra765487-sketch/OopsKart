import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useToast } from '../components/Toast.jsx';
import { useSound } from './useSound.jsx';

const STORAGE_KEY = 'oopskart.chaos.v1';
const MAX_SCORE = 100;

/** Chaos level from which Add/Remove buttons get mischievously swapped. */
export const MISCHIEF_LEVEL = 4;

export const LEVEL_NAMES = {
  1: 'Suspiciously Calm',
  2: 'Mildly Unsettling',
  3: 'Noticeably Wobbly',
  4: 'Aggressively Chaotic',
  5: 'Total Cart-astrophe',
};

export const LEVEL_BLURB = {
  1: 'The store looks professional. Enjoy it while it lasts.',
  2: 'Cards are leaning. Subtle colours are misbehaving.',
  3: 'Animations wake up. Buttons refuse to sit still.',
  4: 'Harmless visual surprises and absurd promotions appear.',
  5: 'Maximum chaos. The Reset button still works. It always did.',
};

const LEVEL_UP_MESSAGES = {
  2: 'Chaos Level 2: the product cards are leaning. Nothing is wrong. Everything is fine.',
  3: 'Chaos Level 3: things are wobbling now. This was always the plan.',
  4: 'Chaos Level 4: promotional chaos deployed. You did this to yourself.',
  5: 'Chaos Level 5: MAXIMUM CHAOS reached. Recall that a Reset button exists.',
};

/** Derives a 1-5 chaos level from a 0-100 score. */
export function levelFromScore(score) {
  if (score >= 80) return 5;
  if (score >= 60) return 4;
  if (score >= 40) return 3;
  if (score >= 20) return 2;
  return 1;
}

const ChaosContext = createContext(null);

function loadState() {
  const fallback = { enabled: true, score: 0, interactions: 0, explored: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : true,
      score:
        typeof parsed.score === 'number'
          ? Math.min(MAX_SCORE, Math.max(0, parsed.score))
          : 0,
      interactions:
        typeof parsed.interactions === 'number' ? parsed.interactions : 0,
      explored: Array.isArray(parsed.explored) ? parsed.explored : [],
    };
  } catch {
    return fallback;
  }
}

export function ChaosProvider({ children }) {
  const { pushToast } = useToast();
  const { play } = useSound();
  const initial = useRef(loadState());

  const [enabled, setEnabledState] = useState(initial.current.enabled);
  const [score, setScore] = useState(initial.current.score);
  const [interactions, setInteractions] = useState(initial.current.interactions);
  const [explored, setExplored] = useState(initial.current.explored);

  const level = useMemo(() => levelFromScore(score), [score]);
  const prevLevel = useRef(level);

  // Persist to localStorage.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ enabled, score, interactions, explored }),
      );
    } catch {
      /* storage unavailable - non-critical */
    }
  }, [enabled, score, interactions, explored]);

  // Announce level increases.
  useEffect(() => {
    if (level > prevLevel.current && enabled) {
      pushToast(LEVEL_UP_MESSAGES[level], 'chaos', 5200);
      play('whoosh');
    }
    prevLevel.current = level;
  }, [level, enabled, pushToast, play]);

  /**
   * Central interaction recorder. Always counts an interaction.
   * Only raises the chaos score while Chaos Mode is ON.
   */
  const record = useCallback(
    ({ weight = 5, message = null, type = 'chaos', productId = null } = {}) => {
      setInteractions((count) => count + 1);
      if (enabled) {
        setScore((s) => Math.min(MAX_SCORE, s + weight));
      }
      if (message) pushToast(message, type);
      if (productId) {
        setExplored((prev) =>
          prev.includes(productId) ? prev : [...prev, productId],
        );
      }
    },
    [enabled, pushToast],
  );

  const trackView = useCallback(
    (productId) => {
      record({ weight: 3, productId });
    },
    [record],
  );

  const toggleEnabled = useCallback(() => {
    const next = !enabled;
    setEnabledState(next);
    pushToast(
      next
        ? 'Chaos Mode ON. Buckle up (seatbelts also fictional).'
        : 'Chaos Mode OFF. The store has been sedated. Score is preserved.',
      next ? 'chaos' : 'success',
    );
  }, [enabled, pushToast]);

  const setEnabled = useCallback(
    (next) => {
      const value = Boolean(next);
      setEnabledState(value);
      pushToast(
        value
          ? 'Chaos Mode ON. Buckle up.'
          : 'Chaos Mode OFF. Calm restored, score preserved.',
        value ? 'chaos' : 'success',
      );
    },
    [pushToast],
  );

  const reset = useCallback(() => {
    setScore(0);
    setInteractions(0);
    setExplored([]);
    prevLevel.current = 1;
    play('nhi');
    pushToast(
      'Chaos reset. Order has been restored. This is temporary.',
      'success',
    );
  }, [pushToast, play]);

  const activeLevel = enabled ? level : 1;
  const mischief = enabled && level >= MISCHIEF_LEVEL;

  const value = useMemo(
    () => ({
      enabled,
      score,
      level,
      activeLevel,
      mischief,
      mischiefLevel: MISCHIEF_LEVEL,
      levelName: LEVEL_NAMES[level],
      levelBlurb: LEVEL_BLURB[level],
      interactions,
      explored,
      record,
      trackView,
      toggleEnabled,
      setEnabled,
      reset,
    }),
    [
      enabled,
      score,
      level,
      activeLevel,
      mischief,
      interactions,
      explored,
      record,
      trackView,
      toggleEnabled,
      setEnabled,
      reset,
    ],
  );

  return <ChaosContext.Provider value={value}>{children}</ChaosContext.Provider>;
}

export function useChaos() {
  const ctx = useContext(ChaosContext);
  if (!ctx) {
    throw new Error('useChaos must be used within a ChaosProvider');
  }
  return ctx;
}
