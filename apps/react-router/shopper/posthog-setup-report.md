<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the **Shopper** React Router v7 Framework mode e-commerce application. Here is a summary of the changes made:

- **`app/entry.client.tsx`** (created): Initializes the PostHog JS SDK with your API key and host (from environment variables), wraps the React app in `<PostHogProvider>`, and enables `__add_tracing_headers` for automatic session/user correlation between client and server.
- **`app/lib/posthog-middleware.ts`** (created): Server-side PostHog middleware that creates a PostHog Node.js client per request, extracts session and distinct IDs from request headers (set automatically by the client SDK), and makes the client available via `context.posthog` for all route handlers.
- **`app/root.tsx`** (updated): Registers the PostHog middleware for all routes and adds `captureException` in the `ErrorBoundary` to automatically track unhandled React Router errors.
- **`react-router.config.ts`** (updated): Enables the `v8_middleware` future flag required for the middleware API.
- **`vite.config.ts`** (updated): Adds `posthog-js` and `@posthog/react` to `ssr.noExternal` for SSR compatibility, and configures a `/ingest` proxy to route PostHog requests through your server (avoiding ad-blockers).
- **`app/routes/products.tsx`** (updated): Captures `product_added_to_cart`, `product_searched`, and `product_category_filtered` events with relevant properties.
- **`app/routes/products.$productId.tsx`** (updated): Captures `product_viewed` on page load (via `useEffect` synchronized to the product ID) and `product_added_to_cart` when items are added from the detail page.
- **`app/routes/cart.tsx`** (updated): Captures `cart_item_removed`, `cart_item_quantity_updated`, and `checkout_started` events.
- **`app/routes/checkout.tsx`** (updated): Captures `order_placed` with full order details (total, items, quantities). Also calls `posthog.identify()` with the user's email on successful order placement.
- **`.env`** (created): Added `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

## Events

| Event Name | Description | File |
|---|---|---|
| `product_viewed` | Fired when a user views a product detail page | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | Fired when a user adds a product to the cart from the product list | `app/routes/products.tsx` |
| `product_added_to_cart` | Fired when a user adds a product to the cart from the product detail page | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | Fired when a user removes an item from the cart | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | Fired when a user updates the quantity of an item in the cart | `app/routes/cart.tsx` |
| `checkout_started` | Fired when a user clicks Proceed to Checkout | `app/routes/cart.tsx` |
| `order_placed` | Fired when a user successfully places an order | `app/routes/checkout.tsx` |
| `product_searched` | Fired when a user searches for products by name | `app/routes/products.tsx` |
| `product_category_filtered` | Fired when a user filters products by category | `app/routes/products.tsx` |

## Next steps

We recommend building the following insights and a dashboard in PostHog to keep an eye on user behavior based on the events we just instrumented:

- **[Create an Analytics basics dashboard](https://us.posthog.com/project/2/dashboards)** — Create a new dashboard and add the insights below.
- **Purchase Conversion Funnel** — [Create a funnel insight](https://us.posthog.com/project/2/insights/new#funnel) with steps: `product_viewed` → `product_added_to_cart` → `checkout_started` → `order_placed`
- **Orders Placed Over Time** — [Create a trends insight](https://us.posthog.com/project/2/insights/new#trends) tracking `order_placed` daily
- **Add to Cart vs Orders (Cart Abandonment)** — [Create a trends insight](https://us.posthog.com/project/2/insights/new#trends) comparing `checkout_started` vs `order_placed` to visualize drop-off
- **Product Discovery** — [Create a trends insight](https://us.posthog.com/project/2/insights/new#trends) tracking `product_searched` and `product_category_filtered` over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
