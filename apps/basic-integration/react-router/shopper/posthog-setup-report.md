# PostHog post-wizard report

The wizard integrated PostHog browser analytics into this React Router 7 framework-mode storefront. It installed the browser and server SDK packages, initializes the browser SDK from environment variables at the client entry point, configures Vite SSR compatibility, and captures route errors through the existing error boundary. The storefront now records cart, catalog filtering, and checkout conversion actions without sending customer-entered checkout fields to event properties.

| Event name | Description | File |
| --- | --- | --- |
| `product_added_to_cart` | Captures when a shopper adds a product to their cart. | `app/context/CartContext.tsx` |
| `cart_item_removed` | Captures when a shopper removes a product from their cart. | `app/context/CartContext.tsx` |
| `cart_quantity_updated` | Captures when a shopper changes the quantity of a cart item. | `app/context/CartContext.tsx` |
| `product_search_performed` | Captures when a shopper searches the product catalog. | `app/routes/products.tsx` |
| `product_category_selected` | Captures when a shopper filters products by category. | `app/routes/products.tsx` |
| `checkout_started` | Captures when a shopper proceeds from their cart to checkout. | `app/routes/cart.tsx` |
| `checkout_completed` | Captures when a shopper successfully places an order. | `app/routes/checkout.tsx` |

## Next steps

The PostHog MCP service was unavailable during dashboard creation, so no dashboard, insights, or shareable notebook could be created in this run. After the service is available, create an **Analytics basics (wizard)** dashboard containing a checkout funnel (`checkout_started` → `checkout_completed`) and trends for cart, catalog-filter, and checkout events.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
