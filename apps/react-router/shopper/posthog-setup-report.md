<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the **Shopper** React Router v7 (Framework mode) e-commerce application. Here is a summary of every change made:

- **`app/entry.client.tsx`** *(created)* — Initialises `posthog-js` with the `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables and wraps `HydratedRouter` inside `<PostHogProvider>`. The `__add_tracing_headers` option is set so that the browser SDK automatically attaches `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to every fetch request, enabling client↔server identity correlation.
- **`app/lib/posthog-middleware.ts`** *(created)* — Server-side PostHog middleware using `posthog-node`. For every request it creates a fresh `PostHog` client, extracts the tracing headers injected by the browser SDK, calls `posthog.withContext(...)` so all server-side events are automatically linked to the right user/session, and shuts down the client when the request is complete.
- **`app/root.tsx`** *(edited)* — Exports the `middleware` array containing `posthogMiddleware` (required for React Router v7 Framework middleware), and adds `posthog.captureException(error)` inside `ErrorBoundary` to automatically send unhandled errors to PostHog.
- **`react-router.config.ts`** *(edited)* — Enabled the `v8_middleware: true` future flag required by React Router for middleware support.
- **`vite.config.ts`** *(edited)* — Added `ssr.noExternal: ['posthog-js', '@posthog/react']` to prevent SSR bundling errors.
- **`.env`** *(created)* — Added `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`app/routes/products.tsx`** *(edited)* — Added `product_added_to_cart`, `product_searched`, and `product_category_filtered` event captures.
- **`app/routes/products.$productId.tsx`** *(edited)* — Added `product_viewed` (fires once on mount via `useEffect` syncing with the page load) and `product_added_to_cart` (fires on the "Add to Cart" button click with quantity).
- **`app/routes/cart.tsx`** *(edited)* — Added `cart_item_removed`, `cart_item_quantity_updated`, and `checkout_started` event captures. "Proceed to Checkout" link was converted to a button to allow capturing the `checkout_started` event before navigation.
- **`app/routes/checkout.tsx`** *(edited)* — Added `order_placed` event with full order details (total, items, city) captured at the moment the order is successfully submitted.

## Event tracking summary

| Event | Description | File |
|-------|-------------|------|
| `product_viewed` | Fired when a user views a product detail page | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | Fired when a user adds a product to the cart (from listing or detail page) | `app/routes/products.tsx`, `app/routes/products.$productId.tsx` |
| `product_searched` | Fired when a user searches for products (after 2+ characters) | `app/routes/products.tsx` |
| `product_category_filtered` | Fired when a user filters products by category | `app/routes/products.tsx` |
| `cart_item_removed` | Fired when a user removes an item from the cart | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | Fired when a user updates the quantity of a cart item | `app/routes/cart.tsx` |
| `checkout_started` | Fired when a user clicks "Proceed to Checkout" | `app/routes/cart.tsx` |
| `order_placed` | Fired when a user successfully places an order | `app/routes/checkout.tsx` |

## Next steps

We've prepared the following insights for your **Analytics basics** dashboard. Click each link to open the pre-configured insight in PostHog, then save it to your dashboard:

- [Purchase conversion funnel](https://us.posthog.com/project/238460/insights/new#{"insight":"FUNNELS","events":[{"id":"product_viewed","name":"product_viewed","type":"events","order":0},{"id":"product_added_to_cart","name":"product_added_to_cart","type":"events","order":1},{"id":"checkout_started","name":"checkout_started","type":"events","order":2},{"id":"order_placed","name":"order_placed","type":"events","order":3}]}) — Full 4-step funnel: product viewed → added to cart → checkout started → order placed
- [Daily orders trend](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"order_placed","name":"order_placed","type":"events","math":"dau"}]}) — Unique users placing orders per day
- [Add-to-cart rate trend](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"product_added_to_cart","name":"product_added_to_cart","type":"events","math":"total"}]}) — Total add-to-cart events over time
- [Product search activity](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"product_searched","name":"product_searched","type":"events","math":"total"},{"id":"product_category_filtered","name":"product_category_filtered","type":"events","math":"total"}]}) — Search and category filter usage trends
- [Cart abandonment](https://us.posthog.com/project/238460/insights/new#{"insight":"FUNNELS","events":[{"id":"checkout_started","name":"checkout_started","type":"events","order":0},{"id":"order_placed","name":"order_placed","type":"events","order":1}]}) — Checkout started vs order placed (drop-off = cart abandonment)

To create the **Analytics basics** dashboard:
1. Go to [PostHog Dashboards](https://us.posthog.com/project/238460/dashboards)
2. Click **New dashboard** → name it **"Analytics basics"**
3. Open each insight link above, save it, then add it to the dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
