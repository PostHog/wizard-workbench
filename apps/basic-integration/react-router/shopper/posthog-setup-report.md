# PostHog post-wizard report

The wizard has completed a React Router 7 framework-mode PostHog integration for this shopping app. The setup installs the browser and Node SDKs, initializes PostHog in the client entrypoint, adds server-side middleware for request-scoped context and flushing, enables SSR-safe Vite handling for PostHog packages, captures route errors, and instruments key commerce actions across product detail, cart, and checkout flows.

| Event name | Description | File |
| --- | --- | --- |
| `product_viewed` | Captures when a shopper opens a product detail page. | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | Captures when a shopper adds a product to the cart from a listing or detail page. | `app/context/CartContext.tsx` |
| `cart_item_removed` | Captures when a shopper removes an item from the cart. | `app/routes/cart.tsx` |
| `cart_quantity_updated` | Captures when a shopper changes the quantity of an item in the cart. | `app/routes/cart.tsx` |
| `checkout_started` | Captures when a shopper begins the checkout flow with items in the cart. | `app/routes/cart.tsx` |
| `checkout_completed` | Captures when a shopper successfully places an order. | `app/routes/checkout.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846867)
- [Checkout funnel (wizard)](https://us.posthog.com/project/483112/insights/rUSG4lF7)
- [Product views over time (wizard)](https://us.posthog.com/project/483112/insights/u0WwRjHv)
- [Cart activity over time (wizard)](https://us.posthog.com/project/483112/insights/TjEzoWqU)
- [Completed checkouts (wizard)](https://us.posthog.com/project/483112/insights/6ma7hwny)
- [Cart quantity changes (wizard)](https://us.posthog.com/project/483112/insights/CdjRFiBP)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here to `.env.example` and any bootstrap scripts so collaborators know what to set: `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or bundler upload) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` so repeat purchasers do not remain on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
