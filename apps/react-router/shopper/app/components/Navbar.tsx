import { Link } from "react-router";
import { useCart } from "../context/CartContext";
import { usePostHog } from "@posthog/react";

export default function Navbar() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const posthog = usePostHog();

  const handleLogoClick = () => {
    posthog.capture("navbar_logo_clicked");
  };

  const handleProductsClick = () => {
    posthog.capture("navbar_products_clicked");
  };

  const handleCartClick = () => {
    posthog.capture("navbar_cart_clicked", {
      cart_items_count: cartCount,
    });
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            onClick={handleLogoClick}
            className="text-2xl font-bold hover:text-indigo-200 transition"
          >
            Shopper
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/products"
              onClick={handleProductsClick}
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
