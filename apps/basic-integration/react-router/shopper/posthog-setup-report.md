# PostHog post-wizard report

PostHog was added to the React Router framework-mode client entry point using `posthog-js` and `@posthog/react`. The SDK reads its public token and host from `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`, with default autocapture and session recording behavior preserved. Product funnel events were added for shopping, cart activity, checkout, and completed orders. Route errors are sent to PostHog exception tracking.

## Events

| Event | Description | File |
|---|---|---|
| `shopping_started` | A visitor clicks the primary call to action to begin shopping. | `app/routes/home.tsx` |
| `product_added_to_cart` | A visitor adds a product to the cart, including product and quantity context. | `app/routes/products.tsx` |
| `product_detail_added_to_cart` | A visitor adds a selected quantity from a product detail page. | `app/routes/products.$productId.tsx` |
| `checkout_started` | A visitor proceeds from the cart to checkout. | `app/routes/cart.tsx` |
| `order_completed` | A visitor successfully places an order. | `app/routes/checkout.tsx` |
| `cart_item_removed` | A visitor removes a product from the cart. | `app/routes/cart.tsx` |

## Next steps

Dashboard and notebook creation could not be completed because the PostHog MCP server was unavailable in this run.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap documentation used by collaborators.
- [ ] Wire source-map upload into CI so production browser stack traces de-minify.

### Agent skill

The installed integration skill is available under `.claude/skills/integration-react-react-router-7-framework/` for future agent development.
