<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router v7 app. PostHog is initialized in `app/entry.client.tsx` and the `PostHogProvider` wraps the full React tree so every component can access the client via `usePostHog()`. A reverse proxy is configured in `vite.config.ts` so all analytics requests route through `/ingest` rather than hitting PostHog directly. Error tracking is wired into the root `ErrorBoundary`. Ten events cover the full purchase funnel — from the home-page CTA through product discovery, cart management, and order completion.

| Event name | Description | File |
|---|---|---|
| `started_shopping` | User clicked the 'Start Shopping' CTA on the home page. | `app/routes/home.tsx` |
| `product_searched` | User typed a search term to filter products. | `app/routes/products.tsx` |
| `product_category_filtered` | User selected a category filter on the products listing. | `app/routes/products.tsx` |
| `product_added_to_cart` | User added a product to cart from the listing page. | `app/routes/products.tsx` |
| `product_viewed` | User viewed a product detail page (top of conversion funnel). | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User added a product to cart from the detail page. | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removed an item from their cart. | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | User changed an item's quantity in the cart. | `app/routes/cart.tsx` |
| `checkout_started` | User clicked 'Proceed to Checkout'. | `app/routes/cart.tsx` |
| `order_placed` | User successfully placed an order. | `app/routes/checkout.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.i.posthog.com/project/483112/dashboard/1792587)
- [Purchase conversion funnel](https://us.i.posthog.com/project/483112/insights/ZUUWJgbg)
- [Orders placed over time](https://us.i.posthog.com/project/483112/insights/K2HFEtGh)
- [Products added to cart over time](https://us.i.posthog.com/project/483112/insights/R2Ke3v5I)
- [Top product searches](https://us.i.posthog.com/project/483112/insights/ndcYfJnn)
- [Cart abandonment: checkout started vs orders placed](https://us.i.posthog.com/project/483112/insights/c9qR7JFN)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
