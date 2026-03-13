<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Shopper React Router v7 (Framework mode) application. The integration includes client-side analytics initialization, server-side middleware for correlated event tracking, a full e-commerce event tracking plan covering the purchase conversion funnel, and error tracking via the PostHog error boundary.

**Files created:**
- `app/entry.client.tsx` — PostHog client-side initialization with `PostHogProvider` wrapping `HydratedRouter`
- `app/lib/posthog-middleware.ts` — Server-side PostHog middleware that extracts session/user context from request headers for correlated tracking

**Files modified:**
- `app/root.tsx` — Added middleware export and PostHog exception capture in `ErrorBoundary`
- `react-router.config.ts` — Enabled `v8_middleware: true` future flag for middleware support
- `vite.config.ts` — Added SSR `noExternal` config for PostHog packages and `/ingest` proxy
- `app/routes/products.$productId.tsx` — Added `product_viewed` and `add_to_cart` events
- `app/routes/products.tsx` — Added `add_to_cart`, `product_searched`, and `product_category_filtered` events
- `app/routes/cart.tsx` — Added `remove_from_cart`, `cart_quantity_updated`, and `checkout_started` events
- `app/routes/checkout.tsx` — Added `order_placed` event

**Environment variables set in `.env`:**
- `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`
- `VITE_PUBLIC_POSTHOG_HOST`

| Event | Description | File |
|---|---|---|
| `product_viewed` | User views a product detail page — top of the conversion funnel | `app/routes/products.$productId.tsx` |
| `add_to_cart` | User adds a product to cart from the product listing | `app/routes/products.tsx` |
| `add_to_cart` | User adds a product to cart from the product detail page | `app/routes/products.$productId.tsx` |
| `remove_from_cart` | User removes an item from their cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User changes the quantity of an item in their cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks Proceed to Checkout from the cart page | `app/routes/cart.tsx` |
| `order_placed` | User successfully submits the checkout form and places an order | `app/routes/checkout.tsx` |
| `product_searched` | User types a search term to filter products | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category to filter the product listing | `app/routes/products.tsx` |

## Next steps

We were unable to automatically create the PostHog dashboard and insights because the configured API key lacks `dashboard:write` and `insight:write` scopes. To create the recommended "Analytics basics" dashboard manually, visit your [PostHog project](https://us.posthog.com/project/2) and create a new dashboard with these five insights:

1. **Add to Cart Conversion Funnel** — Funnel: `product_viewed` → `add_to_cart` → `checkout_started` → `order_placed`
2. **Orders Placed Over Time** — Trend (line): `order_placed`
3. **Top Product Categories Added to Cart** — Trend (bar): `add_to_cart` broken down by `product_category`
4. **Cart Abandonment** — Trend (line): `checkout_started` vs `order_placed`
5. **Product Search Activity** — Trend (line): `product_searched`

To enable automatic dashboard creation in future runs, add `dashboard:write` and `insight:write` scopes to the PostHog API key at https://us.posthog.com/settings/user-api-keys.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
