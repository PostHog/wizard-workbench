# PostHog post-wizard report

The wizard integrated PostHog into the React Router client entry, preserved the SDK's default autocapture and session recording behavior, added automatic exception capture to the root error boundary, and instrumented the key shopping funnel without sending checkout PII or payment fields as event properties. The public project token and host are read from `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in `.env` rather than hardcoded in application source.

| Event | Description | File |
|---|---|---|
| `shopping_started` | A shopper clicks the primary call to action to browse products. | `app/routes/home.tsx` |
| `product_added_to_cart` | A shopper adds a product to the cart from the catalog. | `app/routes/products.tsx` |
| `product_added_to_cart` | A shopper adds one or more units to the cart from a product detail page. | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | A shopper removes an item from the cart. | `app/routes/cart.tsx` |
| `cart_quantity_updated` | A shopper changes an item's quantity in the cart. | `app/routes/cart.tsx` |
| `checkout_started` | A shopper proceeds from the cart to checkout. | `app/routes/cart.tsx` |
| `order_placed` | A shopper completes the simulated checkout flow. | `app/routes/checkout.tsx` |

## Next steps

Dashboard and notebook creation could not be completed because the configured PostHog MCP endpoint was unavailable during setup. Once access is restored, create an `Analytics basics (wizard)` dashboard with a shopping funnel from `shopping_started` through `product_added_to_cart`, `checkout_started`, and `order_placed`, plus trends for cart removals and quantity updates.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
