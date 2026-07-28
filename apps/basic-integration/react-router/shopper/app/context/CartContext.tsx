import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "../data/products";
import posthog from "../posthog.client";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    const quantity = existingItem ? existingItem.quantity + 1 : 1;

    posthog.capture("product_added_to_cart", {
      product_id: product.id,
      category: product.category,
      unit_price: product.price,
      quantity,
    });

    setCart(
      existingItem
        ? cart.map((item) =>
            item.id === product.id ? { ...item, quantity } : item
          )
        : [...cart, { ...product, quantity }]
    );
  };

  const removeFromCart = (productId: number) => {
    const item = cart.find((cartItem) => cartItem.id === productId);
    if (item) {
      posthog.capture("cart_item_removed", {
        product_id: item.id,
        category: item.category,
        unit_price: item.price,
        quantity: item.quantity,
      });
    }

    setCart(cart.filter((cartItem) => cartItem.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = cart.find((cartItem) => cartItem.id === productId);
    if (item && item.quantity !== quantity) {
      posthog.capture("cart_item_quantity_changed", {
        product_id: item.id,
        category: item.category,
        previous_quantity: item.quantity,
        quantity,
      });
    }

    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
