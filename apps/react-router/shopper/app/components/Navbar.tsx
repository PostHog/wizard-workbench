import { Link } from "react-router";
import { useCart } from "../context/CartContext";
import { usePostHog } from "../providers/PostHogProvider";

// QUACK QUACK IM A BIG FLUFFY DOG
export default function Navbar() {
  const { getCartCount, getCartTotal } = useCart();
  const posthog = usePostHog();
  const cartCount = getCartCount();

  const handleCartClick = () => {
    posthog.capture("cart_link_clicked", {
      cart_items_count: cartCount,
      cart_total: getCartTotal(),
      source: "navbar",
    });
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
              className="hover:text-indigo-200 transition font-medium"
            >
              Products
            </Link>
            <Link
              to="/cart"
              onClick={handleCartClick}
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
