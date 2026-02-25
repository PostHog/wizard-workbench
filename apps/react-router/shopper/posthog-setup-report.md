<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **Shopper** React Router v7 (Framework mode) e-commerce application. The integration covers the full purchase conversion funnel — from product discovery through checkout — with both client-side event tracking and server-side middleware for session correlation.

## What was changed

### New files created
- **`app/entry.client.tsx`** — Initializes `posthog-js` and wraps the app in `PostHogProvider` for client-side analytics
- **`app/lib/posthog-middleware.ts`** — Server-side PostHog middleware that creates a Node SDK client per request and extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers for client-server session correlation
- **`.env`** — PostHog environment variables (`VITE_PUBLIC_POSTHOG_KEY`, `VITE_PUBLIC_POSTHOG_HOST`)

### Modified files
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR bundling errors
- **`react-router.config.ts`** — Enabled `v8_middleware: true` future flag to support middleware
- **`app/root.tsx`** — Registered PostHog middleware; added `usePostHog` + `captureException` to the `ErrorBoundary` for automatic error tracking
- **`app/routes/products.tsx`** — Added `product_added_to_cart`, `product_searched`, and `product_category_filtered` events
- **`app/routes/products.$productId.tsx`** — Added `product_viewed` (on mount, top of funnel) and `product_added_to_cart` events
- **`app/routes/cart.tsx`** — Added `product_removed_from_cart`, `cart_quantity_updated`, and `checkout_started` events
- **`app/routes/checkout.tsx`** — Added `order_placed` event with order total, item details, and shipping city

### Packages installed
- `posthog-js` — Client-side analytics and session replay
- `@posthog/react` — React hooks (`usePostHog`) and `PostHogProvider`
- `posthog-node` — Server-side Node.js SDK for request-level tracking

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `product_viewed` | User views a product detail page — top of conversion funnel | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the product listing | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the product detail page | `app/routes/products.$productId.tsx` |
| `product_removed_from_cart` | User removes a product from the cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User updates the quantity of a cart item | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" from the cart | `app/routes/cart.tsx` |
| `order_placed` | User successfully places an order — bottom of conversion funnel | `app/routes/checkout.tsx` |
| `product_searched` | User types a search term in the products search box | `app/routes/products.tsx` |
| `product_category_filtered` | User filters products by category | `app/routes/products.tsx` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights to monitor business health:

1. **Purchase Conversion Funnel** — Track drop-off across the full funnel: `product_viewed` → `product_added_to_cart` → `checkout_started` → `order_placed`
2. **Orders over time** — Daily/weekly trend of `order_placed` events to track revenue momentum
3. **Cart abandonment** — Side-by-side comparison of `checkout_started` vs `order_placed` to identify checkout drop-off
4. **Product discovery** — Trend of `product_searched` and `product_category_filtered` to understand how users find products
5. **Cart actions** — Trend of `product_added_to_cart` vs `product_removed_from_cart` to measure cart engagement

You can create these in your PostHog project:

- 📊 [View all dashboards](https://us.posthog.com/projects/238460/dashboards)
- 💡 [Create a new insight](https://us.posthog.com/projects/238460/insights/new)
- 🔍 [View captured events in Activity](https://us.posthog.com/projects/238460/activity/explore)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
