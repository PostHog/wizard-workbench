# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Shopper React Router v7 e-commerce app. Here is a summary of the changes made:

- **`app/entry.client.tsx`** (new) — Initialises `posthog-js` with the project token and host from environment variables, sets `__add_tracing_headers` for client/server correlation, and wraps `<HydratedRouter>` in `<PostHogProvider>`.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and configured a reverse-proxy so ingestion calls bypass ad blockers.
- **`app/root.tsx`** — Imported `usePostHog` and added `posthog.captureException(error)` inside the `ErrorBoundary` for automatic unhandled-error tracking.
- **`app/routes/home.tsx`** — Captures `start_shopping_clicked` when the user clicks the "Start Shopping" CTA.
- **`app/routes/products.tsx`** — Captures `product_searched` (debounced to > 2 chars), `product_category_filtered`, and `product_added_to_cart` (with product metadata).
- **`app/routes/products.$productId.tsx`** — Captures `product_viewed` on mount and `product_added_to_cart` (with quantity) from the detail page.
- **`app/routes/cart.tsx`** — Captures `cart_item_removed`, `cart_item_quantity_updated`, and `checkout_started` (with cart total and item count).
- **`app/routes/checkout.tsx`** — Identifies the user via `posthog.identify(email)` on order placement and captures `order_placed` (with order total, item count, and city).
- **`.env`** — Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

## Events

| Event | Description | File |
|---|---|---|
| `start_shopping_clicked` | User clicked the 'Start Shopping' CTA on the home page, entering the conversion funnel. | `app/routes/home.tsx` |
| `product_searched` | User typed a search term (>2 chars) to filter products on the products listing page. | `app/routes/products.tsx` |
| `product_category_filtered` | User selected a category to filter the products listing. | `app/routes/products.tsx` |
| `product_added_to_cart` | User added a product to the cart from the products listing page. | `app/routes/products.tsx` |
| `product_viewed` | User viewed a product detail page, a key step in the purchase funnel. | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User added a product to the cart from the product detail page with a selected quantity. | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removed an item from the shopping cart. | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | User changed the quantity of a cart item. | `app/routes/cart.tsx` |
| `checkout_started` | User clicked 'Proceed to Checkout' from the cart, starting the checkout flow. | `app/routes/cart.tsx` |
| `order_placed` | User successfully placed an order at the end of the checkout flow. | `app/routes/checkout.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1813113)
- [Purchase funnel](https://us.posthog.com/project/483112/insights/Qz1RCAaL) — Full 5-step conversion funnel from first click to order placed
- [Orders over time](https://us.posthog.com/project/483112/insights/whm1ueKc) — Daily order volume trend
- [Add to cart by category](https://us.posthog.com/project/483112/insights/203Phsow) — Which product categories drive the most cart adds
- [Checkout started vs orders placed](https://us.posthog.com/project/483112/insights/5YqTjQz1) — Surfaces checkout-to-order drop-off
- [Product searches over time](https://us.posthog.com/project/483112/insights/Vj2ojaBX) — Daily search activity

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently identification only happens at order placement; users who don't check out will remain anonymous.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
