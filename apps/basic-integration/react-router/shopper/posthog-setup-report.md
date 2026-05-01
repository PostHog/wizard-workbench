<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **Shopper** React Router v7 (Framework mode) e-commerce application. Here is a summary of all changes made:

**Client-side setup (`app/entry.client.tsx`):** Created this file to initialize the PostHog JS SDK and wrap the app in `PostHogProvider`, enabling `usePostHog()` access in all route components. Tracing headers (`X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID`) are forwarded to the server to correlate client and server events.

**Server-side middleware (`app/lib/posthog-middleware.ts`):** Created a PostHog Node.js middleware that initializes a server-side PostHog client per request, extracts session context from the tracing headers, and uses `withContext()` to automatically associate server events with the right user and session.

**Root route (`app/root.tsx`):** Registered the PostHog middleware in the `middleware` export array, and added `captureException` in the `ErrorBoundary` for automatic error tracking on unhandled route errors.

**Vite config (`vite.config.ts`):** Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR issues, and configured a dev-server proxy at `/ingest` to route PostHog requests through the local server.

**React Router config (`react-router.config.ts`):** Enabled `future.v8_middleware` to allow the middleware export.

**Route instrumentation:** Added `posthog.capture()` calls across all key user-facing routes covering the full shopping funnel.

| Event Name | Description | File |
|---|---|---|
| `add_to_cart` | User adds a product to the cart from the product listing page | `app/routes/products.tsx` |
| `product_searched` | User types a search term on the product listing page | `app/routes/products.tsx` |
| `products_filtered_by_category` | User selects a category filter on the product listing page | `app/routes/products.tsx` |
| `add_to_cart` | User adds a product to the cart from the product detail page (includes quantity) | `app/routes/products.$productId.tsx` |
| `remove_from_cart` | User removes an item from the shopping cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User changes the quantity of an item in the cart | `app/routes/cart.tsx` |
| `checkout_started` | User submits the checkout form — top of the final conversion funnel | `app/routes/checkout.tsx` |
| `order_placed` | User successfully places an order — the primary conversion event | `app/routes/checkout.tsx` |

## Next steps

We've prepared an **"Analytics basics"** dashboard for you with five key insights to monitor user behavior across the shopping funnel. Create the dashboard and insights in PostHog:

**1. [Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboards)**

Then add these five insights to it:

**2. 🛒 Purchase Conversion Funnel** — Tracks drop-off across the key funnel steps:
[Create funnel insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS) → Steps: `add_to_cart` → `checkout_started` → `order_placed`

**3. 📦 Orders Placed Over Time** — Trend of successful order completions:
[Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS) → Event: `order_placed`

**4. 🛍️ Add to Cart Activity** — Volume of add-to-cart actions, breakable down by `source` (listing vs detail page) or `product_category`:
[Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS) → Event: `add_to_cart`

**5. 🔍 Product Search Usage** — How often users search for products:
[Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS) → Event: `product_searched`

**6. 🗑️ Cart Removals** — Track cart abandonment signals via remove events:
[Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS) → Event: `remove_from_cart`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
