<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog client and server SDKs were installed, initialized for React Router framework mode, and connected through request tracing headers so browser and server activity can be correlated. Error capture was added to the root error boundary, storefront and commerce interaction events were instrumented across the home, catalog, product detail, cart, and checkout flows, and a starter PostHog dashboard with five insights was created for monitoring funnel progress and checkout health.

| Event name | Description | File |
| --- | --- | --- |
| storefront_cta_clicked | Captures when a visitor starts shopping from the home page hero button. | `app/routes/home.tsx` |
| products_filtered | Captures when a shopper changes product search or category filters on the catalog page. | `app/routes/products.tsx` |
| product_added_to_cart | Captures when a shopper adds a product to the cart from a listing page. | `app/routes/products.tsx` |
| product_added_to_cart | Captures when a shopper adds a selected quantity of a product from the product detail page. | `app/routes/products.$productId.tsx` |
| cart_item_removed | Captures when a shopper removes an item from the shopping cart. | `app/routes/cart.tsx` |
| cart_quantity_updated | Captures when a shopper changes the quantity of an item already in the cart. | `app/routes/cart.tsx` |
| checkout_started | Captures when a shopper proceeds from the cart to the checkout flow. | `app/routes/cart.tsx` |
| checkout_submitted | Captures when a shopper submits the checkout form to place an order. | `app/routes/checkout.tsx` |
| order_completed | Captures when checkout finishes successfully and the cart is cleared. | `app/routes/checkout.tsx` |
| checkout_error_captured | Captures when checkout processing throws an error before order completion. | `app/routes/checkout.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825421
- Insight: Storefront CTA clicks (wizard) — https://us.posthog.com/project/483112/insights/N1Bq1XJN
- Insight: Product adds by source (wizard) — https://us.posthog.com/project/483112/insights/cV5lXZli
- Insight: Checkout funnel (wizard) — https://us.posthog.com/project/483112/insights/pGhel5Rj
- Insight: Cart friction events (wizard) — https://us.posthog.com/project/483112/insights/bZlfBgvw
- Insight: Checkout outcomes (wizard) — https://us.posthog.com/project/483112/insights/ho75ByiZ

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
