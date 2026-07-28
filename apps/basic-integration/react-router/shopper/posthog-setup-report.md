# PostHog setup report

PostHog analytics was installed and initialized for the React Router shopper app, with six anonymous commerce events, global exception capture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` with npm; `package.json` and `package-lock.json` were updated. No server-side SDK was added because no server event-sending requirement was identified.
- Added the singleton client in `app/posthog.client.ts`. It reads `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`, reports missing configuration loudly in development, remains a production no-op when configuration is missing, and calls `posthog.init()` once with the configured host and default SDK behavior.
- Imported the client from `app/root.tsx`, so browser initialization occurs through the app root.
- Added the environment variable names to `.env.example`; the review handoff confirmed both required keys are present in the configured `.env`.
- No Content-Security-Policy was found in the inspected app root or HTML, so no CSP directives were changed.

## Events instrumented

These are instrumented call sites, not events observed arriving in PostHog. The run did not browser-exercise the app or confirm network delivery; the dashboard insights may therefore remain empty until the app is used.

| Event | What it measures | File |
|---|---|---|
| `product_added_to_cart` | A shopper adds a product from the product list, including product metadata and selected quantity. | `app/routes/products.tsx` |
| `product_added_to_cart` | A shopper adds a selected quantity from a product detail page. | `app/routes/products.$productId.tsx` |
| `cart_item_removed` | A shopper removes a product from the cart. | `app/routes/cart.tsx` |
| `cart_quantity_updated` | A shopper changes an item quantity in the cart. | `app/routes/cart.tsx` |
| `checkout_started` | A shopper submits checkout with a non-empty cart. | `app/routes/checkout.tsx` |
| `order_completed` | The demo’s simulated checkout completes successfully. | `app/routes/checkout.tsx` |

Capture properties contain catalog, product, quantity, and aggregate order metadata only. Checkout form, payment, shipping, and other personal data were not added to event properties.

## User identification

Identification was skipped. The app has no authentication, registration, persisted user session, account switching, logout flow, backend identity source, or stable non-PII user identifier. Events intentionally use PostHog’s anonymous browser identity. If an authenticated user model is added later, identification should be wired at that authentication boundary using the stable non-PII identifier, with reset on logout or account change; checkout fields must not be used as identity.

## Error tracking

The existing global React Router error boundary in `app/root.tsx:60` now calls `posthog.captureException(error)` while preserving the existing fallback UI and route error handling. The run verified the call statically, but did not deliberately trigger an application error or confirm delivery to PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914349)

The dashboard contains four tagged insights covering cart additions, checkout versus completed orders, cart management activity, and the ordered shopping conversion funnel. The dashboard and insights were created successfully; event data was not observed during this run.

## Verification and conflicts

- `npm install` completed without dependency-resolution failures.
- `npm run typecheck` completed successfully.
- `npm run build` completed both the Vite client and SSR builds successfully.
- Static review found no required fixes across minimality, unrelated changes, codebase conventions, or framework-example alignment.
- The package manifest has no lint script, so no lint command was available.
- The build and typecheck prove the code compiles and bundles; they do not prove that events flow to PostHog.
- Full dependency conflict note: npm reported 17 existing audit vulnerabilities and pending install-script approvals for `core-js` and `esbuild`. These were unrelated to the PostHog integration and did not block installation, typecheck, or build.

## Before you merge

- [ ] Run the full production build again in the deployment environment and fix any lint or type errors introduced by the integration; the verified commands were `npm run typecheck` and `npm run build`.
- [ ] Run the test suite; instrumented call sites in `app/routes/products.tsx`, `app/routes/products.$productId.tsx`, `app/routes/cart.tsx`, and `app/routes/checkout.tsx` may require updated mocks or fixtures.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only local `.env` (`.env.example:1-2`; initialization reads them in `app/posthog.client.ts:3-4`).
- [ ] Exercise add-to-cart, cart management, checkout, and successful completion in a deployed build, then confirm the six planned events arrive in PostHog; this run only verified reachable capture handlers.
- [ ] If authentication is introduced, add stable non-PII identification and logout/account-change reset at that future auth boundary; no current file contains an identify call because no such boundary exists.
