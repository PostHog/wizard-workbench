import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "../data/products";

function captureCartEvent(
  event: "product_added_to_cart" | "product_removed_from_cart" | "cart_quantity_updated",
  properties: Record<string, number | string>,
) {
  void import("../posthog.client").then(({ default: posthog }) => {
    posthog.capture(event, properties);
  });
}

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
    const quantity = (existingItem?.quantity ?? 0) + 1;

    setCart((prevCart) => {
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity } : item,
        );
      }
      return [...prevCart, { ...product, quantity }];
    });

    captureCartEvent("product_added_to_cart", {
      product_id: product.id,
      product_category: product.category,
      unit_price: product.price,
      quantity,
    });
  };

  const removeFromCart = (productId: number) => {
    const item = cart.find((cartItem) => cartItem.id === productId);
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== productId));

    if (item) {
      captureCartEvent("product_removed_from_cart", {
        product_id: item.id,
        product_category: item.category,
        unit_price: item.price,
        quantity: item.quantity,
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
        cartItem.id === productId ? { ...cartItem, quantity } : cartItem,
      ),
    );

    if (item) {
      captureCartEvent("cart_quantity_updated", {
        product_id: item.id,
        product_category: item.category,
        unit_price: item.price,
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
