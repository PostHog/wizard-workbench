import { Link } from "react-router";
import { useCart, type CartItem } from "../context/CartContext";
import { usePostHog } from "../providers/PostHogProvider";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const posthog = usePostHog();

  const handleRemoveFromCart = (item: CartItem) => {
    removeFromCart(item.id);
    posthog.capture("product_removed_from_cart", {
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      product_category: item.category,
      quantity_removed: item.quantity,
    });
  };

  const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
    const oldQuantity = item.quantity;
    updateQuantity(item.id, newQuantity);
    posthog.capture("cart_quantity_updated", {
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      old_quantity: oldQuantity,
      new_quantity: newQuantity,
      change: newQuantity - oldQuantity,
    });
  };

  const handleProceedToCheckout = () => {
    posthog.capture("proceed_to_checkout_clicked", {
      cart_total: getCartTotal(),
      cart_items_count: cart.length,
      cart_items: cart.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  };

  const handleContinueShopping = () => {
    posthog.capture("continue_shopping_clicked", {
      cart_total: getCartTotal(),
      cart_items_count: cart.length,
    });
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <svg
            className="w-24 h-24 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add some products to get started!
          </p>
          <Link
            to="/products"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <Link
                    to={`/products/${item.id}`}
                    className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition"
                  >
                    {item.name}
                  </Link>
                  <p className="text-gray-600 mt-1">{item.category}</p>
                  <p className="text-2xl font-bold text-indigo-600 mt-2">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleRemoveFromCart(item)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition"
                    >
                      -
                    </button>
                    <span className="font-semibold w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-lg font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (10%)</span>
                <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>${(getCartTotal() * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              onClick={handleProceedToCheckout}
              className="block w-full bg-indigo-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-indigo-700 transition"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              onClick={handleContinueShopping}
              className="block w-full mt-3 bg-gray-200 text-gray-900 py-3 rounded-lg text-center font-semibold hover:bg-gray-300 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
