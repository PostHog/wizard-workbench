import { createContext, useContext, useState, type ReactNode } from "react";
import { usePostHog } from "@posthog/react";
import type { Product } from "../data/products";

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
  const posthog = usePostHog();
  const isPostHogConfigured = Boolean(
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      import.meta.env.VITE_PUBLIC_POSTHOG_HOST
  );

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    if (isPostHogConfigured) {
      posthog.capture("product_added_to_cart", {
        product_id: product.id,
        product_category: product.category,
        quantity: 1,
        unit_price: product.price,
      });
    }
  };

  const removeFromCart = (productId: number) => {
    const item = cart.find((cartItem) => cartItem.id === productId);
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== productId));
    if (item && isPostHogConfigured) {
      posthog.capture("cart_item_removed", {
        product_id: item.id,
        product_category: item.category,
        quantity: item.quantity,
        unit_price: item.price,
      });
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = cart.find((cartItem) => cartItem.id === productId);
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === productId ? { ...cartItem, quantity } : cartItem
      )
    );
    if (item && item.quantity !== quantity && isPostHogConfigured) {
      posthog.capture("cart_item_quantity_updated", {
        product_id: item.id,
        product_category: item.category,
        previous_quantity: item.quantity,
        quantity,
      });
    }
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
