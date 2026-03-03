<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router v7 (Framework mode) application. The integration covers client-side event tracking, server-side middleware for session correlation, error boundary tracking, and PostHog SDK initialization.

## Changes made

### New files created
- **`app/entry.client.tsx`** – Initializes PostHog JS with `PostHogProvider` wrapping the React app. Enables automatic session/distinct ID tracing headers for client-server correlation.
- **`app/lib/posthog-middleware.ts`** – Server-side PostHog middleware that creates a Node SDK client per request, extracts session/user context from `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers, and shuts down cleanly after each request.

### Modified files
- **`vite.config.ts`** – Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and a `/ingest` proxy for routing PostHog events through the app server.
- **`react-router.config.ts`** – Enabled the `v8_middleware` future flag required for React Router middleware support.
- **`app/root.tsx`** – Registered `posthogMiddleware` in the global middleware array; added `captureException` in the `ErrorBoundary` component for automatic error tracking.
- **`app/routes/products.tsx`** – Added `product_added_to_cart`, `product_searched`, and `product_filtered_by_category` events.
- **`app/routes/products.$productId.tsx`** – Added `product_added_to_cart` event with quantity from the product detail page.
- **`app/routes/cart.tsx`** – Added `product_removed_from_cart`, `cart_quantity_updated`, and `checkout_started` events.
- **`app/routes/checkout.tsx`** – Added `order_placed` event with full order details (total, items, city).

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `product_added_to_cart` | User adds a product to their cart from the product listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to their cart from the product detail page (with quantity) | `app/routes/products.$productId.tsx` |
| `product_removed_from_cart` | User removes an item from their cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User updates the quantity of an item in their cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks 'Proceed to Checkout' from the cart page | `app/routes/cart.tsx` |
| `order_placed` | User successfully submits the checkout form and places an order | `app/routes/checkout.tsx` |
| `product_searched` | User types a search term in the product search box | `app/routes/products.tsx` |
| `product_filtered_by_category` | User selects a category filter on the products page | `app/routes/products.tsx` |

## Next steps

Once your app is running and events are flowing into PostHog, consider building these key insights on a dashboard:

1. **Purchase conversion funnel** – `product_added_to_cart` → `checkout_started` → `order_placed`
2. **Cart abandonment rate** – users who triggered `checkout_started` but never `order_placed`
3. **Product discovery trends** – trend of `product_searched` and `product_filtered_by_category` over time
4. **Top removed cart items** – breakdown of `product_removed_from_cart` by `product_name`
5. **Average order value** – trend using the `order_total` property on `order_placed`

You can create these insights at [https://us.posthog.com/project/2/insights](https://us.posthog.com/project/2/insights) and pin them to a new "Analytics basics" dashboard.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
