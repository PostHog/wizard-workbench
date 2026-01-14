# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Shopper e-commerce application. The integration includes:

- **Client-side initialization** via `app/entry.client.tsx` with the PostHog React provider
- **Server-side middleware** via `app/lib/posthog-middleware.ts` for SSR support and session/user context passing
- **Error tracking** in the root ErrorBoundary component with automatic exception capture
- **User identification** on checkout to associate anonymous users with their email
- **Event tracking** throughout the customer journey from browsing to purchase

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `product_added_to_cart` | User adds a product to their shopping cart from the products listing page | `app/routes/products.tsx` |
| `product_added_to_cart` | User adds a product to their shopping cart from the product detail page | `app/routes/products.$productId.tsx` |
| `product_removed_from_cart` | User removes a product from their shopping cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User updates the quantity of an item in their cart | `app/routes/cart.tsx` |
| `checkout_started` | User proceeds from cart to checkout page with items in cart | `app/routes/cart.tsx` |
| `order_placed` | User successfully completes checkout and places an order | `app/routes/checkout.tsx` |
| `product_searched` | User searches for products using the search input | `app/routes/products.tsx` |
| `category_filtered` | User filters products by selecting a category | `app/routes/products.tsx` |
| `error_occurred` | An error is caught by the application error boundary | `app/root.tsx` |

## Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables for PostHog API key and host |
| `app/entry.client.tsx` | Client-side PostHog initialization with PostHogProvider |
| `app/lib/posthog-middleware.ts` | Server-side middleware for SSR tracking |
| `react-router.config.ts` | Enabled v8_middleware feature flag |
| `vite.config.ts` | SSR noExternal config and proxy for PostHog |

## Environment Variables

The following environment variables are configured in `.env`:

```bash
VITE_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Next steps

### Recommended Dashboard Insights

Create a dashboard named "Analytics basics" in PostHog with the following insights:

1. **Purchase Funnel**: A funnel insight tracking `product_added_to_cart` -> `checkout_started` -> `order_placed` to measure conversion rates
2. **Add to Cart by Source**: Breakdown of `product_added_to_cart` events by source (products_listing vs product_detail)
3. **Cart Abandonment**: Users who triggered `checkout_started` but not `order_placed`
4. **Revenue Over Time**: Total revenue from `order_placed` events using the `order_total` property
5. **Product Search Trends**: Top search terms from `product_searched` events

### Creating Your Dashboard

1. Log in to [PostHog](https://us.i.posthog.com)
2. Navigate to Dashboards and create "Analytics basics"
3. Add the recommended insights above

### Agent skill

We've configured PostHog with best practices for React Router 7 Framework mode. The integration follows the documented patterns including:

- PostHogProvider wrapping the app at the client entry point
- Server-side middleware with proper session/distinct ID passing
- Error tracking with captureException in ErrorBoundary
- User identification on checkout forms

This context will help you prevent the model from using out-of-date approaches to the PostHog integration.
