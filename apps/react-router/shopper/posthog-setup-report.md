# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your React Router 7 e-commerce application. The integration includes automatic pageview tracking, custom event tracking for key user actions throughout the shopping funnel, user identification at checkout, and error tracking in the ErrorBoundary. Environment variables have been configured for secure API key management using Vite's environment variable system (`VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST`). The `@posthog/react` package has been installed for improved React integration.

## Files Created/Modified

| File | Change |
|------|--------|
| `.env` | Created with PostHog API key and host environment variables |
| `app/providers/PostHogProvider.tsx` | Updated to use `@posthog/react` package |
| `app/root.tsx` | Added error tracking with `captureException` and `error_page_viewed` event |
| `app/routes/home.tsx` | Added `start_shopping_clicked` event tracking |
| `app/routes/products.tsx` | Added `product_added_to_cart`, `product_searched`, `product_category_filtered` events |
| `app/routes/products.$productId.tsx` | Added `product_detail_viewed`, `out_of_stock_product_viewed`, `product_added_to_cart_from_detail` events |
| `app/routes/cart.tsx` | Added `empty_cart_viewed`, `browse_products_from_empty_cart_clicked`, `product_removed_from_cart`, `cart_quantity_updated`, `proceed_to_checkout_clicked`, `continue_shopping_clicked` events |
| `app/routes/checkout.tsx` | Added `checkout_started`, `checkout_abandoned`, `order_placed` events and user identification |
| `app/components/Navbar.tsx` | Added `navbar_products_clicked`, `navbar_cart_clicked` events |

## Events Instrumented

| Event Name | Description | File |
|------------|-------------|------|
| `$pageview` | Automatic pageview tracking on route changes | `app/providers/PostHogProvider.tsx` |
| `start_shopping_clicked` | User clicks the 'Start Shopping' CTA on the home page | `app/routes/home.tsx` |
| `product_detail_viewed` | User views a product detail page (top of conversion funnel) | `app/routes/products.$productId.tsx` |
| `out_of_stock_product_viewed` | User views an out-of-stock product (lost opportunity tracking) | `app/routes/products.$productId.tsx` |
| `product_added_to_cart` | User adds a product from the products list page | `app/routes/products.tsx` |
| `product_added_to_cart_from_detail` | User adds a product from the product detail page (includes quantity) | `app/routes/products.$productId.tsx` |
| `product_searched` | User searches for products using the search input | `app/routes/products.tsx` |
| `product_category_filtered` | User filters products by category | `app/routes/products.tsx` |
| `navbar_products_clicked` | User clicks Products link in navigation bar | `app/components/Navbar.tsx` |
| `navbar_cart_clicked` | User clicks Cart link in navigation bar | `app/components/Navbar.tsx` |
| `empty_cart_viewed` | User views an empty cart (churn indicator) | `app/routes/cart.tsx` |
| `browse_products_from_empty_cart_clicked` | User clicks to browse products from empty cart (recovery action) | `app/routes/cart.tsx` |
| `product_removed_from_cart` | User removes a product from their shopping cart | `app/routes/cart.tsx` |
| `cart_quantity_updated` | User updates the quantity of an item in their cart | `app/routes/cart.tsx` |
| `proceed_to_checkout_clicked` | User clicks 'Proceed to Checkout' from the cart page | `app/routes/cart.tsx` |
| `continue_shopping_clicked` | User clicks 'Continue Shopping' from the cart page | `app/routes/cart.tsx` |
| `checkout_started` | User views the checkout page with items in cart (top of checkout funnel) | `app/routes/checkout.tsx` |
| `checkout_abandoned` | User leaves checkout without completing purchase (churn event) | `app/routes/checkout.tsx` |
| `order_placed` | User successfully completes an order (conversion event) | `app/routes/checkout.tsx` |
| `error_page_viewed` | User encounters an error page (error tracking) | `app/root.tsx` |

## User Identification

Users are automatically identified when they complete checkout using their email address. The following properties are captured:
- `email`
- `name`
- `city`
- `zip_code`

## Error Tracking

The ErrorBoundary captures all errors using `posthog.captureException()` for comprehensive error monitoring in PostHog.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/228144/dashboard/994317) - Overview dashboard with key e-commerce metrics

### Insights
- [E-commerce Conversion Funnel](https://us.posthog.com/project/228144/insights/EeAHYA8X) - Full funnel from "Start Shopping" to "Order Placed"
- [Cart Abandonment Rate](https://us.posthog.com/project/228144/insights/u1ZCKcEE) - Track users who add to cart but don't complete purchase
- [Orders Over Time](https://us.posthog.com/project/228144/insights/AE6jNyeV) - Daily trend of completed orders
- [Product Search Activity](https://us.posthog.com/project/228144/insights/0eXZWXz7) - Search and category filter usage
- [Add to Cart Activity](https://us.posthog.com/project/228144/insights/PFspFaHM) - Compare add-to-cart from product list vs detail pages

### Recommended Additional Insights

Based on the new events added, consider creating these additional insights:

1. **Product Detail to Cart Funnel**: `product_detail_viewed` → `product_added_to_cart_from_detail`
2. **Empty Cart Recovery**: Track `empty_cart_viewed` → `browse_products_from_empty_cart_clicked` → `product_added_to_cart`
3. **Checkout Abandonment**: `checkout_started` → `checkout_abandoned` vs `order_placed`
4. **Out of Stock Impact**: Monitor `out_of_stock_product_viewed` events
5. **Error Monitoring**: Track `error_page_viewed` events over time

## Getting Started

1. Run the development server: `npm run dev`
2. Navigate through the app to generate events
3. View your data in the [PostHog dashboard](https://us.posthog.com/project/228144/dashboard/994317)
