import { Link } from "react-router";
import type { Route } from "./+types/products";
import { getProducts, getCategories, type Product } from "../data/products";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { usePostHog } from "../providers/PostHogProvider";

export async function clientLoader() {
  return {
    products: getProducts(),
    categories: getCategories(),
  };
}

export default function Products({ loaderData }: Route.ComponentProps) {
  const { products, categories } = loaderData;
  const { addToCart } = useCart();
  const posthog = usePostHog();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    posthog.capture("product_added_to_cart", {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      product_category: product.category,
      source: "products_list",
    });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length >= 2) {
      posthog.capture("product_searched", {
        search_term: term,
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    posthog.capture("product_category_filtered", {
      category: category || "all",
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Products</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-600 py-12">
          No products match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <Link
                  to={`/products/${product.id}`}
                  className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition"
                >
                  {product.name}
                </Link>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-bold text-indigo-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
