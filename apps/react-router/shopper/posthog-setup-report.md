<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router v7 (Framework mode) application. Here is a summary of the changes made:

**New files created:**
- `app/entry.client.tsx` — Client entry point with PostHog SDK initialization and `PostHogProvider` wrapping the React Router app. Enables pageview autocapture, session replay, and tracing headers for client-server correlation.
- `app/lib/posthog-middleware.ts` — Server-side PostHog middleware that initializes a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers from the client, and ensures events are correlated across client and server.
- `.env` — Environment variables `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).

**Modified files:**
- `app/root.tsx` — Registered `posthogMiddleware` for server-side tracking; added `usePostHog` with `captureException` in `ErrorBoundary` for automatic error tracking.
- `react-router.config.ts` — Enabled `future.v8_middleware` flag to support the PostHog server middleware.
- `vite.config.ts` — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to avoid SSR errors.
- `app/routes/home.tsx` — Tracks `shopping_started` event when user clicks "Start Shopping".
- `app/routes/products.tsx` — Tracks `product_added_to_cart` (with product details), `product_searched` (with search term), and `category_filtered` (with category name).
- `app/routes/products.$productId.tsx` — Tracks `product_viewed` when product detail page loads, and `product_added_to_cart` (with quantity) when user adds to cart from detail page.
- `app/routes/cart.tsx` — Tracks `cart_item_removed` (with product/quantity details), `cart_quantity_updated` (with old/new quantity), and `checkout_started` (with cart total and item count).
- `app/routes/checkout.tsx` — Tracks `order_placed` (with order total, item count, and customer city).

| Event | Description | File |
|-------|-------------|------|
| `shopping_started` | User clicks 'Start Shopping' on the home page | `app/routes/home.tsx` |
| `product_viewed` | User views a product detail page (top of conversion funnel) | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the products listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the product detail page | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removes an item from the shopping cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User updates the quantity of an item in the shopping cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks 'Proceed to Checkout' from the cart page | `app/routes/cart.tsx` |
| `order_placed` | User successfully submits an order on the checkout page | `app/routes/checkout.tsx` |
| `product_searched` | User performs a product search on the products listing page | `app/routes/products.tsx` |
| `category_filtered` | User filters products by category on the products listing page | `app/routes/products.tsx` |

## Next steps

We've set up all the events needed to build powerful e-commerce insights. Here are some suggested dashboards and insights to create in your PostHog project:

- **[PostHog Project Dashboard](https://us.posthog.com/project/2/dashboard)** — Create a new "Analytics basics" dashboard
- **Purchase Conversion Funnel** — Create a Funnel insight: `shopping_started` → `product_viewed` → `product_added_to_cart` → `checkout_started` → `order_placed`
- **Orders Placed Trend** — Trend of `order_placed` events over time, showing business growth
- **Cart Abandonment** — Funnel from `checkout_started` to `order_placed` to measure drop-off
- **Top Searched Terms** — Breakdown of `product_searched` by `search_term` property
- **Product Category Performance** — Breakdown of `product_added_to_cart` by `product_category` property

Explore your live event feed here: **[Activity Feed](https://us.posthog.com/project/2/activity/explore)**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
