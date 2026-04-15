<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) e-commerce shopper application. Here's a summary of every change made:

- **`app/entry.client.tsx`** (created): Initializes `posthog-js` with the project token and host from environment variables, enables tracing headers for client-server session correlation, and wraps `HydratedRouter` in `PostHogProvider`.
- **`vite.config.ts`** (updated): Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR bundling errors.
- **`react-router.config.ts`** (updated): Enabled the `v8_middleware` future flag required for server-side PostHog middleware.
- **`app/lib/posthog-middleware.ts`** (created): Server-side middleware that initializes a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers for session correlation, and shuts down cleanly after each request.
- **`app/root.tsx`** (updated): Exports the PostHog middleware array and added `posthog?.captureException(error)` in the `ErrorBoundary` for automatic error tracking.
- **`.env`** (created): Added `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

## Events

| Event | Description | File |
|---|---|---|
| `product_added_to_cart` | User adds a product to the cart from the products listing page | `app/routes/products.tsx` |
| `product_searched` | User searches for products using the search input | `app/routes/products.tsx` |
| `product_category_filtered` | User filters products by category | `app/routes/products.tsx` |
| `product_viewed` | User views a product detail page (top of conversion funnel) | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the product detail page | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removes an item from the cart | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | User updates the quantity of a cart item | `app/routes/cart.tsx` |
| `checkout_started` | User proceeds to checkout from the cart page | `app/routes/cart.tsx` |
| `order_placed` | User successfully submits the checkout form and places an order | `app/routes/checkout.tsx` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor your core e-commerce funnel:

1. **Purchase conversion funnel** — Funnel from `product_viewed` → `product_added_to_cart` → `checkout_started` → `order_placed`
2. **Orders over time** — Trend chart of `order_placed` events showing volume and revenue (`order_total` property)
3. **Top searched terms** — Table of `product_searched` by `search_term` property
4. **Cart abandonment** — Users who fired `checkout_started` but not `order_placed`
5. **Most viewed products** — Table of `product_viewed` by `product_name` property

You can build these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
