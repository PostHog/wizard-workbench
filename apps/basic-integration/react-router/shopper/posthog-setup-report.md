# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper e-commerce app. PostHog is now initialized client-side in `entry.client.tsx` wrapped in a `PostHogProvider`, and a server-side middleware (`app/lib/posthog-middleware.ts`) initialises a Node client per request, correlating server events with client sessions via `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` tracing headers. The middleware is registered in `app/root.tsx` alongside error boundary exception tracking. All critical purchase-funnel actions — from clicking "Start Shopping" through to placing an order — are instrumented with contextual properties. Users are identified by email at order completion.

| Event | Description | File |
|---|---|---|
| `start_shopping_clicked` | User clicks the "Start Shopping" CTA on the home page | `app/routes/home.tsx` |
| `product_searched` | User types a search term to filter the products listing | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category to filter the products listing | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to their cart from the products listing page | `app/routes/products.tsx` |
| `product_viewed` | User views a product detail page | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product to their cart from the product detail page | `app/routes/products.$productId.tsx` |
| `product_removed_from_cart` | User removes an item from their shopping cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User changes the quantity of an item in their cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" | `app/routes/cart.tsx` |
| `checkout_completed` | User successfully places an order | `app/routes/checkout.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1787496)
- [Purchase funnel](https://us.posthog.com/project/483112/insights/5POnGeng)
- [Checkout completions over time](https://us.posthog.com/project/483112/insights/UB6RRapY)
- [Product views vs add-to-cart](https://us.posthog.com/project/483112/insights/ActOs15x)
- [Cart abandonment: checkout started vs completed](https://us.posthog.com/project/483112/insights/VflUIXoQ)
- [Product added vs removed from cart](https://us.posthog.com/project/483112/insights/R2OrSgvA)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently identification only happens at order completion (using the checkout email), so returning visitors who don't complete a purchase will remain anonymous. Consider identifying on checkout form email entry or after a login flow is added.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
