<wizard-report>
# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for the Shopper React Router v7 app. PostHog is initialized in `app/entry.client.tsx` using `posthog-js` and wrapped with `PostHogProvider` from `@posthog/react`, making it available across the entire component tree. The Vite config was updated with SSR bundle exclusions and a reverse-proxy configuration so analytics requests are routed through the local dev server. Error tracking was wired into the global `ErrorBoundary` in `app/root.tsx`. Ten events spanning the entire purchase funnel — from the home page CTA through product discovery, cart interactions, and checkout — were instrumented across six files.

| Event | Description | File |
|-------|-------------|------|
| `start_shopping_clicked` | User clicks the "Start Shopping" CTA on the home page | `app/routes/home.tsx` |
| `product_viewed` | User views a product detail page (top of purchase funnel) | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product from the product listing | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product from the product detail page (with quantity) | `app/routes/products.$productId.tsx` |
| `product_searched` | User types a search query on the products page | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category filter on the products page | `app/routes/products.tsx` |
| `product_removed_from_cart` | User removes an item from the cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User changes an item's quantity in the cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" from the cart | `app/routes/cart.tsx` |
| `order_placed` | User successfully submits the checkout form | `app/routes/checkout.tsx` |

## Next steps

Create an **"Analytics basics (wizard)"** dashboard in PostHog and add the following five insights to it:

1. **Purchase funnel** — Funnel insight: `product_viewed` → `product_added_to_cart` → `checkout_started` → `order_placed`. This is the most critical conversion metric.
2. **Orders over time** — Trends insight: `order_placed` count, broken down by day. Watch for spikes or drops in completed purchases.
3. **Add-to-cart rate** — Trends insight: `product_added_to_cart` count over time. Compare against `product_viewed` to track listing-to-cart conversion.
4. **Product search & filter usage** — Trends insight: `product_searched` and `product_category_filtered` on the same chart. Shows how often users rely on discovery features.
5. **Cart abandonment** — Trends insight: `checkout_started` vs `order_placed` on the same chart. The gap shows how many users start checkout but don't complete.

- [Create new insight](https://us.posthog.com/project/2/insights/new)
- [View all dashboards](https://us.posthog.com/project/2/dashboard)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
