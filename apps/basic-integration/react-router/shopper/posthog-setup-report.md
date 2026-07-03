<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router v7 app. The following changes were made:

- **`app/entry.client.tsx`** (created): Initializes the PostHog JS client with the project token and host from environment variables, sets up tracing headers for client-to-server session correlation, and wraps `HydratedRouter` with `PostHogProvider` so every route can access `usePostHog()`.
- **`vite.config.ts`** (updated): Added `ssr.noExternal` for `posthog-js` and `@posthog/react` (required for SSR), and added `/ingest` proxy routes so events and assets are routed through the dev server.
- **`app/root.tsx`** (updated): Added `usePostHog()` to the `ErrorBoundary` component with `posthog.captureException(error)` so all unhandled route errors are automatically reported to PostHog error tracking.
- **`app/routes/products.tsx`** (updated): Captures `product_added_to_cart` (with product metadata and `source: "products_listing"`), `product_searched`, and `category_filter_applied` events.
- **`app/routes/products.$productId.tsx`** (updated): Captures `product_added_to_cart` with `source: "product_detail"` and `quantity` to distinguish bulk add-to-cart from the listing page.
- **`app/routes/cart.tsx`** (updated): Captures `product_removed_from_cart`, `cart_quantity_updated`, and `checkout_started` (with full cart snapshot: total, item count, and items array).
- **`app/routes/checkout.tsx`** (updated): Captures `order_placed` with order total, subtotal, item count, item details, and city.

| Event name | Description | File |
|---|---|---|
| `product_added_to_cart` | User clicks 'Add to Cart' on the products listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User clicks 'Add to Cart' on the product detail page, including quantity | `app/routes/products.$productId.tsx` |
| `product_removed_from_cart` | User removes an item from the shopping cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User changes the quantity of an item in the shopping cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks 'Proceed to Checkout' from the cart page | `app/routes/cart.tsx` |
| `order_placed` | User successfully places an order by submitting the checkout form | `app/routes/checkout.tsx` |
| `product_searched` | User types a search term to filter products on the products listing page | `app/routes/products.tsx` |
| `category_filter_applied` | User selects a category to filter products on the products listing page | `app/routes/products.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793550)
- [Shopping Conversion Funnel (wizard)](https://us.posthog.com/project/483112/insights/IdrR7Ito)
- [Orders Placed Over Time (wizard)](https://us.posthog.com/project/483112/insights/aombyL5h)
- [Add to Cart vs Orders (wizard)](https://us.posthog.com/project/483112/insights/bfe9E59e)
- [Cart Abandonment: Checkout Started vs Orders (wizard)](https://us.posthog.com/project/483112/insights/HKCTksSn)
- [Product Search Activity (wizard)](https://us.posthog.com/project/483112/insights/wmMYWTsm)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
