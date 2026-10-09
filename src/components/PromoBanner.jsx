import { promotions } from '../data/products.js';

export default function PromoBanner() {
  const strip = [...promotions, ...promotions];

  return (
    <section
      aria-label="Promotions (all fictional)"
      className="border-y border-white/10 bg-navy-900/80"
    >
      <div className="relative flex overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-8 py-3">
          {strip.map((promo, i) => (
            <span
              key={`${promo.id}-${i}`}
              className="flex shrink-0 items-center gap-2 text-sm font-semibold text-white/80"
            >
              <span aria-hidden="true">{promo.emoji}</span>
              <span className="text-brand-soft">{promo.text}</span>
              <span className="text-white/30" aria-hidden="true">
                •
              </span>
              <span className="text-xs font-normal text-white/45">
                {promo.detail}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
