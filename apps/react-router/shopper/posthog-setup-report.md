<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper e-commerce app (React Router v7 Framework mode). The integration includes client-side initialization with `posthog-js` and `@posthog/react`, a server-side PostHog middleware using `posthog-node`, and event tracking across all critical user journeys including product browsing, cart management, and checkout.

**Files created:**
- `app/entry.client.tsx` — PostHog SDK initialization with `PostHogProvider` wrapping the app; enables automatic pageview tracking and session replay.
- `app/lib/posthog-middleware.ts` — Server-side PostHog middleware that creates a `posthog-node` client per request and injects it into route context, with session/distinct-ID correlation via `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers.

**Files modified:**
- `app/root.tsx` — Added middleware export, `usePostHog` error tracking in `ErrorBoundary`.
- `app/routes/products.tsx` — Added `product_added_to_cart`, `product_searched`, `product_category_filtered` events.
- `app/routes/products.$productId.tsx` — Added `product_added_to_cart` event with quantity and source context.
- `app/routes/cart.tsx` — Added `product_removed_from_cart`, `cart_quantity_updated`, `checkout_started` events.
- `app/routes/checkout.tsx` — Added `order_placed` event with full order details.
- `react-router.config.ts` — Enabled `v8_middleware` future flag for middleware support.
- `vite.config.ts` — Added `ssr.noExternal` for `posthog-js`/`@posthog/react`, and `/ingest` proxy for ad-blocker bypass.

| Event | Description | File |
|---|---|---|
| `product_added_to_cart` | User adds a product from the product listing | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product from the product detail page (with quantity) | `app/routes/products.$productId.tsx` |
| `product_removed_from_cart` | User removes a product from the cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User updates the quantity of a product in the cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" from the cart | `app/routes/cart.tsx` |
| `order_placed` | User successfully places an order at checkout | `app/routes/checkout.tsx` |
| `product_searched` | User searches for products | `app/routes/products.tsx` |
| `product_category_filtered` | User filters products by category | `app/routes/products.tsx` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Checkout funnel** — Funnel from `product_added_to_cart` → `checkout_started` → `order_placed` to measure conversion rate.
2. **Order placed trend** — Trend chart of `order_placed` over time, broken down by `num_products`.
3. **Cart abandonment** — Users who triggered `checkout_started` but did not `order_placed` within the same session.
4. **Top searched terms** — Table of `product_searched` events grouped by `search_term` property.
5. **Category filter usage** — Breakdown of `product_category_filtered` by `category` property to see which categories are most browsed.

Visit your [PostHog project](https://us.posthog.com/project/2) to create these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
