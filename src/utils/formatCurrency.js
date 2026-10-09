/**
 * Formats a number as Indian Rupees.
 * @param {number} amount
 * @returns {string} e.g. "₹1,499"
 */
export function formatCurrency(amount) {
  const value = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Picks a random element from an array. Handy for our absurd copy.
 * @template T
 * @param {T[]} arr
 * @returns {T}
 */
export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates a fictional demo order id. Never a real transaction id.
 * @returns {string}
 */
export function makeOrderId() {
  const prefix = pick(['OOPS', 'SORRY', 'BRB', 'OOPSIE']);
  const digits = Math.floor(100000 + Math.random() * 899999);
  const suffix = pick(['KART', 'CART', 'OOPS', 'WHY']);
  return `${prefix}-${digits}-${suffix}`;
}

/**
 * Formats a discount percentage from price and mrp.
 * @param {number} price
 * @param {number} mrp
 * @returns {number}
 */
export function discountPercent(price, mrp) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

/**
 * Product stock label helper.
 * @param {number} stock
 * @returns {{ label: string, tone: 'in'|'low'|'out' }}
 */
export function stockStatus(stock) {
  if (stock <= 0) return { label: 'Out of stock (spiritually)', tone: 'out' };
  if (stock <= 3) return { label: `Only ${stock} left (allegedly)`, tone: 'low' };
  return { label: 'In stock', tone: 'in' };
}
