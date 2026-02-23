<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **Shopper** React Router v7 (Framework mode) e-commerce application. The integration includes client-side event tracking across all key user journeys, server-side middleware for request-correlated analytics, PostHog error tracking in the error boundary, and user identification at order placement.

## Changes made

### New files created
- **`app/entry.client.tsx`** — Initializes PostHog with the project API key (via env vars) and wraps the app with `PostHogProvider`, enabling the `usePostHog()` hook throughout the app. Includes `__add_tracing_headers` for client↔server session correlation.
- **`app/lib/posthog-middleware.ts`** — Server-side React Router middleware that creates a PostHog Node.js client per request, extracts `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers from the client, and makes the client available via request context for server-side event capture.

### Modified files
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` (required for SSR), and a dev-server proxy for PostHog ingestion (`/ingest`).
- **`react-router.config.ts`** — Enabled the `v8_middleware` future flag required for React Router middleware support.
- **`app/root.tsx`** — Exported the `posthogMiddleware` in the `middleware` array, imported `usePostHog`, and added `posthog?.captureException(error)` to the `ErrorBoundary` for automatic error tracking.
- **`app/routes/home.tsx`** — Added `start_shopping_clicked` event on the "Start Shopping" CTA click.
- **`app/routes/products.tsx`** — Added `product_added_to_cart`, `product_searched`, and `product_category_filtered` events.
- **`app/routes/products.$productId.tsx`** — Added `product_added_to_cart` event with quantity from the product detail page.
- **`app/routes/cart.tsx`** — Added `cart_item_removed`, `cart_item_quantity_updated`, and `checkout_started` events.
- **`app/routes/checkout.tsx`** — Added `order_placed` event with full order details, and `posthog?.identify()` to associate the user's email with their PostHog profile at purchase time.

### Environment variables
Added to `.env.local`:
- `VITE_PUBLIC_POSTHOG_KEY` — PostHog project API key
- `VITE_PUBLIC_POSTHOG_HOST` — PostHog host URL

## Event tracking summary

| Event | Description | File |
|-------|-------------|------|
| `start_shopping_clicked` | User clicks the "Start Shopping" CTA on the home page — top of conversion funnel | `app/routes/home.tsx` |
| `product_searched` | User types a search term (3+ chars) in the product search box | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category filter on the product listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the detail page (with quantity) | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removes an item from the shopping cart | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | User updates the quantity of an item in the cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" from the cart page | `app/routes/cart.tsx` |
| `order_placed` | User successfully places an order (conversion event) | `app/routes/checkout.tsx` |

## Next steps

We've defined 5 analytics insights for you to create in your PostHog dashboard to monitor user behavior and conversion performance. Create them at **https://us.posthog.com/project/2**:

### Recommended dashboard: "Analytics basics"

Create the following insights and add them to a new dashboard:

1. **Purchase Conversion Funnel** — Funnel insight: `start_shopping_clicked` → `product_added_to_cart` → `checkout_started` → `order_placed`. Shows where users drop off in the buying journey.

2. **Orders Placed Over Time** — Trend of `order_placed` events over the last 30 days. Your core revenue metric.

3. **Add to Cart Events** — Trend of `product_added_to_cart` events over the last 30 days. Tracks product engagement.

4. **Cart Abandonment: Checkout vs Orders** — Compare `checkout_started` vs `order_placed` on the same trend chart to monitor cart abandonment rate.

5. **Product Discovery: Search & Category Filters** — Trend of `product_searched` and `product_category_filtered` together. Shows how users navigate to products.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
