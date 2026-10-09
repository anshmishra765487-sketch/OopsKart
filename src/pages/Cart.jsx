import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart.jsx';
import { deliveryOptions } from '../data/products.js';
import { formatCurrency } from '../utils/formatCurrency.js';

export default function Cart() {
  const {
    items,
    itemCount,
    subtotal,
    deliveryId,
    setDeliveryId,
    deliveryCost,
    total,
    increment,
    decrement,
    remove,
    clear,
    maxQty,
    freeDeliveryThreshold,
    freeDeliveryApplies,
  } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
        <span className="text-6xl" aria-hidden="true">
          🛒
        </span>
        <h1 className="text-3xl font-bold text-white">Your cart is empty</h1>
        <p className="max-w-md text-white/60">
          An empty cart is the only part of OopsKart that works perfectly. Go add
          something gloriously unnecessary.
        </p>
        <Link
          to="/"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-navy transition hover:bg-brand-soft"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Back to shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Cart</h1>
          <p className="text-sm text-white/55">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} of uncertain
            usefulness.
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/20"
        >
          Clear cart
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <ul className="space-y-3 lg:col-span-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-navy-800/70 p-4 sm:flex-row sm:items-center"
            >
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl text-4xl"
                style={{
                  background: `radial-gradient(circle at 40% 30%, ${item.accent}33, transparent 70%)`,
                }}
                aria-hidden="true"
              >
                {item.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-white">{item.name}</h2>
                <p className="text-xs text-white/50">{item.tagline}</p>
                <p className="mt-1 text-sm text-white/70">
                  {formatCurrency(item.price)} each
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <div className="flex items-center gap-1 rounded-lg border border-white/15">
                  <button
                    type="button"
                    onClick={() => decrement(item.id)}
                    disabled={item.qty <= 1}
                    className="rounded-l-lg p-2 text-white/80 transition hover:bg-white/10 disabled:opacity-40"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="min-w-8 text-center text-sm font-semibold text-white">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => increment(item.id)}
                    disabled={item.qty >= maxQty}
                    className="rounded-r-lg p-2 text-white/80 transition hover:bg-white/10 disabled:opacity-40"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-acid">
                    {formatCurrency(item.price * item.qty)}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="rounded-md p-2 text-red-300 transition hover:bg-red-500/20"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-white/10 bg-navy-800/70 p-5">
          <h2 className="text-lg font-bold text-white">Order summary</h2>

          <fieldset className="mt-4">
            <legend className="text-xs font-semibold uppercase tracking-wide text-white/50">
              Delivery method
            </legend>
            <div className="mt-2 space-y-2">
              {deliveryOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 transition ${
                    deliveryId === option.id
                      ? 'border-brand bg-brand/10'
                      : 'border-white/15 bg-navy-900/40 hover:border-white/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={option.id}
                    checked={deliveryId === option.id}
                    onChange={() => setDeliveryId(option.id)}
                    className="mt-0.5 accent-brand"
                  />
                  <span className="flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-white">
                        {option.name}
                      </span>
                      <span className="text-sm font-bold text-acid">
                        {option.id === 'pigeon' && freeDeliveryApplies
                          ? 'FREE'
                          : formatCurrency(option.price)}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-xs text-white/50">
                      {option.eta} · {option.note}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <p className="mt-3 text-xs text-white/45">
            {freeDeliveryApplies
              ? 'Free standard pigeon delivery unlocked. The pigeon is thrilled.'
              : `Spend ${formatCurrency(
                  Math.max(0, freeDeliveryThreshold - subtotal),
                )} more for free standard pigeon delivery.`}
          </p>

          <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
            <div className="flex justify-between text-white/70">
              <dt>Subtotal</dt>
              <dd className="font-semibold text-white">
                {formatCurrency(subtotal)}
              </dd>
            </div>
            <div className="flex justify-between text-white/70">
              <dt>Delivery</dt>
              <dd className="font-semibold text-white">
                {deliveryCost === 0 ? 'FREE' : formatCurrency(deliveryCost)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2 text-base">
              <dt className="font-semibold text-white">Total</dt>
              <dd className="font-bold text-acid">{formatCurrency(total)}</dd>
            </div>
          </dl>

          <p className="mt-3 text-[11px] leading-snug text-white/40">
            All charges are fictional and disclosed here before checkout. No real
            money moves. Ever.
          </p>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="chaos-btn mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-navy transition hover:bg-brand-soft"
          >
            Proceed to checkout
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </aside>
      </div>
    </section>
  );
}
