<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Shopper React Router v7 (Framework mode) application. The integration covers client-side event tracking across the full e-commerce conversion funnel, server-side middleware for session correlation, error boundary exception capture, and SSR-safe PostHog initialization.

## Files created or modified

| File | Change |
|------|--------|
| `app/entry.client.tsx` | Created — initializes PostHog SDK and wraps `HydratedRouter` with `PostHogProvider` |
| `app/lib/posthog-middleware.ts` | Created — server-side PostHog middleware that correlates client/server sessions via request headers |
| `app/root.tsx` | Modified — added `posthogMiddleware` export, added `usePostHog` exception capture in `ErrorBoundary` |
| `vite.config.ts` | Modified — added `ssr.noExternal` for `posthog-js` and `@posthog/react` |
| `react-router.config.ts` | Modified — enabled `future.v8_middleware` flag for middleware support |
| `app/routes/products.tsx` | Modified — added `product_added_to_cart`, `product_searched`, `product_category_filtered` events |
| `app/routes/products.$productId.tsx` | Modified — added `product_added_to_cart` event with quantity |
| `app/routes/cart.tsx` | Modified — added `cart_item_removed`, `cart_item_quantity_updated`, `checkout_started` events |
| `app/routes/checkout.tsx` | Modified — added `order_placed` event with full order details |
| `.env` | Created — `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` set |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `product_added_to_cart` | User added a product to their cart from the product listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User added a product to their cart from the product detail page (with quantity) | `app/routes/products.$productId.tsx` |
| `product_searched` | User searched for products using the search input | `app/routes/products.tsx` |
| `product_category_filtered` | User filtered products by category | `app/routes/products.tsx` |
| `cart_item_removed` | User removed an item from the shopping cart | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | User updated the quantity of a cart item | `app/routes/cart.tsx` |
| `checkout_started` | User clicked Proceed to Checkout from the cart page | `app/routes/cart.tsx` |
| `order_placed` | User successfully placed an order after submitting the checkout form | `app/routes/checkout.tsx` |

## Next steps

We've set up the instrumentation to support a full analytics dashboard. To create an **"Analytics basics"** dashboard in PostHog with the following insights, navigate to [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) and click **New dashboard**:

### Recommended insights for your dashboard

1. **Purchase Conversion Funnel** — Funnel from `product_added_to_cart` → `checkout_started` → `order_placed`. This shows where users drop off in the purchase flow.

2. **Orders Placed Over Time** — Trend of `order_placed` events. Track revenue momentum and detect drops.

3. **Add to Cart Volume** — Trend of `product_added_to_cart` events split by `product_category`. Understand which categories drive the most cart activity.

4. **Cart Abandonment** — Trend of `checkout_started` vs `order_placed`. Shows how many users start checkout but don't complete it.

5. **Product Discovery** — Trend of `product_searched` and `product_category_filtered`. Understand how users find products.

To create these, go to [PostHog Insights](https://us.posthog.com/project/2/insights/new), choose the insight type (Funnel or Trends), and use the event names above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
