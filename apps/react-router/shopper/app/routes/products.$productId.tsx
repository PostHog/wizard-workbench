import { Link, data } from "react-router";
import type { Route } from "./+types/products.$productId";
import { getProductById } from "../data/products";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { usePostHog } from "../providers/PostHogProvider";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const productId = parseInt(params.productId);
  const product = getProductById(productId);

  if (!product) {
    throw data("Product not found", { status: 404 });
  }

  return { product };
}

export default function ProductDetail({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;
  const { addToCart } = useCart();
  const posthog = usePostHog();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    posthog.capture("product_added_to_cart_from_detail", {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      product_category: product.category,
      quantity: quantity,
      total_value: product.price * quantity,
      source: "product_detail",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/products"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-xl shadow-lg"
          />
        </div>

        <div>
          <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full mb-4">
            {product.category}
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-indigo-600 mb-6">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-6">
            <span className="text-gray-700 font-medium">
              Stock Available:{" "}
              <span
                className={
                  product.stock > 10
                    ? "text-green-600"
                    : product.stock > 0
                    ? "text-yellow-600"
                    : "text-red-600"
                }
              >
                {product.stock} units
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <label className="text-gray-700 font-medium">Quantity:</label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100 transition"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1))
                  )
                }
                className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                min="1"
                max={product.stock}
              />
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="px-4 py-2 hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-indigo-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
