# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for the **Shopper** React Router v7 (Framework mode) app. The app is a client-side e-commerce storefront. The following changes were made:

- **`app/entry.client.tsx`** (created): Initialises `posthog-js` with the project token and host from environment variables, wraps the app in `<PostHogProvider>`, and guards against a missing token with a development-time error.
- **`vite.config.ts`** (updated): Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and added a reverse proxy for `/ingest/*` so client-side events bypass ad-blockers.
- **`app/root.tsx`** (updated): Added `usePostHog()` and `posthog?.captureException(error)` inside the `ErrorBoundary` so unhandled React Router errors are sent to PostHog error tracking.
- **`app/routes/products.tsx`** (updated): Captures `product_added_to_cart` (with product metadata), `product_searched` (on non-empty search input), and `product_filtered_by_category` (on category selection).
- **`app/routes/products.$productId.tsx`** (updated): Captures `product_viewed` on mount (top of conversion funnel) and `product_added_to_cart` from the detail page (includes quantity).
- **`app/routes/cart.tsx`** (updated): Captures `product_removed_from_cart`, `cart_quantity_updated`, and `checkout_started` (on the Proceed to Checkout link click).
- **`app/routes/checkout.tsx`** (updated): Captures `checkout_completed` with cart total, tax-inclusive total, and item counts when the order is placed.
- **`.env`** (created): Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

## Tracked events

| Event | Description | File |
|---|---|---|
| `product_viewed` | Fired when a user opens a product detail page, marking the top of the conversion funnel. | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | Fired when a user adds a product to their cart from the product listing page. | `app/routes/products.tsx` |
| `product_added_to_cart` | Fired when a user adds a product to their cart from the product detail page. | `app/routes/products.$productId.tsx` |
| `product_removed_from_cart` | Fired when a user removes an item from their cart. | `app/routes/cart.tsx` |
| `cart_quantity_updated` | Fired when a user changes the quantity of an item in their cart. | `app/routes/cart.tsx` |
| `checkout_started` | Fired when a user clicks Proceed to Checkout from the cart page. | `app/routes/cart.tsx` |
| `checkout_completed` | Fired when a user successfully places an order through the checkout form. | `app/routes/checkout.tsx` |
| `product_searched` | Fired when a user types a search term to filter products. | `app/routes/products.tsx` |
| `product_filtered_by_category` | Fired when a user selects a category to filter products. | `app/routes/products.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behaviour, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1901910)
- [Purchase conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/1Ez4fVcV)
- [Checkout completions over time (wizard)](https://us.posthog.com/project/483112/insights/3QQ8O6no)
- [Products added to cart by name (wizard)](https://us.posthog.com/project/483112/insights/QJjtWd8r)
- [Cart abandonment funnel (wizard)](https://us.posthog.com/project/483112/insights/gAIytGkS)
- [Shopping activity over time (wizard)](https://us.posthog.com/project/483112/insights/y53XxJ0w)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
