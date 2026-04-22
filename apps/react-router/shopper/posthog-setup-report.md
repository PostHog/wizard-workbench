<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router v7 application. Here is a summary of all changes made:

**Client-side setup**: PostHog is initialized in `app/entry.client.tsx` using `posthog-js` and wrapped in a `PostHogProvider` so all components can access it via `usePostHog()`. The `__add_tracing_headers` option is configured so that the client automatically sends `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers with every request, enabling seamless client/server correlation.

**Server-side setup**: A `posthogMiddleware` in `app/lib/posthog-middleware.ts` creates a per-request `posthog-node` client, extracts those session/user headers, and uses `withContext()` to associate all server-side events with the correct user session. The middleware is registered globally in `app/root.tsx`.

**Error tracking**: The `ErrorBoundary` in `app/root.tsx` calls `posthog.captureException(error)` to automatically capture all unhandled React Router errors.

**Event tracking**: Nine business-critical events were instrumented across four route files to cover the full e-commerce funnel.

**Environment**: `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` are stored in `.env` and referenced via `import.meta.env` (client) and `process.env` (server). Neither value is hardcoded in source files.

**Vite config**: `posthog-js` and `@posthog/react` are added to `ssr.noExternal` to avoid SSR issues. A dev proxy routes `/ingest` traffic through to PostHog.

**React Router config**: `future.v8_middleware: true` is enabled to support the middleware API.

| Event | Description | File |
|-------|-------------|------|
| `product_viewed` | User views a product detail page — top of the conversion funnel | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product to cart from the product listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to cart from the product detail page | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removes an item from the shopping cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User updates the quantity of a cart item | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" from the cart | `app/routes/cart.tsx` |
| `order_placed` | User successfully places an order | `app/routes/checkout.tsx` |
| `product_searched` | User searches for products by name or description | `app/routes/products.tsx` |
| `product_category_filtered` | User filters products by category | `app/routes/products.tsx` |

## Next steps

We've outlined five key insights to build in your PostHog dashboard to monitor user behavior based on the events we instrumented. Visit your PostHog project to create them:

- **[Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard)** — Create a new dashboard and add the insights below.
- **[Purchase Conversion Funnel](https://us.posthog.com/project/2/insights/new#insight=FUNNELS)** — Build a funnel: `product_viewed` → `product_added_to_cart` → `checkout_started` → `order_placed`. This is your primary conversion metric.
- **[Orders Placed Over Time](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — Trend of `order_placed` events. Watch for spikes after promotions or dips indicating problems.
- **[Add to Cart Rate](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — Compare `product_viewed` vs `product_added_to_cart` over time to track product-page conversion rate.
- **[Cart Abandonment](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — Compare `checkout_started` vs `order_placed` over time to identify checkout drop-off.
- **[Product Discovery Usage](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — Trend of `product_searched` and `product_category_filtered` to understand how users browse.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
