<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Shopper React Router v7 application. Here is a summary of all changes made:

- **`app/entry.client.tsx`** (new file): Initialises the PostHog JS SDK with your project token and host from environment variables, wraps the React app in `<PostHogProvider>` so all components can access the PostHog client via `usePostHog()`.
- **`vite.config.ts`**: Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to ensure these packages are correctly bundled during SSR.
- **`app/root.tsx`**: Added PostHog exception capture in the `ErrorBoundary` component — any unhandled React Router errors are automatically sent to PostHog.
- **`app/routes/products.$productId.tsx`**: Tracks `product_viewed` on mount (top of conversion funnel) and `product_added_to_cart` when the user adds items from the detail page.
- **`app/routes/products.tsx`**: Tracks `product_added_to_cart_from_listing` (add to cart from grid), `product_searched` (search input), and `product_category_filtered` (category dropdown).
- **`app/routes/cart.tsx`**: Tracks `cart_item_removed`, `cart_quantity_updated`, and `checkout_started` (replaces the `<Link>` with a button that fires the event before navigating).
- **`app/routes/checkout.tsx`**: Tracks `order_placed` with full order details (total, items, city) — the key conversion event.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST`.

## Events

| Event | Description | File |
|-------|-------------|------|
| `product_viewed` | User views a product detail page — top of purchase funnel | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product to cart from the detail page | `app/routes/products.$productId.tsx` |
| `product_added_to_cart_from_listing` | User adds a product to cart from the product listing | `app/routes/products.tsx` |
| `product_searched` | User types a search term on the products page | `app/routes/products.tsx` |
| `product_category_filtered` | User filters products by category | `app/routes/products.tsx` |
| `cart_item_removed` | User removes an item from the cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User updates the quantity of a cart item | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" | `app/routes/cart.tsx` |
| `order_placed` | User successfully places an order — key conversion event | `app/routes/checkout.tsx` |

## Next steps

Head to your PostHog project to build insights from these events. Here are some recommended analyses to get you started:

- **Purchase conversion funnel**: `product_viewed` → `product_added_to_cart` → `checkout_started` → `order_placed`
- **Orders over time**: Trend chart on `order_placed` (track revenue with the `order_total` property)
- **Add-to-cart rate**: `product_viewed` → `product_added_to_cart` (combined with `product_added_to_cart_from_listing`)
- **Cart abandonment**: Compare `checkout_started` vs `order_placed` counts
- **Search usage**: Trend chart on `product_searched` broken down by `search_term`

You can create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
