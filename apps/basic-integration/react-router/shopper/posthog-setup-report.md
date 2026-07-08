<wizard-report>
# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for the Shopper e-commerce app (React Router v7 Framework mode). PostHog is initialized in `app/entry.client.tsx` with `PostHogProvider` wrapping the hydrated router. Ten custom events covering the complete purchase funnel — from landing on the home page through order placement — have been added across five route files. Error boundaries now capture exceptions automatically via `captureException`. The `vite.config.ts` was updated to exclude `posthog-js` and `@posthog/react` from SSR bundling and to add a dev proxy routing `/ingest/*` traffic through PostHog's ingestion endpoint.

| Event name | Description | File |
|---|---|---|
| `start_shopping_clicked` | User clicks the "Start Shopping" CTA on the home page. | `app/routes/home.tsx` |
| `product_searched` | User types in the product search box (≥2 chars) on the listing page. | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category to filter products on the listing page. | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the listing page. | `app/routes/products.tsx` |
| `product_viewed` | User views a product detail page (top of the purchase funnel). | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the product detail page. | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removes an item from the shopping cart. | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | User updates the quantity of an item in the cart. | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" from the cart page. | `app/routes/cart.tsx` |
| `order_placed` | User successfully submits the checkout form and places an order. | `app/routes/checkout.tsx` |

## Next steps

We've built a dashboard and five insights to track user behavior based on the instrumented events:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818339)
- [Purchase funnel (wizard)](https://us.posthog.com/project/483112/insights/Va62YJKT) — 4-step funnel from product_viewed → order_placed
- [Orders placed over time (wizard)](https://us.posthog.com/project/483112/insights/Z5qZrtyU) — Daily order volume trend
- [Products added to cart by source (wizard)](https://us.posthog.com/project/483112/insights/OgCH9Ak3) — Listing vs product detail add-to-cart breakdown
- [Cart abandonment signals (wizard)](https://us.posthog.com/project/483112/insights/Y6zWmOlY) — checkout_started vs order_placed comparison
- [Top product search terms (wizard)](https://us.posthog.com/project/483112/insights/1M3WlQrI) — Most searched terms broken down by search_term

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
