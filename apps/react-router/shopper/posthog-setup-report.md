<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Shopper React Router v7 (Framework mode) application. The integration includes client-side analytics, server-side event capture, error tracking, and user identification across the full e-commerce conversion funnel.

**Files created or modified:**

- `app/entry.client.tsx` — Created: initializes `posthog-js` and wraps the React app with `PostHogProvider` for client-side analytics
- `app/lib/posthog-middleware.ts` — Created: server-side PostHog Node middleware that initializes a PostHog Node client per request, threads session and distinct IDs from `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers, and shuts down cleanly after each request
- `app/root.tsx` — Modified: registers `posthogMiddleware` in the framework middleware chain, adds `usePostHog` to `ErrorBoundary` to capture exceptions automatically via `posthog.captureException()`
- `vite.config.ts` — Modified: added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR bundling errors
- `react-router.config.ts` — Modified: enabled the `v8_middleware` future flag required for React Router v7 middleware support
- `app/routes/home.tsx` — Modified: tracks `start_shopping_clicked` when user clicks the primary CTA
- `app/routes/products.tsx` — Modified: tracks `product_added_to_cart`, `product_searched`, and `product_category_filtered`
- `app/routes/products.$productId.tsx` — Modified: tracks `product_added_to_cart` with quantity from the product detail page
- `app/routes/cart.tsx` — Modified: tracks `cart_item_removed`, `cart_item_quantity_updated`, and `checkout_started`
- `app/routes/checkout.tsx` — Modified: tracks `order_placed` with full order details; calls `posthog.identify()` to link order to user email
- `.env` — Created: sets `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables

| Event | Description | File |
|---|---|---|
| `start_shopping_clicked` | User clicks the "Start Shopping" CTA on the home page — top of conversion funnel | `app/routes/home.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the product listing page | `app/routes/products.tsx` |
| `product_searched` | User searches for a product using the search input | `app/routes/products.tsx` |
| `product_category_filtered` | User filters products by category | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product from the product detail page (with quantity) | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removes an item from the cart | `app/routes/cart.tsx` |
| `cart_item_quantity_updated` | User updates the quantity of an item in the cart | `app/routes/cart.tsx` |
| `checkout_started` | User proceeds to checkout from the cart page | `app/routes/cart.tsx` |
| `order_placed` | User successfully completes checkout — bottom of conversion funnel | `app/routes/checkout.tsx` |

## Next steps

To build insights and a dashboard in PostHog, navigate to your PostHog project and create an **"Analytics basics"** dashboard with the following suggested insights:

1. **Purchase conversion funnel** — Funnel from `start_shopping_clicked` → `product_added_to_cart` → `checkout_started` → `order_placed`
2. **Daily orders placed** — Trend of `order_placed` events over time
3. **Product discovery** — Breakdown of `product_searched` and `product_category_filtered` events
4. **Cart abandonment** — Users who triggered `checkout_started` but not `order_placed`
5. **Top products added to cart** — Breakdown of `product_added_to_cart` by `product_name` property

You can access your PostHog project at: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
