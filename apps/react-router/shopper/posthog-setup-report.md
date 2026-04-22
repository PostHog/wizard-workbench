<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router v7 application. The following changes were made:

- **`app/entry.client.tsx`** (created): Initializes the PostHog client-side SDK (`posthog-js`) with the project token and host from environment variables. Wraps `HydratedRouter` in `PostHogProvider` from `@posthog/react` to make PostHog available throughout the app. Enables tracing headers (`__add_tracing_headers`) to correlate client and server events.
- **`app/lib/posthog-middleware.ts`** (created): Server-side PostHog middleware using `posthog-node`. Creates a PostHog Node client per request, extracts session and distinct IDs from request headers, and uses `withContext()` to associate server-side events with the correct user/session. Shuts down the client after each request.
- **`app/root.tsx`** (updated): Exports the `posthogMiddleware` in the `middleware` array so it runs on every server request. Adds `posthog.captureException(error)` in the `ErrorBoundary` to automatically track unhandled errors via PostHog.
- **`react-router.config.ts`** (updated): Enabled the `v8_middleware: true` future flag required for the middleware API.
- **`vite.config.ts`** (updated): Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to ensure correct SSR bundling. Added a reverse proxy config for `/ingest`, `/ingest/static`, and `/ingest/array` routes to route PostHog traffic through the dev server.
- **`app/routes/products.tsx`** (updated): Captures `add_to_cart`, `product_searched`, and `product_category_filtered` events.
- **`app/routes/products.$productId.tsx`** (updated): Captures `add_to_cart` event with product details and quantity from the product detail page.
- **`app/routes/cart.tsx`** (updated): Captures `remove_from_cart`, `cart_quantity_updated`, and `checkout_started` events.
- **`app/routes/checkout.tsx`** (updated): Captures `order_placed` event with order total and item count upon successful order submission.

| Event | Description | File |
|-------|-------------|------|
| `add_to_cart` | User adds a product to the cart from the product listing page | `app/routes/products.tsx` |
| `add_to_cart` | User adds a product to the cart from the product detail page | `app/routes/products.$productId.tsx` |
| `product_searched` | User searches for products using the search input | `app/routes/products.tsx` |
| `product_category_filtered` | User filters products by category | `app/routes/products.tsx` |
| `remove_from_cart` | User removes an item from the cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User updates the quantity of an item in the cart | `app/routes/cart.tsx` |
| `checkout_started` | User proceeds to checkout from the cart page | `app/routes/cart.tsx` |
| `order_placed` | User successfully places an order at checkout | `app/routes/checkout.tsx` |

## Next steps

You can build insights and dashboards in PostHog based on the events instrumented above. Here are some recommended insights to create:

1. **Purchase funnel** — Track conversion from `add_to_cart` → `checkout_started` → `order_placed` to find drop-off points.
2. **Add to cart volume** — Trend chart of `add_to_cart` over time, broken down by `product_category`.
3. **Order placed revenue** — Trend of `order_placed` events with `order_total` as the aggregation property.
4. **Search & filter usage** — Trends of `product_searched` and `product_category_filtered` to understand discovery patterns.
5. **Cart abandonment** — Users who triggered `checkout_started` but not `order_placed`, to identify churn opportunities.

Visit your [PostHog project](https://us.i.posthog.com) to create these insights using the events above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
