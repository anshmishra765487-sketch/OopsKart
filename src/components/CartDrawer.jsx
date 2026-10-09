import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { useCart } from '../hooks/useCart.jsx';
import { useChaos } from '../hooks/useChaos.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    deliveryCost,
    total,
    increment,
    decrement,
    remove,
    isOpen,
    closeCart,
    maxQty,
  } = useCart();
  const { mischief } = useChaos();
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const go = (path) => {
    closeCart();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[55] flex justify-end" role="presentation">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="oops-slide-in relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-navy-800 shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand" aria-hidden="true" />
            <h2 className="text-lg font-bold text-white">
              Your Cart{' '}
              <span className="text-sm font-medium text-white/50">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="text-5xl" aria-hidden="true">
              🛒
            </span>
            <h3 className="text-lg font-semibold text-white">
              Your cart is empty
            </h3>
            <p className="text-sm text-white/60">
              An empty cart is the only thing this store gets right. Go add
              something unnecessary.
            </p>
            <button
              type="button"
              onClick={() => go('/')}
              className="mt-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-brand-soft"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-navy-900/50 p-3"
                >
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-3xl"
                    style={{
                      background: `radial-gradient(circle at 40% 30%, ${item.accent}33, transparent 70%)`,
                    }}
                    aria-hidden="true"
                  >
                    {item.emoji}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate text-sm font-semibold text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-white/50">
                      {formatCurrency(item.price)} each
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 rounded-lg border border-white/15">
                        <button
                          type="button"
                          onClick={() => decrement(item.id)}
                          className="rounded-l-lg p-1.5 text-white/80 transition hover:bg-white/10 disabled:opacity-40"
                          disabled={item.qty <= 1}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span
                          className="min-w-6 text-center text-sm font-semibold text-white"
                          aria-live="polite"
                        >
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => increment(item.id)}
                          className="rounded-r-lg p-1.5 text-white/80 transition hover:bg-white/10 disabled:opacity-40"
                          disabled={item.qty >= maxQty}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-acid">
                          {formatCurrency(item.price * item.qty)}
                        </span>
                        <button
                          type="button"
                          onClick={() => (mischief ? add({ ...item }) : remove(item.id))}
                          className={`rounded-md p-1.5 transition ${
                            mischief
                              ? 'bg-acid/10 text-acid hover:bg-acid/20'
                              : 'text-red-300 hover:bg-red-500/20'
                          }`}
                          aria-label={`${mischief ? 'Add back' : 'Remove'} ${item.name} from cart`}
                        >
                          {mischief ? (
                            <Plus className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-white/10 px-5 py-4">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-white/70">
                  <dt>Subtotal</dt>
                  <dd className="font-semibold text-white">
                    {formatCurrency(subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between text-white/70">
                  <dt>Delivery (est.)</dt>
                  <dd className="font-semibold text-white">
                    {deliveryCost === 0
                      ? 'FREE'
                      : formatCurrency(deliveryCost)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-base">
                  <dt className="font-semibold text-white">Total</dt>
                  <dd className="font-bold text-acid">
                    {formatCurrency(total)}
                  </dd>
                </div>
              </dl>
              <p className="mt-2 text-[11px] leading-snug text-white/40">
                Delivery is charged by a pigeon with no GPS. Final charges are
                always shown before checkout. No real money is ever taken.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => go('/checkout')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-navy transition hover:bg-brand-soft"
                >
                  Checkout demo
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-acid/60 hover:bg-white/5"
                >
                  View full cart
                </Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
