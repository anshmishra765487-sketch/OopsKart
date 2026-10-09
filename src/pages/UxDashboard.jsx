import {
  Activity,
  Eye,
  Gauge,
  Info,
  MousePointerClick,
  RotateCcw,
  ShoppingCart,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import { useChaos, LEVEL_NAMES, LEVEL_BLURB } from '../hooks/useChaos.jsx';
import { useCart } from '../hooks/useCart.jsx';
import { products } from '../data/products.js';
import ChaosToggle from '../components/ChaosToggle.jsx';

const COMPARISON = [
  {
    bad: 'Randomly moving buttons',
    good: 'Controls stay exactly where users expect',
  },
  {
    bad: 'Delivery fees revealed at the very end',
    good: 'Transparent pricing shown before checkout',
  },
  {
    bad: 'Wobbling, rotating walls of content',
    good: 'Stable layouts and predictable navigation',
  },
  {
    bad: 'Endless animation and motion',
    good: 'Reduced-motion support and calm defaults',
  },
  {
    bad: 'Confusing, unlabelled controls',
    good: 'Semantic HTML and clear accessible labels',
  },
];

const PROBLEMS = [
  'Progressive animation makes content harder to read as the session continues.',
  'Constant visual movement increases cognitive load and distracts from tasks.',
  'Unstable elements break muscle memory and slow down returning users.',
  'Absurd pricing copy shows how hidden fees erode trust in real stores.',
  'A loud interface undermines accessibility for motion-sensitive users.',
];

export default function UxDashboard() {
  const {
    interactions,
    score,
    level,
    levelName,
    levelBlurb,
    explored,
    enabled,
    reset,
  } = useChaos();
  const { itemCount } = useCart();

  const metrics = [
    {
      label: 'Total interactions',
      value: interactions,
      icon: MousePointerClick,
      tone: 'text-brand-soft',
    },
    {
      label: 'Current chaos score',
      value: `${score}/100`,
      icon: Gauge,
      tone: 'text-acid',
    },
    {
      label: 'Cart item count',
      value: itemCount,
      icon: ShoppingCart,
      tone: 'text-brand-soft',
    },
    {
      label: 'Products explored',
      value: `${explored.length}/${products.length}`,
      icon: Eye,
      tone: 'text-sky-300',
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Hackathon UX Dashboard</h1>
          <p className="mt-1 max-w-2xl text-sm text-white/55">
            A live look at how your session behaviour drives the OopsKart chaos
            engine, and what real usability lessons it demonstrates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ChaosToggle />
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:border-acid/60 hover:bg-white/10"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset chaos
          </button>
        </div>
      </header>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-xs text-amber-100">
        <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
        These are demo metrics generated locally from your own clicks in this
        browser session. No real users were tested and no research findings are
        claimed.
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-navy-800/70 p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-white/50">
                  {metric.label}
                </p>
                <Icon className={`h-4 w-4 ${metric.tone}`} aria-hidden="true" />
              </div>
              <p className={`mt-2 text-3xl font-bold ${metric.tone}`}>
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-navy-800/70 p-5 lg:col-span-1">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-brand" aria-hidden="true" />
            <h2 className="text-lg font-bold text-white">Chaos level</h2>
          </div>
          <p className="mt-3 text-4xl font-bold text-acid">
            {enabled ? level : '—'}
          </p>
          <p className="text-sm font-semibold text-brand-soft">
            {enabled ? levelName : 'Chaos Mode OFF'}
          </p>
          <p className="mt-2 text-xs text-white/55">
            {enabled
              ? LEVEL_BLURB[level]
              : 'Visual chaos is paused. The score is preserved.'}
          </p>
          <div className="mt-4 flex gap-1" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((l) => (
              <div
                key={l}
                className={`h-1.5 flex-1 rounded-full ${
                  enabled && l <= level ? 'bg-brand' : 'bg-white/15'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/70 p-5 lg:col-span-2">
          <h2 className="text-lg font-bold text-white">
            Usability problems demonstrated
          </h2>
          <ul className="mt-3 space-y-2.5">
            {PROBLEMS.map((problem) => (
              <li key={problem} className="flex gap-2.5 text-sm text-white/65">
                <ThumbsDown
                  className="mt-0.5 h-4 w-4 shrink-0 text-red-300"
                  aria-hidden="true"
                />
                {problem}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-navy-800/70 p-5">
        <div className="flex items-center gap-2">
          <ThumbsUp className="h-5 w-5 text-acid" aria-hidden="true" />
          <h2 className="text-lg font-bold text-white">
            Bad UX vs. good UX
          </h2>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <caption className="sr-only">
              Comparison of poor and good user experience patterns
            </caption>
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-white/45">
                <th scope="col" className="pb-2 pr-4 font-semibold">
                  OopsKart (chaos)
                </th>
                <th scope="col" className="pb-2 font-semibold">
                  Great UX (the goal)
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.bad} className="border-t border-white/10">
                  <td className="py-3 pr-4 text-red-200/80">{row.bad}</td>
                  <td className="py-3 text-acid/90">{row.good}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
