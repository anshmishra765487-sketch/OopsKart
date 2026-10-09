import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Music2,
  Music,
  Search,
  ShoppingCart,
  Store,
  UserRound,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useCart } from '../hooks/useCart.jsx';
import { useChaos } from '../hooks/useChaos.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useSound } from '../hooks/useSound.jsx';
import ChaosToggle from './ChaosToggle.jsx';

export default function Navbar() {
  const { itemCount, openCart } = useCart();
  const { record } = useChaos();
  const { user, logout } = useAuth();
  const { muted, toggleMute, musicOn, toggleMusic } = useSound();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (itemCount === 0) return undefined;
    setBump(true);
    const t = window.setTimeout(() => setBump(false), 520);
    return () => window.clearTimeout(t);
  }, [itemCount]);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = term.trim();
    setMobileOpen(false);
    navigate(q ? `/?q=${encodeURIComponent(q)}` : '/');
    record({ weight: 2 });
  };

  const goToShop = () => {
    setMobileOpen(false);
    navigate('/');
    window.setTimeout(() => {
      document
        .getElementById('shop')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-white/10 text-acid'
        : 'text-white/75 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 rounded-xl p-1 transition hover:opacity-90"
          aria-label="OopsKart home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-navy shadow-lg shadow-brand/30">
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-left leading-none">
            <span className="block text-lg font-bold tracking-tight text-white">
              Oops<span className="text-brand">Kart</span>
            </span>
            <span className="block text-[10px] font-medium text-white/45">
              shopping, eventually
            </span>
          </span>
        </button>

        <nav
          className="ml-2 hidden items-center gap-1 lg:flex"
          aria-label="Primary"
        >
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <button
            type="button"
            onClick={goToShop}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/5 hover:text-white"
          >
            Shop
          </button>
          <NavLink to="/dashboard" className={linkClass}>
            UX Dashboard
          </NavLink>
        </nav>

        <form
          onSubmit={submitSearch}
          role="search"
          className="relative ml-auto hidden max-w-xs flex-1 md:block"
        >
          <label htmlFor="nav-search" className="sr-only">
            Search products
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            aria-hidden="true"
          />
          <input
            id="nav-search"
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search the chaos…"
            className="w-full rounded-xl border border-white/15 bg-navy-900/70 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-brand focus:outline-none"
          />
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <div className="hidden sm:block">
            <ChaosToggle compact />
          </div>

          <button
            type="button"
            onClick={toggleMusic}
            aria-pressed={musicOn}
            className="rounded-xl border border-white/15 bg-white/5 p-2.5 text-white transition hover:border-acid/60 hover:bg-white/10"
            aria-label={musicOn ? 'Stop background music' : 'Start background music'}
            title={musicOn ? 'Music: ON' : 'Music: OFF'}
          >
            {musicOn ? (
              <Music2 className="h-5 w-5 text-acid animate-pulse" aria-hidden="true" />
            ) : (
              <Music className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            aria-pressed={!muted}
            className="rounded-xl border border-white/15 bg-white/5 p-2.5 text-white transition hover:border-acid/60 hover:bg-white/10"
            aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
            title={muted ? 'Sound: OFF' : 'Sound: ON'}
          >
            {muted ? (
              <VolumeX className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Volume2 className="h-5 w-5 text-acid" aria-hidden="true" />
            )}
          </button>

          {user ? (
            <div className="hidden items-center gap-1.5 sm:flex">
              <span className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-2.5 py-2 text-xs font-semibold text-acid">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                <span className="max-w-28 truncate">{user.name}</span>
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl border border-white/15 bg-white/5 p-2.5 text-white transition hover:border-brand/60 hover:bg-white/10"
                aria-label="Log out"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="hidden items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-semibold text-white transition hover:border-brand/60 hover:bg-white/10 sm:inline-flex"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Login
            </NavLink>
          )}

          <button
            type="button"
            onClick={openCart}
            className={`relative rounded-xl border border-white/15 bg-white/5 p-2.5 text-white transition hover:border-brand/60 hover:bg-white/10 ${
              bump ? 'oops-bump' : ''
            }`}
            aria-label={`Open cart, ${itemCount} ${
              itemCount === 1 ? 'item' : 'items'
            }`}
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-navy">
                {itemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-xl border border-white/15 bg-white/5 p-2.5 text-white lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-navy-800 px-4 py-4 lg:hidden"
        >
          <form onSubmit={submitSearch} role="search" className="relative mb-3">
            <label htmlFor="nav-search-mobile" className="sr-only">
              Search products
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
              aria-hidden="true"
            />
            <input
              id="nav-search-mobile"
              type="search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search the chaos…"
              className="w-full rounded-xl border border-white/15 bg-navy-900/70 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-brand focus:outline-none"
            />
          </form>
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            <NavLink
              to="/"
              end
              className={linkClass}
              onClick={() => setMobileOpen(false)}
            >
              <span className="inline-flex items-center gap-2">
                <Store className="h-4 w-4" aria-hidden="true" /> Home
              </span>
            </NavLink>
            <button
              type="button"
              onClick={goToShop}
              className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-white/75 transition hover:bg-white/5 hover:text-white"
            >
              <span className="inline-flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" aria-hidden="true" /> Shop
              </span>
            </button>
            <NavLink
              to="/dashboard"
              className={linkClass}
              onClick={() => setMobileOpen(false)}
            >
              <span className="inline-flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> UX
                Dashboard
              </span>
            </NavLink>
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-white/75 transition hover:bg-white/5 hover:text-white"
              >
                <span className="inline-flex items-center gap-2">
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Log out (
                  {user.name})
                </span>
              </button>
            ) : (
              <NavLink
                to="/login"
                className={linkClass}
                onClick={() => setMobileOpen(false)}
              >
                <span className="inline-flex items-center gap-2">
                  <LogIn className="h-4 w-4" aria-hidden="true" /> Login
                </span>
              </NavLink>
            )}
          </nav>
          <div className="mt-3">
            <ChaosToggle />
          </div>
        </div>
      )}
    </header>
  );
}
