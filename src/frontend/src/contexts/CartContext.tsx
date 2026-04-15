import { type ReactNode, createContext, useContext } from "react";
import { useCart } from "../hooks/useCart";

type CartContextType = ReturnType<typeof useCart>;

const CartContext = createContext<CartContextType | null>(null);

export function useCartContext(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx)
    throw new Error("useCartContext must be used inside CartContextProvider");
  return ctx;
}

interface CartContextProviderProps {
  children: ReactNode;
}

export function CartContextProvider({ children }: CartContextProviderProps) {
  const cart = useCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}
