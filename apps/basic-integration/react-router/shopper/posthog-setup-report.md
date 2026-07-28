# PostHog setup report

PostHog product analytics and error tracking were added to the React Router storefront, with five commerce events, a starter dashboard, and environment-backed browser initialization.

## What was installed and initialized

- Installed `posthog-js` with `npm add posthog-js`; the dependency is recorded in `package.json` and `package-lock.json`.
- Added the browser-only singleton in `app/posthog.client.ts`. It reads `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`, initializes PostHog once when both are present, and is a production no-op with a development error when configuration is missing.
- Added both variable names to `.env.example`. The configured local environment contains both keys, but deployment environments still need to be configured separately.
- No server-side SDK was added because the app has no existing server-side event-sending pattern.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `product_added_to_cart` | A shopper adds a catalog product to the cart, including the product and resulting quantity. | `app/context/CartContext.tsx` |
| `cart_item_removed` | A shopper removes a catalog product from the cart. | `app/context/CartContext.tsx` |
| `cart_quantity_updated` | A shopper changes the quantity of a cart item. | `app/context/CartContext.tsx` |
| `checkout_started` | A shopper submits the checkout form with a non-empty cart. | `app/routes/checkout.tsx` |
| `order_completed` | The simulated checkout completes successfully, with aggregate order value and item counts only. | `app/routes/checkout.tsx` |

The event properties contain catalog or aggregate commerce data only. Checkout contact and payment fields were not sent as event properties.

## User identification and attribution

User identification was skipped. The storefront has no authentication, registration, session, logout, account-switching flow, or stable non-PII user identifier exposed to the browser. The five events therefore use PostHog's anonymous browser distinct ID. This means behavior cannot currently be attributed to a stable account across devices or authenticated sessions. If authentication is added, identify the stable account ID at login and on refresh, and reset on logout; do not use checkout contact fields as the identifier.

## Error tracking

`app/root.tsx` now calls `posthog.captureException(error)` once at the start of the global React Router `ErrorBoundary`. Existing error rendering and route handling were preserved. This wiring was reviewed, but no deliberate browser error was triggered, so arrival of an exception event was not observed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918348)

The dashboard contains five wizard-tagged insights for cart additions, checkout starts, completed orders, checkout-to-order conversion, and cart removals. The dashboard and its tiles were created successfully, but the run did not observe new events arriving, so the insights may remain empty until the instrumented paths are exercised in a real browser session.

## What the run verified

- `npm install` completed successfully.
- `npm run typecheck` passed (`react-router typegen && tsc`).
- `npm run build` passed for both client and SSR production bundles.
- The review found one browser-only PostHog singleton, environment-backed configuration, five live capture call sites, no capture PII, and one root error-boundary capture.
- The configured PostHog environment keys were present locally.

A passing build proves the code compiles and bundles; it does not prove that analytics events or exception events were delivered. No real browser event-delivery check was performed.

## Build and dependency conflicts

`npm` reported 17 pre-existing dependency vulnerabilities and two pending install-script approvals. Neither blocked installation, typechecking, or the production build. No other build conflict was recorded. There is no lint script in `package.json`.

## Next steps

1. Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deployment environment, using the exact names documented in `.env.example`.
2. Exercise add-to-cart, remove, quantity update, checkout start, successful order, and an application error in a real browser session, then confirm the corresponding events appear in PostHog. The run did not verify delivery.
3. Add stable-ID identification when authentication becomes available, including the returning-session and logout paths.
4. Review the dashboard after events arrive and confirm the funnel and trends contain data.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the wizard's build and typecheck passed, but there is no lint script in `package.json`.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `.env.example` are set in deployment environments, not only locally.
- [ ] In `app/context/CartContext.tsx` and `app/routes/checkout.tsx`, exercise every capture path in a real browser and verify events arrive in PostHog.
- [ ] If authentication is added before merge, wire `identify` with the stable account ID on login and returning sessions, and `reset` on logout; the current app has no such flow.
