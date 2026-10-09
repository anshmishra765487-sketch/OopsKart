import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn, PartyPopper, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import CheckoutForm from '../components/CheckoutForm.jsx';
import { formatCurrency, makeOrderId, pick } from '../utils/formatCurrency.js';

const CONFIRM_LINES = [
  'Your order has been enthusiastically misplaced.',
  'A pigeon has been assigned and immediately distracted.',
  'Your package is now in a state we can only describe as “somewhere”.',
  'Thank you. We have no idea what happens next either.',
];

export default function Checkout() {
  const {
    items,
    subtotal,
    deliveryOption,
    deliveryCost,
    total,
    clear,
  } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);

  if (order) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="oops-pop rounded-3xl border border-acid/30 bg-navy-800/80 p-6 text-center shadow-2xl sm:p-10">
          <span className="text-6xl" aria-hidden="true">
            🎉🐦
          </span>
          <h1 className="mt-4 text-3xl font-bold text-white">
            Demo order placed!
          </h1>
          <p className="mt-1 text-sm text-white/60">
            {pick(CONFIRM_LINES)}
          </p>

          <div className="mx-auto mt-6 max-w-md rounded-2xl border border-white/10 bg-navy-900/60 p-5 text-left">
            <p className="text-xs uppercase tracking-wide text-white/45">
              Demo order ID
            </p>
            <p className="text-xl font-bold text-acid">{order.id}</p>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-white/70">
                <dt>Delivering to</dt>
                <dd className="font-semibold text-white">
                  {order.customer.fullName}
                </dd>
              </div>
              <div className="flex justify-between text-white/70">
                <dt>Items</dt>
                <dd className="font-semibold text-white">{order.count}</dd>
              </div>
              <div className="flex justify-between text-white/70">
                <dt>Delivery</dt>
                <dd className="font-semibold text-white">
                  {order.deliveryName}
                </dd>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 text-base">
                <dt className="font-semibold text-white">Total (fictional)</dt>
                <dd className="font-bold text-acid">
                  {formatCurrency(order.total)}
                </dd>
              </div>
            </dl>

            <p className="mt-3 text-[11px] leading-snug text-white/40">
              This is a simulation. No payment was taken, no product exists, and
              no pigeon was harmed.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-navy transition hover:bg-brand-soft"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Continue shopping
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-acid/60 hover:bg-white/10"
            >
              <PartyPopper className="h-4 w-4" aria-hidden="true" />
              View UX Dashboard
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
        <span className="text-6xl" aria-hidden="true">
          📦
        </span>
        <h1 className="text-3xl font-bold text-white">
          Nothing to check out
        </h1>
        <p className="max-w-md text-white/60">
          Your cart is empty, so checkout has nothing to misunderstand. Add a
          product first.
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

  if (!user) {
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
        <span className="text-6xl" aria-hidden="true">
          🔐
        </span>
        <h1 className="text-3xl font-bold text-white">Login required</h1>
        <p className="max-w-md text-white/60">
          Demo checkout needs a demo account. Log in to continue — it takes a few
          seconds, honest.
        </p>
        <Link
          to="/login?redirect=/checkout"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-navy transition hover:bg-brand-soft"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          Log in to continue
        </Link>
        <Link to="/" className="text-sm text-white/50 hover:text-acid">
          Keep shopping instead
        </Link>
      </section>
    );
  }

  const handlePlaceOrder = (customer) => {
    setOrder({
      id: makeOrderId(),
      customer,
      count: items.reduce((sum, it) => sum + it.qty, 0),
      total,
      deliveryName: deliveryOption.name,
    });
    clear();
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <button
        type="button"
        onClick={() => navigate('/cart')}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-acid"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to cart
      </button>

      <h1 className="text-3xl font-bold text-white">Checkout simulation</h1>
      <p className="mt-1 max-w-2xl text-sm text-white/55">
        A working demo checkout. All fields validate. No real payment information
        is ever collected, and no money changes hands.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CheckoutForm
            onPlaceOrder={handlePlaceOrder}
            defaultValues={{ fullName: user.name, email: user.email }}
          />
        </div>

        <aside className="h-fit rounded-2xl border border-white/10 bg-navy-800/70 p-5 lg:col-span-2">
          <h2 className="text-lg font-bold text-white">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                  style={{
                    background: `radial-gradient(circle at 40% 30%, ${item.accent}33, transparent 70%)`,
                  }}
                  aria-hidden="true"
                >
                  {item.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-white">
                    {item.name}
                  </span>
                  <span className="text-xs text-white/50">
                    Qty {item.qty} × {formatCurrency(item.price)}
                  </span>
                </span>
                <span className="text-sm font-semibold text-white">
                  {formatCurrency(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
            <div className="flex justify-between text-white/70">
              <dt>Subtotal</dt>
              <dd className="font-semibold text-white">
                {formatCurrency(subtotal)}
              </dd>
            </div>
            <div className="flex justify-between text-white/70">
              <dt>{deliveryOption.name}</dt>
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
            Delivery charge is shown transparently here and never hidden until
            the last step. That is the whole point.
          </p>
        </aside>
      </div>
    </section>
  );
}
