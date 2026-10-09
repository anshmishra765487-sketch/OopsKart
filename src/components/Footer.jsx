import { useNavigate } from 'react-router-dom';
import { Github, RotateCcw, ShoppingCart } from 'lucide-react';
import { categories } from '../data/products.js';
import { useChaos } from '../hooks/useChaos.jsx';

export default function Footer() {
  const navigate = useNavigate();
  const { reset } = useChaos();

  const goCategory = (cat) => {
    navigate(cat === 'All' ? '/' : `/?category=${encodeURIComponent(cat)}`);
    window.setTimeout(() => {
      document
        .getElementById('shop')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <footer className="mt-16 border-t border-white/10 bg-navy-900/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-navy">
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold text-white">
              Oops<span className="text-brand">Kart</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/55">
            The world's worst e-commerce website, lovingly engineered to prove a
            point about good UX. Everything here is fictional.
          </p>
          <p className="mt-3 text-xs text-white/40">
            No real products. No real payments. No pigeons were confused
            permanently.
          </p>
        </div>

        <nav aria-label="Shop links">
          <h3 className="text-sm font-semibold text-white">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-white/60 transition hover:text-acid"
              >
                Home
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="text-white/60 transition hover:text-acid"
              >
                Cart
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="text-white/60 transition hover:text-acid"
              >
                Checkout demo
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-white/60 transition hover:text-acid"
              >
                UX Dashboard
              </button>
            </li>
          </ul>
        </nav>

        <nav aria-label="Categories">
          <h3 className="text-sm font-semibold text-white">Categories</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  onClick={() => goCategory(cat)}
                  className="text-white/60 transition hover:text-acid"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold text-white">The small print</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/55">
            <li>Products are 100% fictional.</li>
            <li>No card details are ever requested.</li>
            <li>Metrics shown are clearly labelled demo metrics.</li>
          </ul>
          <button
            type="button"
            onClick={reset}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:border-acid/60 hover:bg-white/10"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset chaos
          </button>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} OopsKart — a fictional UX demo. Built for
            learning, not for shopping.
          </p>
          <p className="flex items-center gap-1.5">
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
            Made with controlled chaos &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
