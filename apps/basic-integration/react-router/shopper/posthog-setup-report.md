<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper e-commerce app. The integration covers client-side event tracking across the full shopping funnel (product discovery → add to cart → checkout → order placed), server-side middleware for request-scoped PostHog context, error boundary tracking, and a reverse proxy to reduce ad-blocker impact.

**Files created:**
- `app/entry.client.tsx` — Initializes posthog-js with the reverse proxy, tracing headers, and wraps the app in `PostHogProvider`
- `app/lib/posthog-middleware.ts` — Server-side middleware that creates a per-request PostHog Node client and threads session/user context from client headers

**Files modified:**
- `app/root.tsx` — Registers the PostHog middleware and adds `captureException` in the `ErrorBoundary`
- `app/routes/products.tsx` — Captures `product_added_to_cart`, `product_searched`, and `product_category_filtered`
- `app/routes/products.$productId.tsx` — Captures `product_added_to_cart` from the detail page with quantity
- `app/routes/cart.tsx` — Captures `cart_item_removed`, `cart_item_quantity_updated`, and `checkout_started`
- `app/routes/checkout.tsx` — Captures `order_placed` with order total and cart details
- `vite.config.ts` — Added `ssr.noExternal` for PostHog packages and a reverse proxy for `/ingest`
- `react-router.config.ts` — Enabled the `v8_middleware` future flag

| Event | Description | File |
|-------|-------------|------|
| `product_added_to_cart` | User adds a product to the shopping cart from the listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to the shopping cart from the detail page | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removes an item from the shopping cart | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | User updates the quantity of an item in the shopping cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" from the cart | `app/routes/cart.tsx` |
| `order_placed` | User successfully submits the checkout form and places an order | `app/routes/checkout.tsx` |
| `product_searched` | User searches for products using the search input | `app/routes/products.tsx` |
| `product_category_filtered` | User filters products by category | `app/routes/products.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824595)
- **Purchase funnel**: [lmOebXtO](https://us.posthog.com/project/483112/insights/lmOebXtO) — Funnel from add-to-cart → checkout started → order placed
- **Orders over time**: [TQJkm3Ia](https://us.posthog.com/project/483112/insights/TQJkm3Ia) — Daily order volume trend
- **Add to cart by category**: [ff22yh6I](https://us.posthog.com/project/483112/insights/ff22yh6I) — Which product categories drive the most cart additions
- **Cart abandonment signals**: [B6qfA8ZU](https://us.posthog.com/project/483112/insights/B6qfA8ZU) — Cart removals vs orders placed over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
