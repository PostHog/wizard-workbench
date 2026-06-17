<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper e-commerce app. The integration includes client-side event tracking across the full purchase funnel, user identification at checkout, server-side middleware for SSR correlation, and error tracking via the `ErrorBoundary`.

**Files created:**
- `app/entry.client.tsx` — Initializes `posthog-js` and wraps the app in `PostHogProvider`
- `app/lib/posthog-middleware.ts` — Server-side PostHog Node middleware; extracts session/distinct IDs from request headers for SSR event correlation

**Files modified:**
- `app/root.tsx` — Registers the PostHog middleware and adds `captureException` in `ErrorBoundary`
- `vite.config.ts` — Adds `ssr.noExternal` for `posthog-js`/`@posthog/react` and a dev-server proxy for PostHog ingestion
- `react-router.config.ts` — Enables the `v8_middleware` future flag required for middleware support
- `app/routes/home.tsx` — Captures `start_shopping_clicked` on the CTA
- `app/routes/products.tsx` — Captures `product_searched`, `product_category_filtered`, and `product_added_to_cart` (from listing)
- `app/routes/products.$productId.tsx` — Captures `product_viewed` on mount and `product_added_to_cart` (from detail page)
- `app/routes/cart.tsx` — Captures `cart_item_removed` and `checkout_started`
- `app/routes/checkout.tsx` — Identifies users by email on order submit and captures `order_placed`

| Event | Description | File |
|---|---|---|
| `start_shopping_clicked` | User clicks the 'Start Shopping' CTA on the home page | `app/routes/home.tsx` |
| `product_searched` | User types a search term in the products search field | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category filter on the products listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the products listing page | `app/routes/products.tsx` |
| `product_viewed` | User views a product detail page (top of conversion funnel) | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the product detail page | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removes an item from the shopping cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks 'Proceed to Checkout' from the cart page | `app/routes/cart.tsx` |
| `order_placed` | User submits the checkout form and places an order | `app/routes/checkout.tsx` |

## Next steps

The PostHog MCP did not have the required scopes to create the dashboard automatically. Create the **"Analytics basics (wizard)"** dashboard manually in PostHog:

[Open Dashboards →](https://us.posthog.com/project/2/dashboard)

Suggested insights to add (use [New insight](https://us.posthog.com/project/2/insights/new)):

1. **Purchase funnel** — Funnel insight with steps: `product_viewed` → `product_added_to_cart` → `checkout_started` → `order_placed`
2. **Add to cart rate over time** — Trends insight for `product_added_to_cart` events per day
3. **Cart abandonment** — Trends insight comparing `checkout_started` vs `order_placed` using formula `B/A*100` (conversion %)
4. **Top searched terms** — Trends insight for `product_searched` broken down by `search_term` property
5. **Category popularity** — Trends insight for `product_category_filtered` broken down by `category` property

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently identification only happens at order submission; returning users who don't re-purchase will remain on anonymous distinct IDs until their next order.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
