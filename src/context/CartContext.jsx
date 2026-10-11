import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const KEY = 'elyscents_cart';
const MAX_QTY = 20;

function readCart() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) {
      /* ignore */
    }
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const limit = Math.min(MAX_QTY, Math.max(1, product.stock || 1));
      const existing = prev.find((i) => i.id === product._id);
      if (existing) {
        return prev.map((i) =>
          i.id === product._id ? { ...i, stock: product.stock, qty: Math.min(limit, i.qty + qty) } : i
        );
      }
      return [
        ...prev,
        {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image || '',
          family: product.family,
          sizeMl: product.sizeMl,
          stock: product.stock,
          qty: Math.min(limit, qty),
        },
      ];
    });
  }, []);

  const setQty = useCallback((id, qty) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const limit = Math.min(MAX_QTY, Math.max(1, i.stock || 1));
        return { ...i, qty: Math.max(1, Math.min(limit, qty)) };
      })
    );
  }, []);

  const removeItem = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    return { items, count, total, addItem, setQty, removeItem, clear };
  }, [items, addItem, setQty, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
