import { ArrowUpDown, RotateCcw, Search, X } from 'lucide-react';

const SORTS = [
  { id: 'featured', label: 'Featured (chaotically)' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
];

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  sort,
  onSortChange,
  query,
  onQueryChange,
  onClear,
  resultCount,
}) {
  return (
    <section
      id="shop"
      className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-10"
      aria-label="Browse and filter products"
    >
      <div className="rounded-2xl border border-white/10 bg-navy-800/60 p-4 shadow-xl shadow-black/20 backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-md">
            <label
              htmlFor="catalog-search"
              className="mb-2 block text-sm font-semibold text-white/80"
            >
              Search the catalogue
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                aria-hidden="true"
              />
              <input
                id="catalog-search"
                type="search"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Try “invisible”, “air”, “sock”…"
                className="w-full rounded-xl border border-white/15 bg-navy-900/70 py-2.5 pl-9 pr-9 text-sm text-white placeholder:text-white/35 focus:border-brand focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => onQueryChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/50 hover:bg-white/10 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div>
              <label
                htmlFor="catalog-sort"
                className="mb-2 block text-sm font-semibold text-white/80"
              >
                Sort by
              </label>
              <div className="relative">
                <ArrowUpDown
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                  aria-hidden="true"
                />
                <select
                  id="catalog-sort"
                  value={sort}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/15 bg-navy-900/70 py-2.5 pl-9 pr-8 text-sm text-white focus:border-brand focus:outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-brand/60 hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Clear filters
            </button>
          </div>
        </div>

        <div
          className="mt-5 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by category"
        >
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                  isActive
                    ? 'border-brand bg-brand text-navy shadow-lg shadow-brand/30'
                    : 'border-white/15 bg-white/5 text-white/80 hover:border-acid/60 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-white/60" aria-live="polite">
          Showing <span className="font-semibold text-acid">{resultCount}</span>{' '}
          {resultCount === 1 ? 'product' : 'products'}. Availability may be a
          state of mind.
        </p>
      </div>
    </section>
  );
}
