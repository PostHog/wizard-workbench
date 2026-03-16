<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Shopper React Router v7 (framework mode) application. The integration includes client-side SDK initialization with the PostHogProvider, a server-side middleware for correlating server and client events, error boundary exception capture, and eight product analytics events covering the full e-commerce funnel.

**Files created:**
- `app/entry.client.tsx` — Initializes `posthog-js` and wraps the app in `PostHogProvider`
- `app/lib/posthog-middleware.ts` — Server-side PostHog Node middleware that extracts session/distinct IDs from request headers to correlate client and server events

**Files modified:**
- `app/root.tsx` — Added PostHog middleware export and `captureException` in the ErrorBoundary
- `app/routes/products.tsx` — Added `product_added_to_cart`, `product_searched`, and `product_category_filtered` events
- `app/routes/products.$productId.tsx` — Added `product_added_to_cart` event with quantity and source
- `app/routes/cart.tsx` — Added `cart_item_removed`, `cart_quantity_updated`, and `checkout_started` events
- `app/routes/checkout.tsx` — Added `order_placed` event with full order details
- `react-router.config.ts` — Enabled `v8_middleware` future flag
- `vite.config.ts` — Added `ssr.noExternal` for posthog packages and a dev proxy for `/ingest`

| Event | Description | File |
|-------|-------------|------|
| `product_added_to_cart` | User adds a product to cart from the products listing | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to cart from the product detail page | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removes an item from the shopping cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User changes the quantity of a cart item | `app/routes/cart.tsx` |
| `checkout_started` | User clicks Proceed to Checkout from the cart | `app/routes/cart.tsx` |
| `order_placed` | User successfully completes the checkout form | `app/routes/checkout.tsx` |
| `product_searched` | User types in the product search box | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category filter on the products page | `app/routes/products.tsx` |

## Next steps

Create a dashboard called **"Analytics basics"** in PostHog and add the following insights to monitor key business metrics:

1. **Checkout Conversion Funnel** — Funnel insight with steps: `product_added_to_cart` → `checkout_started` → `order_placed`. Shows where users drop off in the purchase flow.

2. **Orders Over Time** — Trend insight for `order_placed`. Tracks revenue-generating conversions over time.

3. **Add-to-Cart by Source** — Trend insight for `product_added_to_cart` broken down by `source` property (`product_detail` vs `products_listing`). Shows which page drives more add-to-carts.

4. **Cart Abandonment** — Trend comparing `checkout_started` vs `order_placed` event counts. Highlights users who start but don't finish checkout.

5. **Product Search Usage** — Trend insight for `product_searched`. Shows how often users rely on search to find products.

You can create this dashboard at: [https://us.posthog.com/project/2/dashboard/new](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
