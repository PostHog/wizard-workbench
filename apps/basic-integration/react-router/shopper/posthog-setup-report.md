<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router v7 (Framework mode) e-commerce application. Here is a summary of all changes made:

- **`app/entry.client.tsx`** (created): Initializes the PostHog JS SDK with the project token and host from environment variables, wraps the app in `PostHogProvider`, and enables tracing headers (`__add_tracing_headers`) so client sessions can be correlated with any future server-side events.
- **`vite.config.ts`** (updated): Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR errors, and configured a reverse proxy for `/ingest` routes so analytics traffic routes through the app's own domain.
- **`app/root.tsx`** (updated): Added `posthog.captureException()` inside the `ErrorBoundary` so unhandled React Router errors are automatically sent to PostHog.
- **`app/routes/home.tsx`** (updated): Captures `start_shopping_clicked` when the user clicks the primary CTA.
- **`app/routes/products.tsx`** (updated): Captures `product_searched`, `product_category_filtered`, and `product_added_to_cart` (from the listing grid) with relevant properties.
- **`app/routes/products.$productId.tsx`** (updated): Captures `product_viewed` on mount (top of conversion funnel) and `product_detail_added_to_cart` including quantity when the user adds from the detail page.
- **`app/routes/cart.tsx`** (updated): Captures `cart_item_removed`, `cart_quantity_updated`, and `checkout_started` with cart totals and item counts.
- **`app/routes/checkout.tsx`** (updated): Captures `order_placed` with full order details (total, tax, item list) immediately before clearing the cart.

| Event | Description | File |
|---|---|---|
| `start_shopping_clicked` | User clicks the "Start Shopping" CTA on the home page — top of the conversion funnel | `app/routes/home.tsx` |
| `product_searched` | User types a search term in the product search box on the products listing page | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category filter on the products listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the product listing page | `app/routes/products.tsx` |
| `product_viewed` | User views a product detail page — key funnel step between browsing and adding to cart | `app/routes/products.$productId.tsx` |
| `product_detail_added_to_cart` | User adds a product to the cart from the product detail page, including quantity selected | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removes an item from their cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User changes the quantity of an item in their cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" from the cart — critical conversion funnel step | `app/routes/cart.tsx` |
| `order_placed` | User successfully submits the checkout form and places an order — primary conversion event | `app/routes/checkout.tsx` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with the following suggested insights:

1. **Purchase conversion funnel** — Funnel insight with steps: `start_shopping_clicked` → `product_viewed` → `product_detail_added_to_cart` → `checkout_started` → `order_placed`. Shows where users drop off in the buying journey.

2. **Orders over time** — Trends insight for `order_placed`. Shows daily/weekly revenue activity.

3. **Cart abandonment rate** — Trends insight comparing `checkout_started` vs `order_placed`. Highlights drop-off between intent and completion.

4. **Product discovery** — Trends insight for `product_searched` and `product_category_filtered`. Shows how users find products.

5. **Cart engagement** — Trends insight for `product_added_to_cart` + `product_detail_added_to_cart` + `cart_item_removed`. Shows cart interaction patterns.

Create your dashboard here: [New dashboard](https://us.posthog.com/project/2/dashboard/new)

View your live events in the [Activity explorer](https://us.posthog.com/project/2/activity/explore).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
