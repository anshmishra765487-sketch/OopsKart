import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const STORAGE_KEY = 'oopskart.sound.v1';
const SoundContext = createContext(null);

/** Your meme clips, served from /public/media. */
const FILES = {
  chalo: '/media/chalo.mpeg',
  chaloo: '/media/chaloo.mpeg',
  nhi: '/media/nhiinhii.mpeg',
};

/** A tiny looping "chiptune" for background music (no files needed). */
const MELODY = [440, 523.25, 659.25, 523.25, 587.33, 493.88, 392, 440];
const BASS = [110, 146.83, 130.81, 98];

/**
 * Sound engine. Uses your real audio "memes" for effects, a built-in Web Audio
 * synth for clicks, and a synthesized loop for optional background music.
 */
export function SoundProvider({ children }) {
  const [muted, setMuted] = useState(() => {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === 'muted';
    } catch {
      return false;
    }
  });
  const [musicOn, setMusicOn] = useState(false);
  const ctxRef = useRef(null);
  const audioRef = useRef({});
  const musicTimerRef = useRef(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, muted ? 'muted' : 'on');
    } catch {
      /* storage unavailable - non-critical */
    }
  }, [muted]);

  const getCtx = useCallback(() => {
    try {
      if (!ctxRef.current) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctxRef.current = new AC();
      }
      if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
      return ctxRef.current;
    } catch {
      return null;
    }
  }, []);

  const tone = useCallback(
    (ctx, { freq, type = 'square', start = 0, duration = 0.12, gain = 0.05, freqEnd }) => {
      const t0 = ctx.currentTime + start;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (freqEnd) {
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(1, freqEnd),
          t0 + duration,
        );
      }
      g.gain.setValueAtTime(gain, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      osc.connect(g).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + duration + 0.02);
    },
    [],
  );

  const playFile = useCallback((name) => {
    const src = FILES[name];
    if (!src) return false;
    try {
      let audio = audioRef.current[name];
      if (!audio) {
        audio = new Audio(src);
        audio.preload = 'auto';
        audio.volume = 0.65;
        audioRef.current[name] = audio;
      }
      audio.currentTime = 0;
      const p = audio.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
      return true;
    } catch {
      return false;
    }
  }, []);

  const play = useCallback(
    (name) => {
      if (muted) return;
      if (playFile(name)) return;

      const ctx = getCtx();
      if (!ctx) return;
      switch (name) {
        case 'ching':
        case 'success':
          tone(ctx, { freq: 880, type: 'triangle', duration: 0.09 });
          tone(ctx, { freq: 1320, type: 'triangle', start: 0.07, duration: 0.16 });
          break;
        case 'pop':
          tone(ctx, { freq: 320, freqEnd: 120, type: 'sine', duration: 0.12, gain: 0.07 });
          break;
        case 'boing':
          tone(ctx, { freq: 180, freqEnd: 520, type: 'sawtooth', duration: 0.28 });
          tone(ctx, { freq: 520, freqEnd: 180, type: 'sawtooth', start: 0.26, duration: 0.22, gain: 0.04 });
          break;
        case 'click':
          tone(ctx, { freq: 620, freqEnd: 420, type: 'square', duration: 0.045, gain: 0.03 });
          break;
        case 'whoosh':
          tone(ctx, { freq: 200, freqEnd: 900, type: 'sine', duration: 0.35 });
          break;
        case 'sad':
          [523, 466, 392, 311].forEach((f, i) =>
            tone(ctx, { freq: f, type: 'sawtooth', start: i * 0.16, duration: 0.3, gain: 0.04 }),
          );
          break;
        case 'fanfare':
          [523, 659, 784, 1046].forEach((f, i) =>
            tone(ctx, { freq: f, type: 'triangle', start: i * 0.1, duration: 0.22 }),
          );
          break;
        case 'error':
          tone(ctx, { freq: 180, type: 'square', duration: 0.12, gain: 0.05 });
          tone(ctx, { freq: 140, type: 'square', start: 0.12, duration: 0.16, gain: 0.05 });
          break;
        default:
          break;
      }
    },
    [muted, playFile, getCtx, tone],
  );

  const stopMusic = useCallback(() => {
    if (musicTimerRef.current) {
      window.clearInterval(musicTimerRef.current);
      musicTimerRef.current = null;
    }
  }, []);

  const startMusic = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    stopMusic();
    const bpm = 92;
    const beat = 60 / bpm;
    let n = 0;
    const tick = () => {
      const c = getCtx();
      if (!c) return;
      for (let i = 0; i < 4; i += 1) {
        const j = (n + i) % MELODY.length;
        tone(c, {
          freq: MELODY[j],
          type: 'triangle',
          start: i * beat,
          duration: beat * 0.85,
          gain: 0.028,
        });
        if ((n + i) % 2 === 0) {
          tone(c, {
            freq: BASS[(((n + i) / 2) | 0) % BASS.length],
            type: 'sine',
            start: i * beat,
            duration: beat * 1.1,
            gain: 0.045,
          });
        }
      }
      n = (n + 4) % MELODY.length;
    };
    tick();
    musicTimerRef.current = window.setInterval(tick, beat * 4 * 1000);
  }, [getCtx, tone, stopMusic]);

  const toggleMusic = useCallback(() => {
    const next = !musicOn;
    setMusicOn(next);
    if (next) startMusic();
    else stopMusic();
  }, [musicOn, startMusic, stopMusic]);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  // Muting silences background music too.
  useEffect(() => {
    if (muted && musicOn) {
      stopMusic();
      setMusicOn(false);
    }
  }, [muted, musicOn, stopMusic]);

  useEffect(() => () => stopMusic(), [stopMusic]);

  const value = useMemo(
    () => ({ play, muted, toggleMute, setMuted, musicOn, toggleMusic }),
    [play, muted, toggleMute, musicOn, toggleMusic],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be used within a SoundProvider');
  return ctx;
}
