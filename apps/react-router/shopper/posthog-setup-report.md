<wizard-report>
# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for the Shopper React Router v7 (Framework mode) app. The following changes were made:

- **`app/entry.client.tsx`** (created): Initialises `posthog-js`, wraps the app in `<PostHogProvider>` so every component can access the client via `usePostHog()`. Also enables session/distinct-ID tracing headers so client and server events can be correlated in the future.
- **`vite.config.ts`**: Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR bundling errors.
- **`app/root.tsx`**: Added `usePostHog()` and `posthog?.captureException(error)` inside `ErrorBoundary` so all unhandled React Router errors are automatically sent to PostHog error tracking.
- **`app/routes/home.tsx`**: Tracks `start_shopping_clicked` when the user clicks the "Start Shopping" CTA — the top of the purchase funnel.
- **`app/routes/products.tsx`**: Tracks `product_searched` (with `search_term`), `product_category_filtered` (with `category`), and `product_added_to_cart` (from the listing, with `source: "listing"` plus product properties).
- **`app/routes/products.$productId.tsx`**: Tracks `product_viewed` on mount (funnel entry for product-level conversion) and `product_added_to_cart` from the detail page (with `quantity` and `source: "detail"`).
- **`app/routes/cart.tsx`**: Tracks `cart_item_removed`, `cart_item_quantity_updated`, and `checkout_started` (the latter fires when "Proceed to Checkout" is clicked, with full cart summary).
- **`app/routes/checkout.tsx`**: Tracks `order_placed` with the full order summary (total, tax, item list) — the primary conversion event.

Environment variables were written to `.env` (covered by `.gitignore`):
- `VITE_PUBLIC_POSTHOG_KEY`
- `VITE_PUBLIC_POSTHOG_HOST`

## Events instrumented

| Event | Description | File |
|---|---|---|
| `start_shopping_clicked` | User clicks the "Start Shopping" CTA — top of the conversion funnel | `app/routes/home.tsx` |
| `product_searched` | User types in the search box on the products listing page | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category filter on the products listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the listing | `app/routes/products.tsx` |
| `product_viewed` | User views a product detail page — funnel entry point | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the detail page | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removes an item from the shopping cart | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | User changes the quantity of a cart item | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" | `app/routes/cart.tsx` |
| `order_placed` | User successfully submits the checkout form | `app/routes/checkout.tsx` |

## Next steps

To visualise these events, create an **"Analytics basics"** dashboard in your [PostHog project](https://us.posthog.com/project/2) with the following five insights:

1. **Purchase Conversion Funnel** — Funnel insight with steps:
   `start_shopping_clicked` → `product_viewed` → `product_added_to_cart` → `checkout_started` → `order_placed`

2. **Daily Orders** — Trend insight for `order_placed` events over time. Tracks your primary conversion KPI.

3. **Add to Cart Rate** — Trend insight for `product_added_to_cart` events. Compare with `product_viewed` to see the view-to-cart conversion rate.

4. **Checkout Drop-off** — Funnel insight: `checkout_started` → `order_placed`. Highlights users who abandon at the payment step.

5. **Product Discovery Activity** — Trend insight showing `product_searched` and `product_category_filtered` events. Reveals how users navigate the catalogue.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
