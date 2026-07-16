# PostHog post-wizard report

The wizard integrated PostHog browser analytics into this React Router framework-mode app. It installed `posthog-js` and `@posthog/react`, initializes the SDK from Vite environment variables at the client entry point, configures Vite SSR bundling for the SDK, and captures React Router error-boundary exceptions.

The cart and checkout flows now capture privacy-safe business events using product IDs, categories, quantities, and order values. No checkout form values or payment details are sent to PostHog.

| Event name | Description | File |
| --- | --- | --- |
| `product_added_to_cart` | Captures when a shopper adds a product to their cart. | `app/context/CartContext.tsx` |
| `cart_item_removed` | Captures when a shopper removes a product from their cart. | `app/context/CartContext.tsx` |
| `cart_quantity_updated` | Captures when a shopper changes the quantity of an item in their cart. | `app/context/CartContext.tsx` |
| `checkout_started` | Captures when a shopper submits the checkout form. | `app/routes/checkout.tsx` |
| `order_completed` | Captures when a shopper's simulated order is successfully placed. | `app/routes/checkout.tsx` |

## Next steps

The PostHog MCP service was unavailable in this environment, so the requested dashboard, insights, and shareable notebook could not be created. Create an **Analytics basics (wizard)** dashboard in PostHog with a checkout funnel from `checkout_started` to `order_completed`, plus trends for cart additions, removals, quantity updates, and completed orders.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
