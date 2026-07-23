<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **Shopper** React Router 7 (Framework mode) e-commerce application. The integration includes client-side event tracking, a server-side PostHog middleware for SSR correlation, exception autocapture in the error boundary, a Vite reverse proxy to avoid ad blockers, and a live dashboard with five insights.

**Files created:**
- `app/entry.client.tsx` — PostHog initialization with `posthog-js`, wraps the app in `PostHogProvider`, enables exception autocapture, and configures the `/ingest` reverse proxy.
- `app/lib/posthog-middleware.ts` — Server-side PostHog Node.js middleware that creates a per-request PostHog client, reads `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers from the client SDK, and shuts down cleanly after each request.

**Files modified:**
- `react-router.config.ts` — Enabled `v8_middleware: true` for middleware support.
- `vite.config.ts` — Added `ssr.noExternal` for posthog-js/`@posthog/react`, and proxy rules for `/ingest`, `/ingest/static`, and `/ingest/array`.
- `app/root.tsx` — Registered `posthogMiddleware`, added `usePostHog()` to `ErrorBoundary` to call `captureException` on unhandled errors.
- `app/routes/home.tsx` — Tracks `start_shopping_clicked` when the user clicks the Start Shopping CTA.
- `app/routes/products.tsx` — Tracks `product_searched`, `product_category_filtered`, and `product_added_to_cart` (from the listing page).
- `app/routes/products.$productId.tsx` — Tracks `product_viewed` on mount (conversion funnel entry) and `product_added_to_cart` (from the detail page, includes quantity).
- `app/routes/cart.tsx` — Tracks `cart_item_removed`, `cart_quantity_updated`, and `checkout_started`.
- `app/routes/checkout.tsx` — Tracks `order_placed` with order total and item count.

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `start_shopping_clicked` | User clicks the Start Shopping CTA on the home page | `app/routes/home.tsx` |
| `product_searched` | User types a search term in the product search input | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category filter on the products listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the listing page | `app/routes/products.tsx` |
| `product_viewed` | User views a product detail page (top of conversion funnel) | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the detail page | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removes an item from the shopping cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User changes item quantity in the shopping cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks Proceed to Checkout from the cart page | `app/routes/cart.tsx` |
| `order_placed` | User successfully submits the checkout form | `app/routes/checkout.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1897565)
  - Purchase conversion funnel (product_viewed → product_added_to_cart → checkout_started → order_placed)
  - Orders placed over time
  - Add to cart by product category
  - Product search trends
  - Cart abandonment signals (checkout_started vs order_placed)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
