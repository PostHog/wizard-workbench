import { Link } from "react-router";
import posthog from "posthog-js";
import { useCart } from "../context/CartContext";

const isPostHogConfigured =
  typeof window !== "undefined" &&
  Boolean(
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      import.meta.env.VITE_PUBLIC_POSTHOG_HOST
  );

export default function Navbar() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const captureNavigation = (event: "products_navigation_clicked" | "cart_navigation_clicked") => {
    if (isPostHogConfigured) {
      posthog.capture(event, { cart_item_count: cartCount });
    }
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold hover:text-indigo-200 transition">
            Shopper
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/products"
              onClick={() => captureNavigation("products_navigation_clicked")}
              className="hover:text-indigo-200 transition font-medium"
            >
              Products
            </Link>
            <Link
              to="/cart"
              onClick={() => captureNavigation("cart_navigation_clicked")}
              className="relative hover:text-indigo-200 transition font-medium"
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
