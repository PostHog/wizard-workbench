<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **Shopper** React Router v7 (Framework mode) app.

## What was done

- **Installed** `posthog-js`, `@posthog/react`, and `posthog-node`.
- **Created `app/entry.client.tsx`** — initialises PostHog on the client, wraps the app in `PostHogProvider`, and enables tracing headers for client/server correlation.
- **Updated `vite.config.ts`** — added `ssr.noExternal` for PostHog packages and a local dev reverse-proxy so PostHog requests route through `/ingest`.
- **Updated `react-router.config.ts`** — enabled the `v8_middleware` future flag required for server-side middleware.
- **Created `app/lib/posthog-middleware.ts`** — server-side PostHog Node client initialised per request, with session/distinct-ID extracted from `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers and passed via `withContext()`.
- **Updated `app/root.tsx`** — exported the middleware array and added `posthog?.captureException(error)` to the `ErrorBoundary` for automatic error tracking.
- **Added 9 custom events** across 4 route files (see table below).
- **Identified users** at checkout using the email address entered in the checkout form.

## Events

| Event | Description | File |
|---|---|---|
| `product_viewed` | User views a product detail page — top of the conversion funnel | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the product detail page | `app/routes/products.$productId.tsx` |
| `product_added_to_cart_from_listing` | User adds a product to the cart directly from the products listing page | `app/routes/products.tsx` |
| `product_searched` | User types in the search box on the products listing page | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category filter on the products listing page | `app/routes/products.tsx` |
| `cart_item_removed` | User removes an item from the shopping cart | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | User changes the quantity of an item in the shopping cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks Proceed to Checkout from the cart summary | `app/routes/cart.tsx` |
| `order_placed` | User successfully submits the checkout form and an order is placed | `app/routes/checkout.tsx` |

## Next steps

Build an **Analytics basics** dashboard from the events above. Here are five recommended insights to add:

1. **Purchase conversion funnel** — tracks drop-off across `product_viewed` → `product_added_to_cart` → `checkout_started` → `order_placed`. [Create funnel insight](/insights/new#funnel)
2. **Orders placed over time** — trend of `order_placed` events with `order_total` as a sum. [Create trends insight](/insights/new#trends)
3. **Add-to-cart rate** — total `product_added_to_cart` + `product_added_to_cart_from_listing` events over time. [Create trends insight](/insights/new#trends)
4. **Top searched terms** — `product_searched` broken down by `search_term`. [Create trends insight](/insights/new#trends)
5. **Cart abandonment** — users who fired `checkout_started` but not `order_placed` in the same session. [Create funnel insight](/insights/new#funnel)

You can create the dashboard and add these insights at [/dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
