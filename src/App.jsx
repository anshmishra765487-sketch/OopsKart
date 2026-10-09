import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import ChaosLayer from './components/ChaosLayer.jsx';
import Home from './pages/Home.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import UxDashboard from './pages/UxDashboard.jsx';
import Login from './pages/Login.jsx';
import { useChaos } from './hooks/useChaos.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
      <span className="text-6xl" aria-hidden="true">
        🧭
      </span>
      <h1 className="text-3xl font-bold text-white">
        404 — This page got delivered by the pigeon
      </h1>
      <p className="max-w-md text-white/60">
        It may arrive eventually. In the meantime, the real chaos is back at the
        store.
      </p>
      <Link
        to="/"
        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-navy transition hover:bg-brand-soft"
      >
        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
        Return to OopsKart
      </Link>
    </section>
  );
}

export default function App() {
  const { activeLevel } = useChaos();

  useEffect(() => {
    document.documentElement.dataset.chaos = String(activeLevel);
    document.documentElement.lang = 'en';
  }, [activeLevel]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-acid focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-navy"
      >
        Skip to main content
      </a>
      <ScrollToTop />
      <ChaosLayer />
      <Navbar />
      <main id="main-content" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dashboard" element={<UxDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
