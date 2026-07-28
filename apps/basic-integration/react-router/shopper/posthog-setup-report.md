# PostHog setup report

PostHog client analytics, anonymous commerce event capture, global exception tracking, and a starter dashboard were added to the React Router storefront.

## Installed and initialized

- Installed `posthog-js` and `@posthog/react` with npm; no server SDK was added because no server-side event sender was identified.
- Browser initialization lives in `app/posthog.client.ts` and runs once when `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` are available. Missing configuration is a development diagnostic and a production no-op.
- `app/root.tsx` imports the singleton client module. The real environment values are configured in `.env`; the variable names are documented in `.env.example`.
- No CSP was present, so no CSP directives were changed.

## Events instrumented

These four events were added to the event contract and wired at their application handlers. The run did not observe events arriving in PostHog, so their delivery is **unconfirmed**.

| Event | What it measures | Source file |
|---|---|---|
| `product_added_to_cart` | A shopper adds one or more units of a product to the cart. | `app/context/CartContext.tsx` |
| `cart_item_removed` | A shopper removes a product from the cart. | `app/context/CartContext.tsx` |
| `cart_item_quantity_changed` | A shopper changes the quantity of a product already in the cart. | `app/context/CartContext.tsx` |
| `checkout_completed` | A shopper completes the simulated order placement flow. | `app/routes/checkout.tsx` |

The captures use anonymous browser distinct IDs because the app has no account or stable authenticated-user model. No PII, payment details, shipping fields, emails, names, or phone numbers are included. `checkout_completed` currently follows the demo's simulated order-success timeout; production should move it behind authoritative backend/payment confirmation.

## User identification

Identification was skipped. The app has no login, logout, registration, session, authentication, or user model, so no stable non-PII identifier is available. If authentication is added later, wire `identify` after successful login and on authenticated refresh, and call `reset` on logout or account switching using a stable user ID—not an email or username.

## Error tracking

The existing global React Router `ErrorBoundary` in `app/root.tsx` now calls `posthog.captureException` for non-route errors. Route error responses, including 404s, are intentionally excluded. This wiring was not exercised against a live exception during the run, so arrival in PostHog Error Tracking is unconfirmed.

## Dashboard

The starter dashboard contains four live, last-30-days insights for cart additions, cart removals, checkout completions, and cart-to-checkout conversion. The dashboard and insights exist in PostHog, but the run did not verify that event data has populated them.

[Open Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919839)

## What the run verified

- npm installation completed and dependencies were current on review.
- Production client and SSR builds completed successfully.
- Type checking completed successfully.
- Environment-key checks found both required `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` keys.
- The event handlers, singleton usage, no-PII properties, and exception-boundary placement were reviewed.
- The dashboard was created with four attached insights.

A passing build and typecheck prove compilation and type safety only; they do not prove that browser events or exceptions reached PostHog. No live event flow was observed, and no test suite was run.

## Build and dependency conflict

No integration conflict blocked the work. npm reported 17 dependency audit vulnerabilities and pending install-script approval notices. These did not block installation, the production build, or type checking; they remain dependency-maintenance items.

## Next steps

1. Set `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` in every deployment environment, not only the local `.env`, and keep the exact names documented in `.env.example`.
2. Exercise add-to-cart, remove, quantity-change, and successful checkout flows in a deployed/browser environment, then confirm the four event names arrive in PostHog and populate the dashboard.
3. Trigger a controlled uncaught application error and confirm it appears in PostHog Error Tracking.
4. Replace the simulated checkout success boundary with authoritative payment/backend confirmation before relying on `checkout_completed` for conversion reporting.
5. Review the npm audit vulnerabilities and install-script notices according to the project's dependency policy.
6. If production bundles are minified, configure source-map upload in CI so captured production stack traces can be de-minified.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration (`app/posthog.client.ts`, `app/root.tsx`, `app/context/CartContext.tsx`, and `app/routes/checkout.tsx`).
- [ ] Run the test suite and update mocks or fixtures for the instrumented call sites in `app/context/CartContext.tsx` and `app/routes/checkout.tsx`.
- [ ] Confirm `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` are set in each deploy environment and match the names documented in `.env.example`.
- [ ] Exercise each instrumented handler and verify the corresponding events arrive in PostHog; the run itself did not observe delivery.
- [ ] Trigger a non-route application exception and verify `app/root.tsx`'s `captureException` call produces an Error Tracking issue.
- [ ] If the browser deployment serves minified bundles, wire source-map upload into CI before relying on production stack traces.
