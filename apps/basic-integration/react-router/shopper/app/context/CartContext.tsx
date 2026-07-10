import { usePostHog } from "@posthog/react";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "../data/products";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
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

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });

    posthog?.capture("product_added_to_cart", {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      unit_price: product.price,
      quantity,
      source: "cart_context",
    });
  };

  const removeFromCart = (productId: number) => {
    const removedItem = cart.find((item) => item.id === productId);

    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

    if (removedItem) {
      posthog?.capture("cart_item_removed", {
        product_id: removedItem.id,
        product_name: removedItem.name,
        category: removedItem.category,
        quantity_removed: removedItem.quantity,
        cart_total_before_removal: getCartTotal(),
      });
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const existingItem = cart.find((item) => item.id === productId);

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );

    if (existingItem) {
      posthog?.capture("cart_quantity_updated", {
        product_id: existingItem.id,
        product_name: existingItem.name,
        category: existingItem.category,
        previous_quantity: existingItem.quantity,
        new_quantity: quantity,
      });
    }
  };

  const clearCart = () => {
    const clearedItems = cart.length;
    const clearedValue = getCartTotal();

    setCart([]);

    if (clearedItems > 0) {
      posthog?.capture("cart_cleared", {
        item_count: clearedItems,
        cart_total: clearedValue,
      });
    }
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
