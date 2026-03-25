<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router 7 (Framework mode) e-commerce application. The following changes were made:

- **`app/entry.client.tsx`** (new) — Initializes `posthog-js` with the project token and wraps the application in `<PostHogProvider>` for React hook access throughout the component tree. Configures an `/ingest` proxy to route PostHog traffic through the app server and enables cross-domain tracing headers for session/user correlation between client and server.
- **`app/lib/posthog-middleware.ts`** (new) — Server-side PostHog middleware that creates a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers from the client SDK, and attaches the client to the route context for use in server-side event capture.
- **`app/root.tsx`** — Registered `posthogMiddleware` for all routes, and added `posthog.captureException(error)` in the `ErrorBoundary` for automatic error tracking.
- **`react-router.config.ts`** — Enabled `future.v8_middleware: true` to support the middleware system.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and configured a dev-server proxy for `/ingest` → PostHog host.
- **`app/routes/products.tsx`** — Added `product_added_to_cart`, `product_searched`, and `product_category_filtered` event capture.
- **`app/routes/products.$productId.tsx`** — Added `product_added_to_cart` event capture with quantity on the product detail page.
- **`app/routes/cart.tsx`** — Added `cart_item_removed`, `cart_quantity_updated`, and `checkout_started` event capture.
- **`app/routes/checkout.tsx`** — Added `order_placed` event capture with order total, subtotal, item count, and number of distinct item types.

| Event | Description | File |
|---|---|---|
| `product_added_to_cart` | User adds a product to cart from the product listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to cart from the product detail page (includes quantity) | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removes an item from their cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User updates item quantity in the cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" from the cart page | `app/routes/cart.tsx` |
| `order_placed` | User successfully submits the checkout form | `app/routes/checkout.tsx` |
| `product_searched` | User types a search term (fires after 3 characters) | `app/routes/products.tsx` |
| `product_category_filtered` | User filters products by category | `app/routes/products.tsx` |

## Next steps

To view and analyze the events being tracked, navigate to your PostHog project:

- **Events activity**: [https://us.posthog.com/project/238460/activity/explore](https://us.posthog.com/project/238460/activity/explore)
- **Create a dashboard**: [https://us.posthog.com/project/238460/dashboard](https://us.posthog.com/project/238460/dashboard)

Suggested insights to build in your "Analytics basics" dashboard:

1. **Purchase conversion funnel** — Funnel: `product_added_to_cart` → `checkout_started` → `order_placed`
2. **Orders over time** — Trend: `order_placed` (shows purchase volume)
3. **Add-to-cart rate** — Trend: `product_added_to_cart` (shows product discovery success)
4. **Cart abandonment signal** — Trend: `checkout_started` vs `order_placed` (shows drop-off at payment)
5. **Search & filter usage** — Trend: `product_searched` + `product_category_filtered` (shows how users discover products)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
