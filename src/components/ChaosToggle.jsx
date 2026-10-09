import { useChaos } from '../hooks/useChaos.jsx';

export default function ChaosToggle({ compact = false }) {
  const { enabled, toggleEnabled } = useChaos();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={toggleEnabled}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        enabled
          ? 'border-brand/60 bg-brand/15 text-brand-soft'
          : 'border-white/15 bg-white/5 text-white/60'
      }`}
      aria-label={`Chaos Mode is ${enabled ? 'on' : 'off'}. Toggle chaos mode`}
    >
      <span
        className={`relative inline-flex h-4 w-8 shrink-0 items-center rounded-full transition ${
          enabled ? 'bg-brand' : 'bg-white/20'
        }`}
        aria-hidden="true"
      >
        <span
          className={`absolute h-3 w-3 rounded-full bg-navy transition ${
            enabled ? 'left-4' : 'left-0.5'
          }`}
        />
      </span>
      {compact ? 'Chaos' : `Chaos Mode: ${enabled ? 'ON' : 'OFF'}`}
    </button>
  );
}
