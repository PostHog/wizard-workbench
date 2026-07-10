<wizard-report>
# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for the **Shopper** React Router 7 e-commerce app. PostHog is now initialized in `app/entry.client.tsx` via `posthog-js` and `@posthog/react`, wrapping the app with `PostHogProvider` for React hook access. The Vite config was updated to add SSR exclusions and a reverse proxy for the PostHog ingestion endpoint. Ten events covering the full purchase funnel — from browsing to checkout — are captured across five route files. Unhandled errors in the root error boundary are now captured with `posthog.captureException`.

| Event | Description | File |
|---|---|---|
| `shopping_started` | User clicks the 'Start Shopping' CTA on the home page | `app/routes/home.tsx` |
| `product_searched` | User types a search query to filter products | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category filter on the products page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to cart from the listing page | `app/routes/products.tsx` |
| `product_viewed` | User views a product detail page | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product to cart from the detail page (includes quantity) | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removes an item from the shopping cart | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | User updates the quantity of a cart item | `app/routes/cart.tsx` |
| `checkout_started` | User clicks 'Proceed to Checkout' | `app/routes/cart.tsx` |
| `order_placed` | User successfully completes checkout and places an order | `app/routes/checkout.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1829347)
- **Shopping conversion funnel**: [PdhO2pca](https://us.posthog.com/project/483112/insights/PdhO2pca) — full funnel from `shopping_started` → `product_added_to_cart` → `checkout_started` → `order_placed`
- **Orders placed over time**: [rLPb7kcn](https://us.posthog.com/project/483112/insights/rLPb7kcn) — daily order volume trend
- **Add to cart by product category**: [zIpjH5Ba](https://us.posthog.com/project/483112/insights/zIpjH5Ba) — which categories drive the most cart adds
- **Checkout started vs orders placed**: [3aDDP270](https://us.posthog.com/project/483112/insights/3aDDP270) — cart abandonment signal (gap between lines = drop-off)
- **Product searches over time**: [1Kys45PY](https://us.posthog.com/project/483112/insights/1Kys45PY) — daily search activity trend

Dashboard subscriptions and alerts were skipped (interactive prompt unavailable). To set them up manually, visit the dashboard and use the "Subscribe" and "Alerts" options — a weekly email digest and a funnel drop-off alert are recommended.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
