<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Shopper React Router v7 app. Here's a summary of changes:

- **`app/entry.client.tsx`** (new): PostHog is initialized with your project token and host from environment variables. `PostHogProvider` wraps the `HydratedRouter` to make `usePostHog()` available throughout the app. The `__add_tracing_headers` option is enabled to correlate client and server events.
- **`vite.config.ts`**: Added `ssr.noExternal` config for `posthog-js` and `@posthog/react` to ensure correct SSR bundling.
- **`app/root.tsx`**: Added `usePostHog()` in the `ErrorBoundary` to automatically capture unhandled errors via `captureException`.
- **`app/routes/products.$productId.tsx`**: Added `product_viewed` (funnel top — fires on mount via `useEffect`) and `product_added_to_cart` events with product metadata.
- **`app/routes/products.tsx`**: Added `product_added_to_cart`, `product_searched`, and `product_category_filtered` events.
- **`app/routes/cart.tsx`**: Added `product_removed_from_cart` and `cart_quantity_updated` events with item details.
- **`app/routes/checkout.tsx`**: Added `checkout_completed` event capturing order total, item count, and full item list.

| Event | Description | File |
|---|---|---|
| `product_viewed` | User views a product detail page — top of conversion funnel | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product to cart from the product listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to cart from the product detail page | `app/routes/products.$productId.tsx` |
| `product_removed_from_cart` | User removes a product from the cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User changes the quantity of a cart item | `app/routes/cart.tsx` |
| `checkout_completed` | User successfully places an order — primary conversion event | `app/routes/checkout.tsx` |
| `product_searched` | User searches for products by keyword | `app/routes/products.tsx` |
| `product_category_filtered` | User filters products by category | `app/routes/products.tsx` |

## Next steps

Visit your PostHog project to build insights and a dashboard based on these events:

- [PostHog Project — New Dashboard](https://us.posthog.com/project/2/dashboards)
- [New Funnel Insight — Purchase conversion: product_viewed → product_added_to_cart → checkout_completed](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)
- [New Trend Insight — Checkout completions over time](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
- [New Trend Insight — Add to cart rate](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
- [New Trend Insight — Product search and filter activity](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
- [New Trend Insight — Cart removals (churn signal)](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
