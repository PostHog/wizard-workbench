<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router v7 (Framework mode) application. Here is a summary of all changes made:

**New files created:**
- `app/entry.client.tsx` — Initializes the PostHog JS SDK and wraps the app in `PostHogProvider` with tracing headers enabled for client-server session correlation.
- `app/lib/posthog-middleware.ts` — Server-side PostHog middleware that creates a per-request PostHog Node client, extracts session/distinct IDs from request headers, and shuts down cleanly after each request.

**Modified files:**
- `react-router.config.ts` — Enabled the `v8_middleware` future flag required for middleware support.
- `vite.config.ts` — Added SSR `noExternal` config for `posthog-js` and `@posthog/react`, plus a dev proxy for the PostHog ingest endpoint.
- `app/root.tsx` — Registered `posthogMiddleware` as a route middleware array, added `usePostHog` + `captureException` to the `ErrorBoundary` for automatic error tracking.
- `app/routes/products.tsx` — Added `product_added_to_cart`, `product_searched`, and `product_category_filtered` event captures.
- `app/routes/products.$productId.tsx` — Added `product_added_to_cart` event capture with quantity from the detail page.
- `app/routes/cart.tsx` — Added `cart_item_removed`, `cart_item_quantity_updated`, and `checkout_started` event captures.
- `app/routes/checkout.tsx` — Added `order_placed` event capture with full order details, plus user `identify` call using email from the checkout form.

**Environment:**
- `.env` — Created with `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` (gitignore-protected).

| Event Name | Description | File |
|---|---|---|
| `product_added_to_cart` | User adds a product to cart from the products listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to cart from the product detail page (includes quantity) | `app/routes/products.$productId.tsx` |
| `product_searched` | User types in the product search box | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category filter on the products page | `app/routes/products.tsx` |
| `cart_item_removed` | User removes an item from their cart | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | User updates an item quantity in their cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" from the cart | `app/routes/cart.tsx` |
| `order_placed` | User successfully submits their order | `app/routes/checkout.tsx` |

## Next steps

We've set up the foundation for a powerful analytics dashboard. Create an **"Analytics basics"** dashboard in PostHog and add these insights to monitor the key e-commerce metrics:

1. **Purchase conversion funnel** — Track drop-off from `product_added_to_cart` → `checkout_started` → `order_placed`. Create at [https://us.posthog.com/project/2/insights/new#funnel](https://us.posthog.com/project/2/insights/new#funnel)

2. **Orders placed over time** — Trend of `order_placed` events to track revenue activity. Create at [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new)

3. **Cart abandonment rate** — Compare `checkout_started` vs `order_placed` to find churn at checkout. Create at [https://us.posthog.com/project/2/insights/new#funnel](https://us.posthog.com/project/2/insights/new#funnel)

4. **Top searched terms** — Breakdown of `product_searched` by `search_term` property to see what users look for. Create at [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new)

5. **Cart item removal rate** — Trend of `cart_item_removed` vs `product_added_to_cart` to monitor cart churn signals. Create at [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new)

Visit your PostHog project dashboard at [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) to get started.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
