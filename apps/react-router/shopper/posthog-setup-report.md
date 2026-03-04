<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router v7 (Framework mode) application. The following changes were made:

- **`app/entry.client.tsx`** *(created)*: Initializes the PostHog JS SDK with the project API key and host from environment variables, wraps the app in `PostHogProvider`, and enables cross-request tracing headers for session correlation.
- **`vite.config.ts`**: Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR build errors.
- **`app/root.tsx`**: Added `usePostHog` import and `captureException` call in `ErrorBoundary` to automatically track all unhandled React Router errors.
- **`app/routes/products.tsx`**: Added `add_to_cart`, `product_searched`, and `product_category_filtered` event captures.
- **`app/routes/products.$productId.tsx`**: Added `product_viewed` event (fires once on mount via `useEffect`) and `add_to_cart` event with quantity property.
- **`app/routes/cart.tsx`**: Added `remove_from_cart`, `cart_quantity_updated`, and `checkout_started` event captures.
- **`app/routes/checkout.tsx`**: Added `order_placed` event with full order details, and `posthog.identify()` call using the customer's email from the checkout form.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `product_viewed` | User views a product detail page — top of the conversion funnel | `app/routes/products.$productId.tsx` |
| `add_to_cart` | User adds a product to the cart from the product list page | `app/routes/products.tsx` |
| `add_to_cart` | User adds a product to the cart from the product detail page (with quantity) | `app/routes/products.$productId.tsx` |
| `product_searched` | User types in the search box to filter products | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category to filter products | `app/routes/products.tsx` |
| `remove_from_cart` | User removes an item from the cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User updates the quantity of an item in the cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks 'Proceed to Checkout' from the cart page | `app/routes/cart.tsx` |
| `order_placed` | User successfully places an order (checkout form submitted) | `app/routes/checkout.tsx` |

## Next steps

To complete the setup, create an **"Analytics basics"** dashboard in your PostHog project at [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) with the following recommended insights:

1. **Conversion Funnel** — Funnel from `product_viewed` → `add_to_cart` → `checkout_started` → `order_placed`
2. **Orders Over Time** — Trend of `order_placed` events to track revenue activity
3. **Add to Cart Rate** — Trend of `add_to_cart` events split by `product_category`
4. **Top Product Searches** — Breakdown of `product_searched` events by `search_term` property
5. **Cart Abandonment** — Comparison trend of `checkout_started` vs `order_placed` to identify drop-off

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
