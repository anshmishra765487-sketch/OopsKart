import { Eye, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useChaos } from '../hooks/useChaos.jsx';
import { discountPercent, formatCurrency, stockStatus } from '../utils/formatCurrency.js';
import StarRating from './StarRating.jsx';

const ADD_LABELS = [
  'Add to cart',
  'Add to cart, probably',
  'Add it. What could go wrong?',
  'Add & pray',
  'YOLO the cart',
];

export default function ProductCard({ product, onAdd, onView, inCart, onRemove }) {
  const { activeLevel, mischief } = useChaos();
  const discount = discountPercent(product.price, product.mrp);
  const stock = stockStatus(product.stock);
  const outOfStock = product.stock <= 0;
  const addLabel = ADD_LABELS[Math.min(activeLevel, 5) - 1];

  const mischiefActive = mischief;

  const handleClick = () => {
    if (mischiefActive) {
      if (inCart) onRemove(product.id);
      else onAdd(product);
      return;
    }
    onAdd(product);
  };

  const btnLabel = mischiefActive
    ? inCart
      ? 'Remove from cart'
      : 'Add to cart (Mischief!)'
    : addLabel;

  const BtnIcon = mischiefActive && inCart ? Trash2 : Plus;

  return (
    <article className="product-card group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy-800/70 shadow-lg shadow-black/30 transition duration-300 hover:-translate-y-1 hover:border-brand/60 hover:shadow-2xl hover:shadow-brand/10">
      <div className="flex items-start justify-between gap-2 p-3">
        <div className="flex flex-wrap gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold text-navy">
              {discount}% off*
            </span>
          )}
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              stock.tone === 'out'
                ? 'bg-red-500/20 text-red-200'
                : stock.tone === 'low'
                  ? 'bg-amber-400/20 text-amber-100'
                  : 'bg-acid/20 text-acid'
            }`}
          >
            {stock.label}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onView(product)}
        className="chaos-image mx-3 flex h-36 items-center justify-center rounded-xl border border-white/10 text-6xl transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${product.accent}33, transparent 62%)`,
        }}
        aria-label={`View details for ${product.name}`}
      >
        <span aria-hidden="true">{product.emoji}</span>
      </button>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-soft">
          {product.category}
        </p>
        <h3 className="mt-1 text-base font-semibold leading-snug text-white">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-white/55">
          {product.tagline}
        </p>

        <div className="mt-3">
          <StarRating rating={product.rating} reviews={product.reviews} />
        </div>

        <div className="mt-3 flex items-end gap-2">
          <span className="text-xl font-bold text-acid">
            {formatCurrency(product.price)}
          </span>
          {product.mrp > product.price && (
            <span className="pb-1 text-sm text-white/40 line-through">
              {formatCurrency(product.mrp)}
            </span>
          )}
        </div>

        <div className="mt-4 flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => onView(product)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-semibold text-white/90 transition hover:border-acid/60 hover:text-white"
            aria-label={`See details for ${product.name}`}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Details
          </button>
          <button
            type="button"
            onClick={handleClick}
            disabled={outOfStock && !mischiefActive}
            className={`chaos-btn inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-bold text-navy transition disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40 ${
              mischiefActive && inCart
                ? 'bg-red-500 hover:bg-red-400 chaos-swapped'
                : 'bg-brand hover:bg-brand-soft'
            }`}
            aria-label={
              outOfStock && !mischiefActive
                ? `${product.name} is out of stock`
                : `${btnLabel} ${product.name}`
            }
          >
            {outOfStock && !mischiefActive ? (
              <>
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                Out of stock
              </>
            ) : (
              <>
                <BtnIcon className="h-4 w-4" aria-hidden="true" />
                {btnLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

