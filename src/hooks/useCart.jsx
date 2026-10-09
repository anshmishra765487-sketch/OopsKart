import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { products, deliveryOptions, FREE_DELIVERY_THRESHOLD } from '../data/products.js';
import { useChaos } from './useChaos.jsx';
import { useSound } from './useSound.jsx';
import { useToast } from '../components/Toast.jsx';
import { pick } from '../utils/formatCurrency.js';

const STORAGE_KEY = 'oopskart.cart.v1';
const MAX_QTY = 10;

const ADD_MESSAGES = [
  'Added to cart. The cart is now slightly more confusing.',
  'Successfully added! Returns accepted never.',
  'Added. Your cart thanks you. Your wallet does not.',
  'In the cart now. We also added a mystery feeling, free of charge.',
  'Added to cart. Delivery estimate: a confident shrug.',
];

const REMOVE_MESSAGES = [
  'Removed. It will remember this.',
  'Gone. The cart is lighter, the guilt remains.',
  'Removed. Somewhere, a pigeon is disappointed.',
];

const CartContext = createContext(null);

function loadItems() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((it) => it && typeof it.id === 'string' && Number(it.qty) > 0)
      .map((it) => ({ id: it.id, qty: Math.min(MAX_QTY, Math.floor(it.qty)) }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { record, mischief } = useChaos();
  const { pushToast } = useToast();
  const { play } = useSound();

  const [items, setItems] = useState(loadItems);
  const [deliveryId, setDeliveryId] = useState('pigeon');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable - non-critical */
    }
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const add = useCallback(
    (product, qty = 1) => {
      if (!product || product.stock <= 0) {
        pushToast(
          'That item is out of stock. Spiritually, it never existed.',
          'warn',
        );
        return;
      }
      setItems((prev) => {
        const existing = prev.find((it) => it.id === product.id);
        if (existing) {
          return prev.map((it) =>
            it.id === product.id
              ? { ...it, qty: Math.min(MAX_QTY, it.qty + qty) }
              : it,
          );
        }
        return [...prev, { id: product.id, qty: Math.min(MAX_QTY, qty) }];
      });
      record({ weight: 4, message: pick(ADD_MESSAGES), type: 'success' });
      play(mischief ? 'chaloo' : 'chalo');
      setIsOpen(true);
    },
    [record, pushToast, play, mischief],
  );

  const remove = useCallback(
    (id) => {
      setItems((prev) => prev.filter((it) => it.id !== id));
      play('nhi');
      record({ weight: 2, message: pick(REMOVE_MESSAGES), type: 'info' });
    },
    [record, play],
  );

  const setQty = useCallback(
    (id, qty) => {
      const next = Math.max(1, Math.min(MAX_QTY, Math.floor(qty) || 1));
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, qty: next } : it)),
      );
      record({ weight: 1 });
    },
    [record],
  );

  const increment = useCallback(
    (id) => {
      setItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, qty: Math.min(MAX_QTY, it.qty + 1) } : it,
        ),
      );
      record({ weight: 1 });
    },
    [record],
  );

  const decrement = useCallback(
    (id) => {
      setItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it,
        ),
      );
      record({ weight: 1 });
    },
    [record],
  );

  const clear = useCallback(() => {
    setItems([]);
    play('nhi');
    record({
      weight: 2,
      message: 'Cart cleared. So, apparently, were your plans.',
      type: 'info',
    });
  }, [record, play]);

  const detailedItems = useMemo(
    () =>
      items
        .map((it) => {
          const product = products.find((p) => p.id === it.id);
          return product ? { ...product, qty: it.qty } : null;
        })
        .filter(Boolean),
    [items],
  );

  const itemCount = useMemo(
    () => items.reduce((sum, it) => sum + it.qty, 0),
    [items],
  );

  const subtotal = useMemo(
    () => detailedItems.reduce((sum, it) => sum + it.price * it.qty, 0),
    [detailedItems],
  );

  const deliveryOption = useMemo(
    () => deliveryOptions.find((o) => o.id === deliveryId) || deliveryOptions[0],
    [deliveryId],
  );

  const freeDeliveryApplies =
    deliveryId === 'pigeon' && subtotal >= FREE_DELIVERY_THRESHOLD;

  const deliveryCost = useMemo(() => {
    if (itemCount === 0) return 0;
    if (freeDeliveryApplies) return 0;
    return deliveryOption.price;
  }, [itemCount, freeDeliveryApplies, deliveryOption]);

  const total = subtotal + deliveryCost;

  const value = useMemo(
    () => ({
      items: detailedItems,
      itemCount,
      subtotal,
      deliveryId,
      setDeliveryId,
      deliveryOption,
      deliveryCost,
      freeDeliveryApplies,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      total,
      add,
      remove,
      setQty,
      increment,
      decrement,
      clear,
      isOpen,
      openCart,
      closeCart,
      maxQty: MAX_QTY,
    }),
    [
      detailedItems,
      itemCount,
      subtotal,
      deliveryId,
      deliveryOption,
      deliveryCost,
      freeDeliveryApplies,
      total,
      add,
      remove,
      setQty,
      increment,
      decrement,
      clear,
      isOpen,
      openCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
