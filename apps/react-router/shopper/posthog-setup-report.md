<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router v7 (Framework mode) application. The following changes were made:

- **`app/entry.client.tsx`** (new): Initializes `posthog-js` with the project token and host from environment variables, and wraps the app in `PostHogProvider` from `@posthog/react`. Enables tracing headers so client and server events can be correlated.
- **`app/lib/posthog-middleware.ts`** (new): Server-side React Router middleware that creates a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers from the client, and uses `withContext()` to associate all server events with the correct user and session.
- **`app/root.tsx`**: Exports the PostHog middleware array, and adds `posthog.captureException(error)` to the `ErrorBoundary` to automatically capture all unhandled React Router errors.
- **`react-router.config.ts`**: Added `future: { v8_middleware: true }` to enable the React Router v8 middleware API.
- **`vite.config.ts`**: Added SSR `noExternal` config for `posthog-js` and `@posthog/react`, and a `/ingest` proxy so production traffic is proxied through the app to avoid ad-blockers.
- **`app/routes/products.$productId.tsx`**: Captures `product_viewed` on page load (top of conversion funnel) and `product_added_to_cart` when the user clicks "Add to Cart".
- **`app/routes/products.tsx`**: Captures `product_added_to_cart_from_listing`, `product_searched`, and `category_filter_changed` events.
- **`app/routes/cart.tsx`**: Captures `product_removed_from_cart`, `cart_quantity_updated`, and `checkout_started` events.
- **`app/routes/checkout.tsx`**: Captures `order_placed` with full order details on successful checkout.

## Events

| Event | Description | File |
|-------|-------------|------|
| `product_viewed` | User views a product detail page (top of purchase funnel) | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product from the product detail page | `app/routes/products.$productId.tsx` |
| `product_added_to_cart_from_listing` | User adds a product directly from the products listing | `app/routes/products.tsx` |
| `product_searched` | User types in the product search box | `app/routes/products.tsx` |
| `category_filter_changed` | User selects a category filter | `app/routes/products.tsx` |
| `product_removed_from_cart` | User removes an item from the cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User changes an item's quantity in the cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" | `app/routes/cart.tsx` |
| `order_placed` | User successfully completes checkout | `app/routes/checkout.tsx` |

## Next steps

Build a **"Analytics basics"** dashboard in PostHog with these five recommended insights:

1. **Purchase conversion funnel** — Funnel from `product_viewed` → `product_added_to_cart` (or `product_added_to_cart_from_listing`) → `checkout_started` → `order_placed`. Reveals where users drop off in the purchase flow.
   → [Create funnel insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

2. **Orders over time** — Trend of `order_placed` events, with breakdown by `item_count` or `order_total`. Tracks revenue momentum.
   → [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

3. **Cart abandonment** — Compare `checkout_started` vs `order_placed` counts over time. High gap = abandonment problem.
   → [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

4. **Top searched terms** — Bar chart of `product_searched` events broken down by `search_term` property. Shows what users are looking for.
   → [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

5. **Most popular categories** — Bar chart of `category_filter_changed` broken down by `category` property. Shows user interest by category.
   → [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

Once created, pin them all to a new **"Analytics basics"** dashboard at [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
