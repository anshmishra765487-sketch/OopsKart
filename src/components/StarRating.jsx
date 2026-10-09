import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, reviews, className = '' }) {
  const rounded = Math.round(rating);
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span
        className="flex items-center gap-0.5"
        role="img"
        aria-label={`Rated ${rating} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i <= rounded
                ? 'fill-amber-400 text-amber-400'
                : 'text-white/25'
            }`}
            aria-hidden="true"
          />
        ))}
      </span>
      <span className="text-xs font-medium text-white/70">
        {rating.toFixed(1)}
        {typeof reviews === 'number' && (
          <span className="text-white/40"> ({reviews.toLocaleString('en-IN')})</span>
        )}
      </span>
    </div>
  );
}
