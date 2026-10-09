import { ArrowRight, Sparkles, Star, TrendingDown } from 'lucide-react';

const STATS = [
  { label: 'Happy customers', value: '0' },
  { label: 'Confused pigeons', value: '12' },
  { label: 'Real payments', value: '0' },
  { label: 'Refund policy', value: 'Lol' },
];

export default function Hero({ onShop, onChaos }) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-acid/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-acid/40 bg-acid/10 px-3 py-1 text-xs font-semibold text-acid">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            A UX experiment disguised as a store
          </span>

          <h1 className="chaos-heading mt-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Shopping made{' '}
            <span className="text-glow text-brand">unnecessarily</span>{' '}
            difficult.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            OopsKart starts as a polished, professional online store — then
            slowly descends into glorious, controlled chaos as you shop. Every
            feature works. Every frustration is intentional. Nothing is real.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onShop}
              className="chaos-btn inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-navy shadow-lg shadow-brand/30 transition hover:bg-brand-soft"
            >
              Start shopping (bravely)
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onChaos}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-acid/60 hover:bg-white/10"
            >
              Meet the chaos engine
            </button>
          </div>

          <dl className="mt-9 grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="text-[11px] uppercase tracking-wide text-white/45">
                  {stat.label}
                </dt>
                <dd className="mt-0.5 text-xl font-bold text-acid">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative rounded-3xl border border-white/10 bg-navy-800/70 p-5 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-acid" aria-hidden="true" />
                <span className="ml-2 text-xs text-white/50">
                  oopskart.example / store
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { emoji: '📡', name: 'Invisible Wi-Fi Cable', price: '₹1,499' },
                { emoji: '🫙', name: 'Premium Air in a Jar', price: '₹2,499' },
                { emoji: '🧦', name: 'Luxury Left Sock', price: '₹649' },
                { emoji: '🍞', name: 'Blockchain Toaster 2.0', price: '₹6,999' },
              ].map((p) => (
                <div
                  key={p.name}
                  className="rounded-2xl border border-white/10 bg-navy-900/60 p-3"
                >
                  <div className="flex h-16 items-center justify-center rounded-xl bg-white/5 text-3xl" aria-hidden="true">
                    {p.emoji}
                  </div>
                  <p className="mt-2 truncate text-xs font-semibold text-white">
                    {p.name}
                  </p>
                  <p className="text-sm font-bold text-acid">{p.price}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-brand/40 bg-brand/10 px-3 py-2">
              <span className="flex items-center gap-2 text-xs font-semibold text-brand-soft">
                <TrendingDown className="h-4 w-4" aria-hidden="true" />
                Prices may change while you read
              </span>
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            </div>
          </div>

          <div className="absolute -bottom-4 -left-4 hidden rotate-[-4deg] rounded-2xl border border-white/10 bg-navy-800 px-4 py-3 shadow-xl sm:block">
            <p className="text-[11px] uppercase tracking-wide text-white/45">
              Delivery by
            </p>
            <p className="text-sm font-bold text-white">Confused Pigeon™</p>
          </div>
        </div>
      </div>
    </section>
  );
}
