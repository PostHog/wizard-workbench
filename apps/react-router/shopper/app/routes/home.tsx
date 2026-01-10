import { Link } from "react-router";
import type { Route } from "./+types/home";
import { usePostHog } from "../providers/PostHogProvider";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Shopper - Your Online Shopping Destination" },
    { name: "description", content: "Welcome to Shopper! Find amazing products at great prices." },
  ];
}

export default function Home() {
  const posthog = usePostHog();

  const handleStartShoppingClick = () => {
    posthog.capture("start_shopping_clicked", {
      source: "home_page_hero",
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Welcome to Shopper
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover amazing products at unbeatable prices. Your one-stop shop for everything you need.
        </p>
        <Link
          to="/products"
          onClick={handleStartShoppingClick}
          className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
        >
          Start Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="text-center p-6">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Products</h3>
          <p className="text-gray-600">Carefully curated selection of high-quality items</p>
        </div>

        <div className="text-center p-6">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Great Prices</h3>
          <p className="text-gray-600">Competitive pricing on all our products</p>
        </div>

        <div className="text-center p-6">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Shipping</h3>
          <p className="text-gray-600">Quick and reliable delivery to your door</p>
        </div>
      </div>
    </div>
  );
}
