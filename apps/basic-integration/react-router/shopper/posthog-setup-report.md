# PostHog setup report

PostHog browser analytics, anonymous storefront event capture, global error tracking, and a starter dashboard were added to the React Router app.

## Installed and initialized

- Installed `posthog-js` at `^1.408.0` with npm; `package.json` and `package-lock.json` were updated.
- Initialization lives in `app/posthog.client.ts` as the shared browser-only singleton/facade.
- The module reads `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`; the real values were configured in `.env`, and the names are documented in `.env.example`.
- The review replaced server-evaluated SDK loading with browser-only dynamic initialization for SSR safety. Default SDK capture settings were preserved.
- No CSP was added or changed; the project has no CSP.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `product_added_to_cart` | A shopper adds a catalog product to the cart, including product metadata and resulting quantity. | `app/context/CartContext.tsx` |
| `cart_item_removed` | A shopper removes a product from the cart. | `app/context/CartContext.tsx` |
| `cart_quantity_updated` | A shopper changes the quantity of an existing cart item. | `app/context/CartContext.tsx` |
| `checkout_started` | A shopper proceeds from a populated cart to checkout. | `app/routes/cart.tsx` |
| `order_completed` | A shopper successfully completes the simulated order flow, with order total and item count. | `app/routes/checkout.tsx` |

These events use catalog and transaction metadata only. Checkout contact and payment fields were not sent as event properties. The run planned and wired the captures, but did not browser-exercise delivery; no event arrival in PostHog was verified.

## User identification

Identification was skipped. The storefront has no login, registration, logout, persisted account, session, or durable stable user identifier. Checkout contact fields are not an acceptable distinct ID or event payload. Events are therefore personless/anonymous. If authentication is added later, identify at login or registration using the stable account ID, set contact details as person properties, and reset at logout.

## Error tracking

`app/root.tsx` captures uncaught framework-level errors from the global React Router `ErrorBoundary` through `posthog.captureException()`, converting non-`Error` route failures into `Error` instances. No manual error captures were added elsewhere. The run did not exercise error delivery to PostHog.

## Dashboard

The starter dashboard **Analytics basics (wizard)** contains four tagged insights for the last 30 days: checkout conversion, cart activity, completed orders, and checkout starts. It is expected to populate as events arrive; the run verified dashboard and saved-insight creation, not incoming event data.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1926646)

## Build and dependency status

The review recorded successful `npm install`, `npm run build` (client and server builds), and `npm run typecheck`. No lint script exists, so linting was not run. The browser was not exercised and event delivery was not confirmed.

The recorded dependency conflict is: npm reported **17 existing audit vulnerabilities** and pending allow-script approvals for **core-js** and **esbuild**; dependency installation, build, and type checking nevertheless completed successfully.

## Follow-up issues

- **Event delivery remains unresolved:** the review explicitly did not browser-exercise the app, so it could not establish that any of the five events or error captures reached PostHog. If left unresolved, the dashboard may remain empty despite compiling code.
- **Anonymous attribution is unresolved by design:** no stable user identifier exists. If left unchanged after accounts are introduced, events will remain fragmented across anonymous IDs and cannot be reliably attributed to accounts.
- **Deployment environment coverage is unverified:** the run assumes the two Vite environment keys are supplied to production client builds; it did not verify deployed configuration.

## Before you merge

- [ ] Run a full production build and type check after integrating the final changes; inspect the PostHog initialization and capture call sites in `app/posthog.client.ts`, `app/context/CartContext.tsx`, `app/routes/cart.tsx`, `app/routes/checkout.tsx`, and `app/root.tsx` (the exact lines may shift as files change).
- [ ] Run the test suite and update mocks or fixtures for the instrumented cart, checkout, and error-boundary paths; review the capture calls in `app/context/CartContext.tsx`, `app/routes/cart.tsx`, `app/routes/checkout.tsx`, and `app/root.tsx`.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only local `.env`; review the environment reads in `app/posthog.client.ts`.
- [ ] Load the deployed app, exercise cart mutations and the checkout success path, and confirm the five event names arrive in PostHog; review the corresponding capture handlers in `app/context/CartContext.tsx`, `app/routes/cart.tsx`, and `app/routes/checkout.tsx`.
- [ ] Decide how to connect future authenticated users: add identify/reset around the account boundaries and review the shared client in `app/posthog.client.ts`; do not use checkout contact fields as a distinct ID.
