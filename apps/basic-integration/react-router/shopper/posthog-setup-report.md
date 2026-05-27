<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router 7 (Framework mode) application. The following changes were made:

- **`app/entry.client.tsx`** (created): Initializes PostHog with your project token and host, wraps the app with `PostHogProvider`, and enables cross-request tracing headers (`X-POSTHOG-DISTINCT-ID`, `X-POSTHOG-SESSION-ID`) to correlate client and server events.
- **`app/lib/posthog-middleware.ts`** (created): Server-side PostHog middleware that creates a `posthog-node` client per request, reads session/distinct ID from headers, and shuts down cleanly after each request.
- **`app/root.tsx`** (updated): Exports the PostHog middleware array, and captures unhandled errors via `captureException` in the `ErrorBoundary`.
- **`vite.config.ts`** (updated): Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and a reverse proxy for `/ingest/*` routes.
- **`react-router.config.ts`** (updated): Enabled `future.v8_middleware` required for middleware support.
- **Route files** (updated): Custom events added across the purchase funnel (see table below).
- **`.env`** (updated): `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` set.

| Event | Description | File |
|---|---|---|
| `product_viewed` | Fired when a user views a product detail page — top of the conversion funnel | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | Fired when a user adds a product to the cart from the detail page, with product details and quantity | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | Fired when a user adds a product to the cart from the products listing page | `app/routes/products.tsx` |
| `product_searched` | Fired when a user types a search term in the product search box | `app/routes/products.tsx` |
| `product_category_filtered` | Fired when a user filters products by category | `app/routes/products.tsx` |
| `cart_item_removed` | Fired when a user removes an item from the cart, with product id, name, and price | `app/routes/cart.tsx` |
| `cart_quantity_updated` | Fired when a user updates the quantity of a cart item, with old and new quantity | `app/routes/cart.tsx` |
| `checkout_started` | Fired when a user clicks Proceed to Checkout, with cart total and item count | `app/routes/cart.tsx` |
| `order_placed` | Fired when a user successfully places an order; also calls `posthog.identify()` with the customer email | `app/routes/checkout.tsx` |

## Next steps

Visit your [PostHog dashboards](/dashboards) to create an **Analytics basics** dashboard. Recommended insights to build:

1. **Purchase funnel** — Funnel insight: `product_viewed` → `product_added_to_cart` → `checkout_started` → `order_placed`. This shows your end-to-end conversion rate and where users drop off.

2. **Orders over time** — Trends insight on `order_placed` with a breakdown by `city`. Tracks revenue-generating actions and geographic distribution.

3. **Add-to-cart rate** — Trends insight: `product_added_to_cart` count / `product_viewed` count as a formula. Shows how well product pages convert to cart adds.

4. **Top searched terms** — Trends insight on `product_searched` broken down by `search_term`. Identifies what products users are looking for.

5. **Cart abandonment** — Trends insight: `checkout_started` vs `order_placed`. Shows how many users start checkout but don't complete their purchase.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
