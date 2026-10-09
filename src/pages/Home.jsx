import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Accessibility, BadgeDollarSign, MousePointerClick, Puzzle } from 'lucide-react';
import { categories, products } from '../data/products.js';
import { useCart } from '../hooks/useCart.jsx';
import { useChaos } from '../hooks/useChaos.jsx';
import Hero from '../components/Hero.jsx';
import PromoBanner from '../components/PromoBanner.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import ProductModal from '../components/ProductModal.jsx';
import ChaosMeter from '../components/ChaosMeter.jsx';

const UX_NOTES = [
  {
    icon: Puzzle,
    title: 'Progressive chaos',
    text: 'The interface degrades as you interact, mimicking feature creep and needless animation.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Transparent pricing',
    text: 'Delivery fees are always disclosed before checkout, so the joke never becomes a dark pattern.',
  },
  {
    icon: MousePointerClick,
    title: 'Stable, findable controls',
    text: 'Buttons never move or hide. Chaos stays cosmetic so the store remains fully usable.',
  },
  {
    icon: Accessibility,
    title: 'Accessibility first',
    text: 'Semantic HTML, visible focus, keyboard support and reduced-motion respect throughout.',
  },
];

export default function Home() {
  const [searchParams] = useSearchParams();
  const { add, remove, items } = useCart();
  const { record, trackView } = useChaos();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(
    categories.includes(searchParams.get('category'))
      ? searchParams.get('category')
      : 'All',
  );
  const [sort, setSort] = useState('featured');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setQuery(q);
    const c = searchParams.get('category');
    if (c && categories.includes(c)) setCategory(c);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) => category === 'All' || p.category === category,
    );
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    const sorted = [...list];
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sorted.sort((a, b) => b.reviews - a.reviews);
    }
    return sorted;
  }, [category, query, sort]);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleView = (product) => {
    setSelected(product);
    trackView(product.id);
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('All');
    setSort('featured');
    record({ weight: 2, message: 'Filters cleared. A rare moment of clarity.', type: 'success' });
  };

  return (
    <>
      <Hero onShop={() => scrollTo('shop')} onChaos={() => scrollTo('chaos')} />
      <PromoBanner />

      <CategoryFilter
        categories={categories}
        activeCategory={category}
        onCategoryChange={(c) => {
          setCategory(c);
          record({ weight: 3, message: `Filtered to ${c}. Bold choice.`, type: 'info' });
        }}
        sort={sort}
        onSortChange={(s) => {
          setSort(s);
          record({ weight: 2 });
        }}
        query={query}
        onQueryChange={setQuery}
        onClear={clearFilters}
        resultCount={filtered.length}
      />

      <div className="mx-auto w-full max-w-7xl px-4 pb-4">
        <ProductGrid
          products={filtered}
          onAdd={add}
          onView={handleView}
          onClear={clearFilters}
          inCartById={items.map((i) => i.id)}
          onRemove={remove}
        />
      </div>

      <section id="chaos" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ChaosMeter />
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-navy-800/70 p-6 shadow-xl shadow-black/25">
              <h2 className="text-2xl font-bold text-white">
                The UX experiment behind OopsKart
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-white/65">
                Every frustration here maps to a real usability problem.
                Interact with the store and watch the chaos score climb — then
                reset it to see exactly what good, predictable design feels like.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {UX_NOTES.map((note) => {
                  const Icon = note.icon;
                  return (
                    <div
                      key={note.title}
                      className="rounded-xl border border-white/10 bg-navy-900/50 p-4"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/15 text-brand">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <h3 className="text-sm font-semibold text-white">
                          {note.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-white/55">
                        {note.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductModal
        product={selected}
        onClose={() => setSelected(null)}
        onAdd={add}
      />
    </>
  );
}
