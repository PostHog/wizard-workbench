<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **Shopper** React Router v7 (framework mode) application. The following changes were made:

- **`app/entry.client.tsx`** (new): Initializes `posthog-js` with the project token and host from environment variables, wraps the app with `PostHogProvider`, and enables tracing headers for client-server correlation.
- **`app/lib/posthog-middleware.ts`** (new): Server-side PostHog Node middleware that initializes a PostHog client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers, and shuts down gracefully after each request.
- **`app/root.tsx`**: Registered the `posthogMiddleware` and added `captureException` to the `ErrorBoundary` for automatic error tracking.
- **`react-router.config.ts`**: Enabled `v8_middleware` to support the PostHog server-side middleware.
- **`vite.config.ts`**: Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR bundling errors.
- **`.env`**: Added `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `product_viewed` | Fired when a user views a product detail page — top of the conversion funnel | `app/routes/products.$productId.tsx` |
| `add_to_cart` | Fired when a user adds a product to the cart from the product detail page | `app/routes/products.$productId.tsx` |
| `add_to_cart` | Fired when a user adds a product to the cart from the product listing page | `app/routes/products.tsx` |
| `product_searched` | Fired when a user types a search query in the products search input | `app/routes/products.tsx` |
| `product_category_filtered` | Fired when a user selects a category filter on the products page | `app/routes/products.tsx` |
| `cart_item_removed` | Fired when a user removes an item from the shopping cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | Fired when a user changes the quantity of an item in the cart | `app/routes/cart.tsx` |
| `checkout_started` | Fired when a user clicks "Proceed to Checkout" from the cart summary | `app/routes/cart.tsx` |
| `order_placed` | Fired when a user successfully places an order — the key conversion event | `app/routes/checkout.tsx` |

## Next steps

We've outlined key insights and a dashboard for you to track user behavior based on the events just instrumented. Create them in PostHog using the links below:

- **[Analytics basics dashboard](https://us.posthog.com/project/238460/dashboard)** — Create a new "Analytics basics" dashboard and add the following insights:

  1. **[Purchase Conversion Funnel](https://us.posthog.com/project/238460/insights/new#{"insight":"FUNNELS","events":[{"id":"product_viewed","type":"events"},{"id":"add_to_cart","type":"events"},{"id":"checkout_started","type":"events"},{"id":"order_placed","type":"events"}]})** — Funnel from `product_viewed` → `add_to_cart` → `checkout_started` → `order_placed`. Shows where users drop off in the purchase flow.

  2. **[Orders Placed Over Time](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"order_placed","type":"events","name":"Orders placed"}]})** — Trend of `order_placed` events. Your primary conversion metric.

  3. **[Add to Cart Events](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"add_to_cart","type":"events","name":"Add to cart"}]})** — Trend of `add_to_cart` events. Tracks product demand.

  4. **[Cart Abandonment](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"checkout_started","type":"events","name":"Checkout started"},{"id":"order_placed","type":"events","name":"Orders placed"}]})** — Comparison of `checkout_started` vs `order_placed` to measure cart abandonment rate.

  5. **[Product Discovery](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"product_searched","type":"events","name":"Product searches"},{"id":"product_category_filtered","type":"events","name":"Category filters"}]})** — Trend of `product_searched` and `product_category_filtered` to understand how users discover products.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
