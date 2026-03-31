<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router v7 (Framework mode) application. The integration covers client-side event tracking, server-side middleware, user identification, and error tracking.

**Key changes made:**

- **`app/entry.client.tsx`** *(new)* — Created client entry file with PostHog initialization (`posthog-js`) and `PostHogProvider` wrapping the app. Uses `/ingest` proxy for production-ready event routing.
- **`app/lib/posthog-middleware.ts`** *(new)* — Server-side PostHog middleware using `posthog-node` that extracts session/distinct ID from request headers (`X-POSTHOG-SESSION-ID`, `X-POSTHOG-DISTINCT-ID`) to correlate client and server events.
- **`app/root.tsx`** — Registered the PostHog middleware, added `usePostHog` hook to the error boundary for automatic exception capture via `captureException`.
- **`vite.config.ts`** — Added `ssr.noExternal` config for `posthog-js` and `@posthog/react`, plus dev proxy for `/ingest` routes.
- **`react-router.config.ts`** — Enabled `v8_middleware: true` future flag for middleware support.
- **`app/routes/products.tsx`** — Added tracking for product add-to-cart, search, and category filter events.
- **`app/routes/products.$productId.tsx`** — Added `product_viewed` event on mount and `product_added_to_cart` with quantity on add-to-cart action.
- **`app/routes/cart.tsx`** — Added `cart_item_removed` and `cart_item_quantity_updated` events.
- **`app/routes/checkout.tsx`** — Added `checkout_started` event on mount, user `identify` call using the email from the checkout form, and `order_placed` event with full order details on successful submission.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `product_viewed` | User views a product detail page | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product from the listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product from the detail page (with quantity) | `app/routes/products.$productId.tsx` |
| `product_searched` | User searches for products | `app/routes/products.tsx` |
| `product_category_filtered` | User filters products by category | `app/routes/products.tsx` |
| `cart_item_removed` | User removes an item from cart | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | User updates item quantity in cart | `app/routes/cart.tsx` |
| `checkout_started` | User arrives at the checkout page | `app/routes/checkout.tsx` |
| `order_placed` | User successfully places an order | `app/routes/checkout.tsx` |

## Next steps

To monitor user behavior based on the events just instrumented, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Purchase funnel** — Funnel: `product_viewed` → `product_added_to_cart` → `checkout_started` → `order_placed`
2. **Add to cart over time** — Trend of `product_added_to_cart` events
3. **Product search usage** — Trend of `product_searched` events
4. **Cart abandonment rate** — `checkout_started` vs `order_placed` (completion rate)
5. **Order revenue** — Trend of `order_placed` with `total_with_tax` property aggregation

You can create this dashboard at: [https://us.posthog.com/project/238460/dashboard](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
