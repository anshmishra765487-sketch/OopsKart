import { PackageX } from 'lucide-react';
import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, onAdd, onView, onClear, inCartById = [], onRemove }) {
  const cartSet = new Set(inCartById);
  if (!products.length) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-dashed border-white/20 bg-navy-800/40 px-6 py-16 text-center">
        <PackageX className="h-12 w-12 text-brand" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-white">
          Nothing found. Very on-brand.
        </h3>
        <p className="max-w-md text-sm text-white/60">
          Your search returned zero products, which is technically a perfect
          result for the world's worst store. Try different keywords or clear the
          filters.
        </p>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="mt-1 rounded-xl bg-acid px-4 py-2 text-sm font-bold text-navy transition hover:bg-acid-soft"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={onAdd}
          onView={onView}
          inCart={cartSet.has(product.id)}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}