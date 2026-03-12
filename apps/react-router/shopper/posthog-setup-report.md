<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router 7 Framework app. The integration covers client-side SDK initialization with session replay, pageview autocapture, error boundary tracking, and manual event tracking across the full e-commerce conversion funnel.

**Files created or modified:**

- `app/entry.client.tsx` *(created)* — Initializes PostHog with the project token/host from environment variables, wraps `HydratedRouter` in `PostHogProvider` for React hook access, and enables tracing headers for session correlation.
- `vite.config.ts` *(modified)* — Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and a `/ingest` proxy for the dev server to avoid ad-blocker interference.
- `app/root.tsx` *(modified)* — Added `usePostHog` import and `captureException(error)` call inside the `ErrorBoundary` for automatic unhandled error reporting.
- `app/routes/products.$productId.tsx` *(modified)* — Tracks `product_viewed` on render and `add_to_cart` when the button is clicked.
- `app/routes/products.tsx` *(modified)* — Tracks `add_to_cart` from the listing page, `product_searched` on search input, and `category_filter_applied` on filter change.
- `app/routes/cart.tsx` *(modified)* — Tracks `remove_from_cart`, `cart_quantity_updated`, and `checkout_started` when the user clicks "Proceed to Checkout".
- `app/routes/checkout.tsx` *(modified)* — Tracks `order_placed` with full order details (total, items, city) upon successful order submission.

| Event | Description | File |
|---|---|---|
| `product_viewed` | User viewed a product detail page — top of conversion funnel | `app/routes/products.$productId.tsx` |
| `add_to_cart` | User added a product to the cart from the product detail page | `app/routes/products.$productId.tsx` |
| `add_to_cart` | User added a product to the cart from the products listing page | `app/routes/products.tsx` |
| `product_searched` | User typed a search term in the products search box | `app/routes/products.tsx` |
| `category_filter_applied` | User filtered products by category | `app/routes/products.tsx` |
| `remove_from_cart` | User removed an item from their cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User changed the quantity of an item in their cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicked Proceed to Checkout from the cart page | `app/routes/cart.tsx` |
| `order_placed` | User completed checkout and placed an order — bottom of conversion funnel | `app/routes/checkout.tsx` |

## Next steps

We've defined the insights and a dashboard for you to build in PostHog to keep an eye on user behavior. Head to your [PostHog project](https://us.posthog.com/project/2) to create an **"Analytics basics"** dashboard with these five insights:

1. **Purchase Conversion Funnel** — Funnel: `product_viewed` → `add_to_cart` → `checkout_started` → `order_placed` (14-day window). This is your primary conversion metric.

2. **Add to Cart Volume** — Trends: `add_to_cart` events per day over the last 30 days. Spot spikes or drops in purchase intent.

3. **Orders Placed Over Time** — Trends: `order_placed` total count per week. Track your weekly revenue-generating events.

4. **Cart Abandonment Signal** — Trends: `checkout_started` vs `order_placed` side-by-side. The gap between the two lines shows cart abandonment.

5. **Search & Discovery Usage** — Trends: `product_searched` and `category_filter_applied` per day. Understand how users explore your catalog.

- [Go to PostHog dashboards](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
