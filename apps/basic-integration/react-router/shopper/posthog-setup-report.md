<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Shopper React Router v7 (Framework mode) e-commerce application. PostHog is initialized in `app/entry.client.tsx` using `posthog-js` wrapped in a `PostHogProvider`, enabling automatic pageview tracking and session replay across the app. Error tracking is wired into the root `ErrorBoundary` via `captureException`. Nine business-critical events covering the full shopping funnel — from product discovery through checkout — are now tracked across four route files.

| Event Name | Description | File |
|---|---|---|
| `product_viewed` | Fired when a user views a product detail page. | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | Fired when a user adds a product to their cart from the product detail page. | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | Fired when a user adds a product to their cart from the products listing page. | `app/routes/products.tsx` |
| `product_searched` | Fired when a user types a search term in the products search box. | `app/routes/products.tsx` |
| `product_category_filtered` | Fired when a user filters products by category. | `app/routes/products.tsx` |
| `cart_item_removed` | Fired when a user removes an item from their cart. | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | Fired when a user changes the quantity of an item in their cart. | `app/routes/cart.tsx` |
| `checkout_started` | Fired when a user clicks 'Proceed to Checkout' from the cart. | `app/routes/cart.tsx` |
| `order_placed` | Fired when a user successfully submits their order at checkout. | `app/routes/checkout.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.i.posthog.com/project/2/dashboard/1720023)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
