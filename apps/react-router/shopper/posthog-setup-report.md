<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Shopper React Router v7 Framework mode application. The following changes were made:

**Packages installed:** `posthog-js`, `@posthog/react`, `posthog-node`

**Client-side setup (`app/entry.client.tsx`):** Created a new entry client file that initializes `posthog-js` with the project API key and host, wraps the React tree with `PostHogProvider`, and enables `__add_tracing_headers` to correlate client and server-side events.

**Server-side middleware (`app/lib/posthog-middleware.ts`):** Created a React Router middleware that instantiates a `posthog-node` client per request, reads the `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers (set by the client SDK), and makes the PostHog instance available in the route context via `posthog.withContext()`.

**Root integration (`app/root.tsx`):** Exported the middleware array to activate server-side PostHog on all routes. Added `captureException()` to the `ErrorBoundary` component for automatic error tracking.

**Vite configuration (`vite.config.ts`):** Added SSR `noExternal` config for `posthog-js` and `@posthog/react`, plus a development proxy for `/ingest` to route analytics requests without CORS issues.

**React Router config (`react-router.config.ts`):** Enabled the `v8_middleware: true` future flag to activate the middleware system.

**Event instrumentation:** Added `posthog.capture()` calls across four route files to track the full e-commerce conversion funnel.

| Event Name | Description | File |
|------------|-------------|------|
| `product_added_to_cart` | Fired when a user adds a product to the cart from the product listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | Fired when a user adds a product to the cart from the product detail page | `app/routes/products.$productId.tsx` |
| `product_viewed` | Fired when a user views a product detail page (top of conversion funnel) | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | Fired when a user removes an item from the cart | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | Fired when a user updates the quantity of an item in the cart | `app/routes/cart.tsx` |
| `checkout_started` | Fired when a user proceeds to checkout from the cart page | `app/routes/cart.tsx` |
| `order_placed` | Fired when a user successfully places an order (critical conversion event) | `app/routes/checkout.tsx` |

## Next steps

We recommend building the following insights in PostHog to monitor user behavior based on the events we just instrumented. Navigate to your PostHog project and create an "Analytics basics" dashboard with these insights:

- **E-commerce Conversion Funnel** – A funnel insight tracking `product_viewed` → `product_added_to_cart` → `checkout_started` → `order_placed` to measure drop-off at each stage
- **Product Views Over Time** – A trends insight for the `product_viewed` event to track product discovery
- **Add-to-Cart Rate** – A trends insight comparing `product_viewed` vs `product_added_to_cart` to measure conversion from views to cart additions
- **Cart Abandonment Signal** – A trends insight comparing `checkout_started` vs `order_placed` to identify checkout drop-off
- **Orders Placed Over Time** – A trends insight for `order_placed` to track revenue-generating conversions

[Create a new dashboard in PostHog →](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
