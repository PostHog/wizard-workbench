<wizard-report>
# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for the Shopper React Router v7 app. PostHog is initialized in `entry.client.tsx` with a reverse proxy and `PostHogProvider` wrapping the app. Nine events cover the complete e-commerce funnel — from product discovery through checkout — plus error tracking in the root `ErrorBoundary`. The `vite.config.ts` was updated with SSR externals and a local reverse proxy to route analytics traffic through `/ingest`.

| Event name | Description | File |
|---|---|---|
| `product_viewed` | User viewed a product detail page, marking the top of the purchase funnel. | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User added a product to their shopping cart from the product detail page. | `app/routes/products.$productId.tsx` |
| `product_added_to_cart_from_list` | User added a product to their shopping cart directly from the product listing page. | `app/routes/products.tsx` |
| `product_removed_from_cart` | User removed a product from their shopping cart. | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User changed the quantity of a product in their shopping cart. | `app/routes/cart.tsx` |
| `checkout_started` | User clicked Proceed to Checkout from the cart, entering the checkout funnel. | `app/routes/cart.tsx` |
| `order_placed` | User successfully submitted the checkout form and placed an order. | `app/routes/checkout.tsx` |
| `product_searched` | User typed a search query on the products listing page. | `app/routes/products.tsx` |
| `product_category_filtered` | User selected a category filter on the products listing page. | `app/routes/products.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818278)
- [Purchase funnel (wizard)](https://us.posthog.com/project/483112/insights/vwHN249a)
- [Orders placed over time (wizard)](https://us.posthog.com/project/483112/insights/OHK0Jzsi)
- [Add to cart by source (wizard)](https://us.posthog.com/project/483112/insights/06m0JF42)
- [Product searches and category filters (wizard)](https://us.posthog.com/project/483112/insights/1Qcjtp7q)
- [Cart activity (wizard)](https://us.posthog.com/project/483112/insights/hh13WJfB)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
