# PostHog setup report

PostHog browser analytics, seven commerce events, centralized exception capture, and a starter analytics dashboard were added to the React Router shopping demo.

## What was installed and initialized

- Installed `posthog-js` with npm; the package and lockfile were updated successfully.
- Added browser-only initialization in `app/posthog.client.ts`.
- Initialization reads `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from environment variables, initializes the SDK once when both are present, throws a descriptive development error when configuration is missing, and is a production no-op when absent.
- Imported the singleton initialization from `app/root.tsx` so it loads globally.
- Added `.env.example` documenting the required environment variable names; the managed environment was verified to contain both keys without exposing their values.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `product_selected` | A shopper opens a product detail page from the catalogue. | `app/routes/products.tsx` |
| `product_added_to_cart` | A shopper adds one or more units of a product to the cart. | `app/routes/products.tsx`, `app/routes/products.$productId.tsx` |
| `product_category_filtered` | A shopper applies a product category filter in the catalogue. | `app/routes/products.tsx` |
| `cart_item_removed` | A shopper removes an item from the cart. | `app/routes/cart.tsx` |
| `cart_quantity_updated` | A shopper changes the quantity of an item in the cart. | `app/routes/cart.tsx` |
| `checkout_started` | A shopper proceeds from the cart to checkout. | `app/routes/cart.tsx` |
| `order_completed` | A shopper completes the simulated order placement flow. | `app/routes/checkout.tsx` |

The event plan and review confirm these calls use non-PII product or transaction metadata. The run did not observe events arriving in PostHog, so ingestion and production delivery remain unconfirmed. The order-completion event is based on the app's simulated flow and its unconditional success behavior.

## User identification

Identification was skipped. The application has no authentication, login, logout, persisted user record, session, or stable non-PII user identifier. Events intentionally remain anonymous. Checkout fields must not be used as a distinct ID. If authentication is added later, wire `identify()` at the confirmed stable-user boundary and `reset()` at logout or account switch.

## Error tracking

The existing global React Router ErrorBoundary in `app/root.tsx` now calls `posthog.captureException(error)` for `Error` instances. This centralizes uncaught route/render exception reporting. The run verified the code path was added, but did not trigger an application error or observe an exception arrive in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902691) was created in PostHog project `483112` with five insights: product selection-to-cart funnel, cart activity trends, checkout completion funnel, product category filter breakdown, and completed orders headline. They cover the last 30 days and currently may be empty because the run did not observe event ingestion.

## Verification and unresolved issues

- `npm install` completed successfully.
- `npm run typecheck` completed successfully.
- `npm run build` completed successfully, producing client and SSR server bundles; the separate client PostHog chunk supports the browser-only initialization assumption.
- Review found no required integration fixes.
- Existing npm audit vulnerabilities and pending install-script approvals were reported; the handoff did not attribute them to this integration.
- No CSP policy was found in the inspected project files, so no CSP change was made.

### Follow-up issue: event delivery is unresolved

The run verified source instrumentation and successful compilation, but did not establish that any event or exception reached PostHog. If left unresolved, the dashboard and Error Tracking stream can remain empty despite the code compiling. Exercise the relevant flows in a deployed environment and confirm events and exceptions in PostHog.

## Before you merge

- [ ] Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `.env.example` in every deployment environment, not only the local managed `.env`; review `app/posthog.client.ts`.
- [ ] Run the full production build and fix any lint or type errors introduced by the integration; the recorded build/typecheck passed, but the final environment still needs confirmation.
- [ ] Run the test suite and update mocks or fixtures if the instrumented handlers require them; the run did not report test execution.
- [ ] Exercise product, cart, checkout, and error-boundary flows and confirm `product_selected`, `product_added_to_cart`, `product_category_filtered`, `cart_item_removed`, `cart_quantity_updated`, `checkout_started`, `order_completed`, and exception data arrive in PostHog; review `app/routes/products.tsx`, `app/routes/products.$productId.tsx`, `app/routes/cart.tsx`, `app/routes/checkout.tsx`, and `app/root.tsx`.
- [ ] If authentication is introduced, add stable-ID `identify()` and logout/account-switch `reset()` boundaries; review the identity decision alongside `app/posthog.client.ts` and do not use checkout PII.
