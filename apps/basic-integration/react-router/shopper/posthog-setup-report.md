<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router v7 application. Here is a summary of every change made:

- **`app/entry.client.tsx`** _(created)_ — Initializes `posthog-js` with environment variables and wraps the app in `PostHogProvider`. Enables cross-domain session tracing headers (`__add_tracing_headers`) so client and server events correlate automatically.
- **`app/lib/posthog-middleware.ts`** _(created)_ — Server-side React Router middleware that creates a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers, and binds them to the request context via `withContext()`.
- **`app/root.tsx`** _(edited)_ — Registers `posthogMiddleware` in the route middleware array and adds `posthog.captureException()` to the `ErrorBoundary` for automatic unhandled error tracking.
- **`vite.config.ts`** _(edited)_ — Added `ssr.noExternal` for `posthog-js` / `@posthog/react` (required for SSR), and an `/ingest` reverse proxy to route analytics traffic through the app server.
- **`react-router.config.ts`** _(edited)_ — Enabled the `v8_middleware` future flag (required for server-side middleware support).
- **`.env`** _(created)_ — `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` set via the wizard-tools MCP server; covered by `.gitignore`.
- **Event tracking** added across five route files (see table below).

| Event | Description | File |
|---|---|---|
| `start_shopping_clicked` | User clicks the "Start Shopping" CTA on the home page | `app/routes/home.tsx` |
| `product_viewed` | User views a product detail page | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product from the product listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product from the product detail page | `app/routes/products.$productId.tsx` |
| `product_removed_from_cart` | User removes an item from the cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User changes the quantity of a cart item | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" from the cart | `app/routes/cart.tsx` |
| `order_placed` | User submits the checkout form (bottom of funnel) | `app/routes/checkout.tsx` |
| `product_searched` | User types a search query in the products list | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category filter on the products page | `app/routes/products.tsx` |

User identification is performed in `app/routes/checkout.tsx` on order submission — the user's email and name from the checkout form are passed to `posthog.identify()`, linking all prior anonymous events to a named person.

## Next steps

We've prepared the following insights for your "Analytics basics" dashboard. Create a new dashboard and add these insights to monitor user behavior:

- **[New dashboard](https://us.posthog.com/project/2/dashboard/new)** — Create an "Analytics basics" dashboard and add the insights below.
- **[Conversion funnel](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)** — Build a funnel with steps: `start_shopping_clicked` → `product_viewed` → `product_added_to_cart` → `checkout_started` → `order_placed`
- **[Add to cart trends](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — Trend of `product_added_to_cart` events over time; break down by `product_category`.
- **[Cart abandonment](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — Compare `checkout_started` vs `order_placed` to identify drop-off between cart and completed purchase.
- **[Top searched terms](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — Trend of `product_searched` events, broken down by `search_term` property.
- **[Orders placed over time](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — Trend of `order_placed` events, optionally broken down by `item_count` or `order_total`.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
