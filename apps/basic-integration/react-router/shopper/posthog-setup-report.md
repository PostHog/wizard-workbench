<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Shopper React Router v7 (Framework mode) application. Here's a summary of what was changed:

**PostHog is initialized** in `app/entry.client.tsx` using `posthog-js` and `@posthog/react`. The `PostHogProvider` wraps the `HydratedRouter` so every component in your app can access PostHog via `usePostHog()`. Tracing headers (`X-POSTHOG-DISTINCT-ID`, `X-POSTHOG-SESSION-ID`) are automatically forwarded to all requests matching your host.

**Vite is configured** in `vite.config.ts` to mark `posthog-js` and `@posthog/react` as `noExternal` for SSR (preventing hydration mismatches), and to proxy `/ingest/*` to the PostHog ingest endpoint for ad-blocker resistance.

**Error tracking** is wired into the `ErrorBoundary` in `app/root.tsx` — any unhandled React Router error is automatically sent to PostHog via `captureException`.

**User identification** happens at order placement in `app/routes/checkout.tsx`, linking the customer's email and name to their PostHog person profile.

**Nine custom events** are captured across the shopping funnel:

| Event Name | Description | File |
|---|---|---|
| `product_viewed` | User views a product detail page (funnel top) | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product to cart from the listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to cart from the detail page | `app/routes/products.$productId.tsx` |
| `product_searched` | User types in the product search box | `app/routes/products.tsx` |
| `product_category_filtered` | User filters products by category | `app/routes/products.tsx` |
| `cart_item_removed` | User removes an item from the cart | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | User changes quantity of a cart item | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" from the cart | `app/routes/cart.tsx` |
| `order_placed` | User successfully places an order | `app/routes/checkout.tsx` |

## Next steps

Build insights and a dashboard in PostHog to track your key shopping funnel metrics:

- **[Activity Explorer](https://us.posthog.com/project/2/activity/explore)** — see live events as they come in
- **[Create a Trends insight](https://us.posthog.com/project/2/insights/new)** — chart `order_placed` over time to track revenue momentum
- **[Create a Funnel insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)** — set up a conversion funnel: `product_viewed` → `product_added_to_cart` → `checkout_started` → `order_placed`
- **[Create a Dashboard](https://us.posthog.com/project/2/dashboard)** — combine your insights into an "Analytics basics" dashboard

Suggested insights for your dashboard:
1. **Conversion funnel** — `product_viewed` → `product_added_to_cart` → `checkout_started` → `order_placed`
2. **Orders over time** — Trends for `order_placed`
3. **Cart abandonment** — Compare `checkout_started` vs `order_placed`
4. **Top searched terms** — Breakdown of `product_searched` by `search_term`
5. **Category popularity** — Breakdown of `product_category_filtered` by `category`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
