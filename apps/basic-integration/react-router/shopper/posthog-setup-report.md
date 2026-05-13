<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router v7 (framework mode) app. Here is a summary of all changes made:

- **`app/entry.client.tsx`** (new): Initializes the PostHog JS SDK with environment variables and wraps the app in `PostHogProvider`, enabling autocapture, session replay, and the `usePostHog()` hook throughout the app.
- **`app/lib/posthog-middleware.ts`** (new): Server-side PostHog middleware that creates a PostHog Node client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` tracing headers from the client, and shuts down the client after each request.
- **`app/root.tsx`**: Exports the PostHog middleware array, and adds `posthog.captureException()` in the `ErrorBoundary` for automatic unhandled error tracking.
- **`vite.config.ts`**: Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR bundling errors.
- **`react-router.config.ts`**: Enabled `future.v8_middleware` flag required for middleware support.
- **`.env`**: Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`app/routes/home.tsx`**: Tracks `start_shopping_clicked` when user clicks the hero CTA.
- **`app/routes/products.tsx`**: Tracks `product_searched`, `product_category_filtered`, and `product_added_to_cart` (from listing page).
- **`app/routes/products.$productId.tsx`**: Tracks `product_added_to_cart` (from detail page, includes quantity).
- **`app/routes/cart.tsx`**: Tracks `cart_item_removed`, `cart_quantity_updated`, and `checkout_started`.
- **`app/routes/checkout.tsx`**: Tracks `order_placed` with order total and item count; also identifies the user with their email and name on order submission.

| Event | Description | File |
|---|---|---|
| `start_shopping_clicked` | User clicks the "Start Shopping" CTA on the home page — top of conversion funnel | `app/routes/home.tsx` |
| `product_searched` | User types in the product search box | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category filter | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product from the listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product from the detail page (includes quantity) | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removes an item from the cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User changes the quantity of a cart item | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" | `app/routes/cart.tsx` |
| `order_placed` | User successfully submits the checkout form | `app/routes/checkout.tsx` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog and add these five insights to monitor business-critical user behavior:

1. **Purchase conversion funnel** — Tracks drop-off from `start_shopping_clicked` → `product_added_to_cart` → `checkout_started` → `order_placed`
   [Create funnel insight](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS"})

2. **Add to cart trend** — Daily volume of `product_added_to_cart` events to see shopping momentum
   [Create trends insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS"})

3. **Orders placed over time** — Daily `order_placed` count with `order_total` average to track revenue activity
   [Create trends insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS"})

4. **Cart abandonment** — Compare `checkout_started` vs `order_placed` counts to identify where users drop off
   [Create trends insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS"})

5. **Top product categories added to cart** — Breakdown of `product_added_to_cart` by `product_category` property
   [Create trends insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS"})

[Go to PostHog dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
