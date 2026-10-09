import { Activity, Eye, Gauge, MousePointerClick, RotateCcw } from 'lucide-react';
import { LEVEL_BLURB, LEVEL_NAMES, useChaos } from '../hooks/useChaos.jsx';
import ChaosToggle from './ChaosToggle.jsx';

export default function ChaosMeter() {
  const {
    score,
    level,
    activeLevel,
    interactions,
    explored,
    reset,
    enabled,
  } = useChaos();

  const shownLevel = enabled ? level : activeLevel;

  return (
    <section
      aria-label="Chaos meter"
      className="rounded-2xl border border-white/10 bg-navy-800/70 p-5 shadow-xl shadow-black/25 backdrop-blur"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-brand" aria-hidden="true" />
          <h2 className="text-lg font-bold text-white">Chaos Meter</h2>
        </div>
        <ChaosToggle />
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-4xl font-bold text-acid">{score}</span>
        <span className="text-sm text-white/50">/ 100 chaos points</span>
      </div>

      <div
        className="mt-3 h-3 w-full overflow-hidden rounded-full bg-navy-900/80"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Chaos score"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-acid via-brand-soft to-brand transition-[width] duration-500"
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-navy-900/50 p-3">
        <p className="text-sm font-semibold text-brand-soft">
          Level {shownLevel}: {LEVEL_NAMES[shownLevel]}
        </p>
        <p className="mt-1 text-xs text-white/60">
          {enabled
            ? LEVEL_BLURB[shownLevel]
            : 'Chaos Mode is OFF, so the visuals are resting. Your score is safe.'}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-navy-900/50 p-3">
          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-white/50">
            <MousePointerClick className="h-3.5 w-3.5" aria-hidden="true" />
            Interactions
          </p>
          <p className="mt-1 text-xl font-bold text-white">{interactions}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-navy-900/50 p-3">
          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-white/50">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            Explored
          </p>
          <p className="mt-1 text-xl font-bold text-white">{explored.length}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-1" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((l) => (
          <div
            key={l}
            className={`h-1.5 flex-1 rounded-full ${
              l <= shownLevel ? 'bg-brand' : 'bg-white/15'
            }`}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-[11px] text-white/45">
          <Activity className="h-3.5 w-3.5" aria-hidden="true" />
          Danger level: cosmetic only
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-acid/60 hover:bg-white/10"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset chaos
        </button>
      </div>
    </section>
  );
}
