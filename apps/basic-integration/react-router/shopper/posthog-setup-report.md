# PostHog post-wizard report

The wizard integrated PostHog into the React Router 7 Framework application for browser and server runtimes. It installed the React, browser, and Node SDKs; initialized browser analytics with environment-backed configuration; added request middleware for server context correlation and exception capture; enabled the root error boundary capture; and instrumented the core shopping funnel without sending checkout PII in event properties. PostHog environment values were written to the local `.env` file. Type checking and the production build both pass.

| Event | Description | File |
| --- | --- | --- |
| `shopping_started` | A visitor selects the primary call to action to browse products. | `app/routes/home.tsx` |
| `product_added_to_cart` | A shopper adds a product to the cart with product, category, price, quantity, and source context. | `app/routes/products.tsx`, `app/routes/products.$productId.tsx` |
| `product_category_filtered` | A shopper changes the category filter in the product catalog. | `app/routes/products.tsx` |
| `product_removed_from_cart` | A shopper removes a product from the cart. | `app/routes/cart.tsx` |
| `cart_quantity_updated` | A shopper changes the quantity of a product in the cart. | `app/routes/cart.tsx` |
| `checkout_started` | A shopper proceeds from the cart to checkout with aggregate cart context. | `app/routes/cart.tsx` |
| `order_placed` | A shopper successfully completes the simulated checkout flow with aggregate order context. | `app/routes/checkout.tsx` |

## Next steps

The dashboard and notebook could not be created because the PostHog MCP service was unavailable at the configured local endpoint during this run. Once MCP access is restored, create **Analytics basics (wizard)** with a shopping conversion funnel and trends for cart removals, quantity updates, orders, and product/category activity.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code. (The wizard's production build and typecheck currently pass.)
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
