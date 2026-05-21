<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router v7 (Framework mode) application. Here is a summary of all changes made:

**New files created:**
- `app/entry.client.tsx` — Initializes `posthog-js` with `PostHogProvider`, enabling autocapture (pageviews, clicks, etc.), session replay, and `__add_tracing_headers` for client↔server session correlation.
- `app/lib/posthog-middleware.ts` — Server-side middleware that initializes a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers, and shuts down cleanly after each request.

**Modified files:**
- `app/root.tsx` — Added `posthogMiddleware` export so all routes share a server-side PostHog client, and added `posthog.captureException()` in the `ErrorBoundary` for automatic error tracking.
- `vite.config.ts` — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR bundling errors.
- `react-router.config.ts` — Enabled `future.v8_middleware` flag required for middleware support.
- `app/routes/home.tsx` — Tracks `start_shopping_clicked` when the hero CTA is clicked.
- `app/routes/products.tsx` — Tracks `product_searched`, `product_category_filtered`, and `product_added_to_cart` (from listing page).
- `app/routes/products.$productId.tsx` — Tracks `product_viewed` on page load and `product_added_to_cart` (from detail page) with quantity.
- `app/routes/cart.tsx` — Tracks `cart_item_removed`, `cart_quantity_updated`, and `checkout_started`.
- `app/routes/checkout.tsx` — Tracks `order_placed` with order total, subtotal, and item count.

**Environment:**
- `.env` — `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` set.

---

## Instrumented events

| Event name | Description | File |
|---|---|---|
| `start_shopping_clicked` | User clicks the "Start Shopping" CTA on the home page | `app/routes/home.tsx` |
| `product_searched` | User searches for products using the search input | `app/routes/products.tsx` |
| `product_category_filtered` | User filters products by category | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product from the listing page | `app/routes/products.tsx` |
| `product_viewed` | User views a product detail page | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product from the detail page (with quantity) | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removes an item from their cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User updates cart item quantity | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" | `app/routes/cart.tsx` |
| `order_placed` | User successfully places an order | `app/routes/checkout.tsx` |

---

## Next steps

We've suggested some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Use these links to create them in PostHog:

- **[Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard/new)** — A home for all the insights below.
- **[Purchase conversion funnel](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"start_shopping_clicked","name":"start_shopping_clicked","type":"events","order":0},{"id":"product_viewed","name":"product_viewed","type":"events","order":1},{"id":"product_added_to_cart","name":"product_added_to_cart","type":"events","order":2},{"id":"checkout_started","name":"checkout_started","type":"events","order":3},{"id":"order_placed","name":"order_placed","type":"events","order":4}]})** — `start_shopping_clicked → product_viewed → product_added_to_cart → checkout_started → order_placed`. Identifies drop-off at each stage.
- **[Order placed trend](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"order_placed","name":"order_placed","type":"events"}]})** — Daily/weekly order volume over time. The key revenue metric.
- **[Add to cart trend](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"product_added_to_cart","name":"product_added_to_cart","type":"events"}]})** — How often products are added to cart, a leading indicator of intent.
- **[Cart abandonment trend](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"checkout_started","name":"checkout_started","type":"events"},{"id":"order_placed","name":"order_placed","type":"events"}]})** — `checkout_started` vs `order_placed` side-by-side to measure cart abandonment.
- **[Product search usage](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"product_searched","name":"product_searched","type":"events"},{"id":"product_category_filtered","name":"product_category_filtered","type":"events"}]})** — How often users search and filter products.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
