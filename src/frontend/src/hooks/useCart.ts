import { useCallback, useEffect, useState } from "react";
import type { CartItem, CartState } from "../types";

const CART_KEY = "kami-shopsy-cart";

function loadCart(): CartItem[] {
  try {
    const stored = sessionStorage.getItem(CART_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as CartItem[];
    // Restore bigint fields (serialized as strings)
    return parsed.map((item) => ({
      ...item,
      productId: BigInt(String(item.productId)),
      price: BigInt(String(item.price)),
    }));
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  const serializable = items.map((item) => ({
    ...item,
    productId: item.productId.toString(),
    price: item.price.toString(),
  }));
  sessionStorage.setItem(CART_KEY, JSON.stringify(serializable));
}

function computeState(items: CartItem[]): CartState {
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = items.reduce(
    (s, i) => s + i.price * BigInt(i.quantity),
    BigInt(0),
  );
  return { items, totalItems, totalAmount };
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => loadCart());

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === item.productId);
        if (existing) {
          return prev.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
              : i,
          );
        }
        return [...prev, { ...item, quantity: item.quantity ?? 1 }];
      });
    },
    [],
  );

  const removeItem = useCallback((productId: bigint) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: bigint, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return {
    ...computeState(items),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
