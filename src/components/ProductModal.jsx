import { useEffect, useRef } from 'react';
import { Plus, ShieldCheck, Truck, X } from 'lucide-react';
import { discountPercent, formatCurrency, stockStatus } from '../utils/formatCurrency.js';
import StarRating from './StarRating.jsx';

export default function ProductModal({ product, onClose, onAdd }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!product) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [product, onClose]);

  if (!product) return null;

  const discount = discountPercent(product.price, product.mrp);
  const stock = stockStatus(product.stock);
  const outOfStock = product.stock <= 0;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="oops-pop relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/10 bg-navy-800 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-navy-900/80 p-2 text-white/80 transition hover:bg-brand hover:text-navy"
          aria-label="Close product details"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div
          className="chaos-image flex h-48 items-center justify-center text-8xl sm:h-56"
          style={{
            background: `radial-gradient(circle at 40% 30%, ${product.accent}40, transparent 65%)`,
          }}
          aria-hidden="true"
        >
          {product.emoji}
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold text-brand-soft">
              {product.category}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                stock.tone === 'out'
                  ? 'bg-red-500/20 text-red-200'
                  : stock.tone === 'low'
                    ? 'bg-amber-400/20 text-amber-100'
                    : 'bg-acid/20 text-acid'
              }`}
            >
              {stock.label}
            </span>
            {discount > 0 && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                {discount}% off (asterisk pending)
              </span>
            )}
          </div>

          <h2
            id="product-modal-title"
            className="mt-3 text-2xl font-bold text-white"
          >
            {product.name}
          </h2>
          <p className="mt-1 text-sm italic text-brand-soft">{product.tagline}</p>

          <div className="mt-3">
            <StarRating rating={product.rating} reviews={product.reviews} />
          </div>

          <p className="mt-4 text-sm leading-relaxed text-white/70">
            {product.description}
          </p>

          <div className="mt-5 flex items-end gap-3">
            <span className="text-3xl font-bold text-acid">
              {formatCurrency(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="pb-1 text-base text-white/40 line-through">
                {formatCurrency(product.mrp)}
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-white/60 sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-acid" aria-hidden="true" />
              Delivered by a confused pigeon (fees disclosed at checkout)
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-acid" aria-hidden="true" />
              Returns: emotionally complicated
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onAdd(product);
              onClose();
            }}
            disabled={outOfStock}
            className="chaos-btn mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-base font-bold text-navy transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            {outOfStock ? 'Out of stock (still out of stock)' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
