# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router v7 application. The following changes were made:

- **`app/entry.client.tsx`** (created): Initializes the PostHog JS SDK and wraps the app with `PostHogProvider`, enabling analytics, session replay, and autocapture across all routes.
- **`app/lib/posthog-middleware.ts`** (created): Server-side PostHog Node middleware that creates a per-request PostHog client, extracts session/distinct IDs from request headers, and ensures events are flushed before the response is sent.
- **`app/root.tsx`** (updated): Registers the PostHog middleware, and adds `captureException` to the error boundary for automatic error tracking.
- **`vite.config.ts`** (updated): Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and configured a dev-server reverse proxy for PostHog ingestion.
- **`react-router.config.ts`** (updated): Enabled `future.v8_middleware` to support the PostHog server-side middleware.
- **`.env`** (created): Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`app/routes/products.tsx`** (updated): Captures `product_added_to_cart` (from listing), `product_searched`, and `product_category_filtered` events.
- **`app/routes/products.$productId.tsx`** (updated): Captures `product_viewed` on mount and `product_added_to_cart` (with quantity) on add-to-cart.
- **`app/routes/cart.tsx`** (updated): Captures `cart_item_removed`, `cart_quantity_updated`, and `checkout_started` events.
- **`app/routes/checkout.tsx`** (updated): Identifies the user by email on order completion, and captures `order_placed` with revenue and cart details.

| Event Name | Description | File |
|---|---|---|
| `product_viewed` | User viewed a product detail page, marking the start of the purchase consideration funnel. | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User added a product to the cart from the products listing page. | `app/routes/products.tsx` |
| `product_added_to_cart` | User added a product to the cart from the product detail page (includes quantity). | `app/routes/products.$productId.tsx` |
| `product_searched` | User entered a search term to filter the product listing. | `app/routes/products.tsx` |
| `product_category_filtered` | User selected a category to filter the product listing. | `app/routes/products.tsx` |
| `cart_item_removed` | User removed an item from the shopping cart. | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User changed the quantity of an item in the shopping cart. | `app/routes/cart.tsx` |
| `checkout_started` | User clicked Proceed to Checkout from the cart, initiating the checkout flow. | `app/routes/cart.tsx` |
| `order_placed` | User successfully submitted the checkout form and placed an order. | `app/routes/checkout.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.i.posthog.com/project/483112/dashboard/1761285)
- [Purchase Conversion Funnel](https://us.i.posthog.com/project/483112/insights/S2HWKW14)
- [Total Orders Placed](https://us.i.posthog.com/project/483112/insights/g0FA5qJS)
- [Add to Cart Rate](https://us.i.posthog.com/project/483112/insights/DVWikwh0)
- [Cart Abandonment](https://us.i.posthog.com/project/483112/insights/m0cAJaBW)
- [Top Product Categories](https://us.i.posthog.com/project/483112/insights/FN7RdLJS)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on order placement; if you add a login flow later, ensure it also identifies the user.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
