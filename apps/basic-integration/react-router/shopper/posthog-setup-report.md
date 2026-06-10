<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Shopper React Router v7 app. Here's a summary of changes:

- **`app/entry.client.tsx`** (created): Initialises PostHog with `posthog-js` and wraps the app in `PostHogProvider` from `@posthog/react`. Uses a `/ingest` reverse proxy so requests are routed through the app's own domain.
- **`vite.config.ts`** (updated): Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and configured dev-server proxy rules for `/ingest/static`, `/ingest/array`, and `/ingest`.
- **`app/root.tsx`** (updated): Added `usePostHog` and `posthog.captureException(error)` inside the `ErrorBoundary` to automatically capture unhandled React Router errors.
- **`app/routes/home.tsx`** (updated): Captures `start_shopping_clicked` when the user clicks the "Start Shopping" CTA.
- **`app/routes/products.tsx`** (updated): Captures `product_searched` (when search term exceeds 2 characters), `product_category_filtered` (on category change), and `product_added_to_cart` (from the product listing).
- **`app/routes/products.$productId.tsx`** (updated): Captures `product_viewed` on mount (via `useEffect`) and `product_added_to_cart` when the user adds to cart from the detail page (includes quantity).
- **`app/routes/cart.tsx`** (updated): Captures `cart_item_removed` on item removal and `checkout_started` when the user clicks "Proceed to Checkout".
- **`app/routes/checkout.tsx`** (updated): Identifies the user with `posthog.identify(email)` and captures `checkout_completed` (including item list and total) when an order is placed.

| Event | Description | File |
|---|---|---|
| `start_shopping_clicked` | User clicks "Start Shopping" CTA on the home page | `app/routes/home.tsx` |
| `product_searched` | User types a search term (length > 2) | `app/routes/products.tsx` |
| `product_category_filtered` | User selects a category filter | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product from the listing page | `app/routes/products.tsx` |
| `product_viewed` | User views a product detail page | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product from the detail page (with quantity) | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | User removes an item from the cart | `app/routes/cart.tsx` |
| `checkout_started` | User clicks "Proceed to Checkout" | `app/routes/cart.tsx` |
| `checkout_completed` | User successfully places an order | `app/routes/checkout.tsx` |

## Next steps

Create a dashboard in PostHog to monitor these events. Here are some suggested insights to build:

- **Conversion funnel** — `start_shopping_clicked` → `product_viewed` → `product_added_to_cart` → `checkout_started` → `checkout_completed`
- **Products added to cart** — trend of `product_added_to_cart` broken down by `product_name`
- **Cart abandonment** — compare `checkout_started` vs `checkout_completed` over time
- **Top search terms** — breakdown of `product_searched` by `search_term`
- **Category interest** — breakdown of `product_category_filtered` by `category`

Useful links:

- [New insight](https://us.posthog.com/project/2/insights/new)
- [All dashboards](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
