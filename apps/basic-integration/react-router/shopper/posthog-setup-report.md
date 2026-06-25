<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router 7 (Framework mode) e-commerce app. The following changes were made:

- **`app/entry.client.tsx`** (created): Initializes the PostHog JS SDK with the project token and host from environment variables, configures a reverse proxy path (`/ingest`), and wraps `HydratedRouter` in `PostHogProvider` so all child components can access PostHog via hooks.
- **`vite.config.ts`** (updated): Added SSR `noExternal` config for `posthog-js` and `@posthog/react`, and added a reverse proxy for `/ingest` routes to forward analytics traffic through the local dev server.
- **`app/root.tsx`** (updated): Added `usePostHog` and `captureException` in the `ErrorBoundary` to automatically report unhandled React Router errors to PostHog.
- **`app/routes/home.tsx`** (updated): Captures `shopping_started` when the user clicks the "Start Shopping" CTA — the top of the purchase funnel.
- **`app/routes/products.tsx`** (updated): Captures `product_searched` on every search input change, `product_category_filtered` when a category is selected, and `product_added_to_cart` (with `source: 'listing'`) when a product is added from the listing.
- **`app/routes/products.$productId.tsx`** (updated): Captures `product_viewed` on mount (conversion funnel entry point) and `product_added_to_cart` (with `source: 'detail'` and `quantity`) when adding from the detail page.
- **`app/routes/cart.tsx`** (updated): Captures `product_removed_from_cart`, `cart_quantity_updated`, and `checkout_started` (with cart total and item list) when the user proceeds to checkout.
- **`app/routes/checkout.tsx`** (updated): Captures `order_placed` with order total, item count, and line items when the order is successfully submitted.
- **`.env`** (created): Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

| Event Name | Description | File |
|---|---|---|
| `shopping_started` | User clicks the 'Start Shopping' CTA on the home page, marking the start of the shopping funnel. | `app/routes/home.tsx` |
| `product_searched` | User types a search term to filter the product listing. | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category to filter the product listing. | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to their cart from the product listing page. | `app/routes/products.tsx` |
| `product_viewed` | User views a product detail page, a key step in the purchase conversion funnel. | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product to their cart from the product detail page. | `app/routes/products.$productId.tsx` |
| `product_removed_from_cart` | User removes a product from their shopping cart. | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User changes the quantity of a product in their shopping cart. | `app/routes/cart.tsx` |
| `checkout_started` | User clicks 'Proceed to Checkout', marking intent to complete a purchase. | `app/routes/cart.tsx` |
| `order_placed` | User successfully submits the checkout form and places an order. | `app/routes/checkout.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1760772)
- [Purchase Conversion Funnel](https://us.posthog.com/project/483112/insights/9586878)
- [Top Events Trend](https://us.posthog.com/project/483112/insights/9586879)
- [Product Engagement](https://us.posthog.com/project/483112/insights/9586880)
- [Cart Abandonment](https://us.posthog.com/project/483112/insights/9586882)
- [Product Add to Cart Rate](https://us.posthog.com/project/483112/insights/9586884)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
