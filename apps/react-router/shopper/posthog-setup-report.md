<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router v7 application. Here's what was set up:

- **PostHog client SDK** (`posthog-js` + `@posthog/react`) initialized in `app/entry.client.tsx` with automatic pageview tracking and session replay
- **PostHog server SDK** (`posthog-node`) added as a server-side middleware in `app/lib/posthog-middleware.ts`, wired into all routes via `app/root.tsx`
- **Error tracking** added to the root `ErrorBoundary` via `captureException`
- **8 business events** instrumented across 4 route files covering the full e-commerce conversion funnel
- **Environment variables** stored in `.env` (never hardcoded)

## Events instrumented

| Event | Description | File |
|---|---|---|
| `product_added_to_cart` | User adds a product from the product listing | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product from the product detail page (includes quantity) | `app/routes/products.$productId.tsx` |
| `product_removed_from_cart` | User removes an item from the cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User changes an item's quantity in the cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" from the cart | `app/routes/cart.tsx` |
| `order_placed` | User successfully places an order | `app/routes/checkout.tsx` |
| `product_searched` | User types in the product search field | `app/routes/products.tsx` |
| `category_filtered` | User selects a product category filter | `app/routes/products.tsx` |

## Next steps

Here are recommended insights to build in PostHog for your "Analytics basics" dashboard:

1. **Purchase conversion funnel** — Funnel from `product_added_to_cart` → `checkout_started` → `order_placed`. Reveals where users drop off in the buying journey.
   - [Create in PostHog](https://us.posthog.com/project/238460/insights/new?insight=FUNNELS)

2. **Orders placed over time** — Trend of `order_placed` events. Tracks revenue-generating activity day by day.
   - [Create in PostHog](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

3. **Top searched terms** — Breakdown of `product_searched` by `search_term` property. Reveals what products users are looking for.
   - [Create in PostHog](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

4. **Cart abandonment** — Users who fired `checkout_started` but not `order_placed`. Identifies users at risk of churning from the funnel.
   - [Create in PostHog](https://us.posthog.com/project/238460/insights/new?insight=FUNNELS)

5. **Category filter usage** — Breakdown of `category_filtered` by `category` property. Shows which categories drive the most browsing engagement.
   - [Create in PostHog](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

[View PostHog project](https://us.posthog.com/project/238460)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
