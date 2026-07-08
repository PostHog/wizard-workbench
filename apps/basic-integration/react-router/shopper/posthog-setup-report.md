# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router 7 app. PostHog is initialized in `app/entry.client.tsx` with the `PostHogProvider` wrapping the full router tree, giving every component access to the PostHog client via `usePostHog()`. Nine events covering the full e-commerce funnel — from product discovery through purchase — have been instrumented across five route files. Error tracking is wired into the root `ErrorBoundary`. The checkout flow identifies users at the moment of order placement using the email they provide, linking their session to a person profile in PostHog.

| Event | Description | File |
|---|---|---|
| `product_viewed` | Fired when a user opens a product detail page, representing the top of the purchase funnel. | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | Fired when a user adds a product to their cart from the product listing page. | `app/routes/products.tsx` |
| `product_added_to_cart` | Fired when a user adds a product to their cart from the product detail page. | `app/routes/products.$productId.tsx` |
| `product_searched` | Fired when a user types a search term to filter the product listing. | `app/routes/products.tsx` |
| `product_category_filtered` | Fired when a user selects a category to filter the product listing. | `app/routes/products.tsx` |
| `product_removed_from_cart` | Fired when a user removes a product from their shopping cart. | `app/routes/cart.tsx` |
| `cart_quantity_updated` | Fired when a user changes the quantity of a product in their cart. | `app/routes/cart.tsx` |
| `checkout_started` | Fired when a user clicks 'Proceed to Checkout' from the cart page. | `app/routes/cart.tsx` |
| `order_placed` | Fired when a user successfully submits the checkout form and places an order. | `app/routes/checkout.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1816755)
- [Purchase funnel (wizard)](https://us.posthog.com/project/483112/insights/eF90LzqR)
- [Orders over time (wizard)](https://us.posthog.com/project/483112/insights/FkDVfCmF)
- [Add to cart by product category (wizard)](https://us.posthog.com/project/483112/insights/ujdgxKoP)
- [Checkout started vs cart removals (wizard)](https://us.posthog.com/project/483112/insights/r0N5P81a)
- [Product search usage (wizard)](https://us.posthog.com/project/483112/insights/MYu2Cv2k)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called at order placement; if you add authentication later, add an `identify` call on session restore too.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
