<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was installed for this React Router framework-mode app, initialized in the client entrypoint with environment variables, configured for SSR compatibility in Vite, connected to the app through `PostHogProvider`, and added to the root error boundary for exception capture. Product analytics events were instrumented across shopping flows including catalog browsing, product detail views, add-to-cart actions, cart edits, checkout starts, and checkout submissions/completions. Customer identity is now associated during checkout using person properties, while event payloads avoid sending sensitive payment or address data.

| Event name | Description | File |
| --- | --- | --- |
| products_browsed | Captures when a shopper meaningfully browses the product catalog. | `app/routes/products.tsx` |
| product_search_used | Captures when a shopper uses product search with a meaningful query. | `app/routes/products.tsx` |
| product_category_selected | Captures when a shopper filters the catalog by category. | `app/routes/products.tsx` |
| product_viewed | Captures when a shopper views a product detail page near the top of the purchase funnel. | `app/routes/products.$productId.tsx` |
| product_added_to_cart | Captures when a shopper adds a product to the cart from a listing or detail page. | `app/context/CartContext.tsx` |
| cart_item_removed | Captures when a shopper removes an item from the cart. | `app/context/CartContext.tsx` |
| cart_quantity_updated | Captures when a shopper changes the quantity of an item in the cart. | `app/context/CartContext.tsx` |
| cart_cleared | Captures when checkout clears the cart after a successful order flow. | `app/context/CartContext.tsx` |
| checkout_started | Captures when a shopper proceeds from the cart to the checkout flow. | `app/routes/cart.tsx` |
| checkout_submitted | Captures when a shopper submits the checkout form. | `app/routes/checkout.tsx` |
| checkout_completed | Captures when an order is successfully completed on the client. | `app/routes/checkout.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831095)
- [Product views to checkout completion funnel (wizard)](https://us.posthog.com/project/483112/insights/PqE86a9z)
- [Product views over time (wizard)](https://us.posthog.com/project/483112/insights/PtCXMLTI)
- [Add to cart volume (wizard)](https://us.posthog.com/project/483112/insights/GCQzN0gM)
- [Checkout completions (wizard)](https://us.posthog.com/project/483112/insights/cjgHcPUB)
- [Cart changes over time (wizard)](https://us.posthog.com/project/483112/insights/BTmUDzl8)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
