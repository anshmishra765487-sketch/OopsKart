import { useMemo } from 'react';
import { useChaos } from '../hooks/useChaos.jsx';
import { promotions } from '../data/products.js';
import { pick } from '../utils/formatCurrency.js';

const EMOJIS = ['🛒', '📡', '🧦', '🫙', '☕', '🐦', '🍌', '🧊', '⏰', '🌀', '👟', '🔦'];

export default function ChaosLayer() {
  const { activeLevel } = useChaos();

  const drifters = useMemo(() => {
    if (activeLevel < 4) return [];
    const count = activeLevel >= 5 ? 16 : 9;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      left: Math.random() * 96,
      size: 18 + Math.random() * 26,
      duration: 9 + Math.random() * 12,
      delay: Math.random() * 10,
    }));
  }, [activeLevel]);

  const shout = useMemo(
    () => (activeLevel >= 4 ? pick(promotions) : null),
    [activeLevel],
  );

  if (activeLevel < 4) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[45] overflow-hidden"
      aria-hidden="true"
    >
      {drifters.map((d) => (
        <span
          key={d.id}
          className="chaos-float absolute"
          style={{
            left: `${d.left}%`,
            fontSize: `${d.size}px`,
            animation: `oops-drift ${d.duration}s linear ${d.delay}s infinite`,
          }}
        >
          {d.emoji}
        </span>
      ))}

      {shout && (
        <div className="absolute left-1/2 top-24 -translate-x-1/2">
          <div className="oops-pop flex items-center gap-2 rounded-full border border-brand/50 bg-navy-900/90 px-4 py-2 text-xs font-semibold text-brand-soft shadow-xl backdrop-blur">
            <span aria-hidden="true">{shout.emoji}</span>
            {shout.text}
          </div>
        </div>
      )}
    </div>
  );
}
