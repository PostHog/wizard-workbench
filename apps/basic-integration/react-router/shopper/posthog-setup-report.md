# PostHog setup report

PostHog browser analytics was installed and initialized for the React Router storefront, with five anonymous product and checkout events, centralized error tracking, and a starter dashboard.

## Installed and initialized

- Added `posthog-js` (`^1.407.8`) to `package.json`; the resolved dependency graph is recorded in `package-lock.json`.
- Created the browser singleton at `app/posthog.client.ts`. It reads `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`, initializes PostHog once when both are present, fails loudly in development when either is missing, and remains a production no-op when configuration is absent.
- Added the same variable names to `.env.example`; real values were configured in the local `.env` through the wizard environment tooling.
- No server SDK was installed. No CSP changes were needed because the project has no app-owned CSP directives.

## Events instrumented

These captures were added at user-action handlers. The run verified their presence in the source and event plan; it did **not** observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `product_category_selected` | Visitor filters the catalog by product category. | `app/routes/products.tsx` |
| `product_added_to_cart` | Visitor adds a product from the catalog or product detail page. | `app/routes/products.tsx`, `app/routes/products.$productId.tsx` |
| `cart_item_removed` | Visitor removes an item from the cart. | `app/routes/cart.tsx` |
| `cart_quantity_updated` | Visitor changes an item quantity in the cart. | `app/routes/cart.tsx` |
| `checkout_completed` | Visitor completes the simulated checkout successfully. | `app/routes/checkout.tsx` |

Event properties are non-PII product and cart metrics. Checkout shipping and payment fields are deliberately excluded. Captures use anonymous SDK identity because no stable account identity exists.

## User identification

Identification was skipped. The storefront has no login, registration, session, account model, or stable non-PII user ID. No `DISTINCT_ID` placeholder was introduced. Until authentication exists, events remain anonymous. When authentication is added, identify users with a stable non-PII ID on login and refresh, and reset on logout; never use checkout fields as the distinct ID.

## Error tracking

`app/root.tsx` now calls `posthog.captureException(error)` from the root React Router `ErrorBoundary`, guarded for browser execution. This covers centralized route/render errors. The run verified the source change, but did not trigger an application error and therefore did not observe an exception event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924738) contains five saved `(wizard)` insights: category selections, products added to cart, cart adjustments, checkout completion, and an add-to-cart-to-checkout funnel. The dashboard was created successfully, but is expected to remain empty until the application sends events.

## Verification and conflicts

- `npm install` completed successfully with the detected npm package manager.
- `npm run typecheck` completed successfully.
- `npm run build` completed successfully for both Vite client and SSR builds.
- Review found no unrelated changes, unnecessary configuration, or build conflict. No lint script is defined in `package.json`, so linting was not available.
- These checks prove the code compiles and the dependency graph resolves; they do not prove that events or exceptions flow to PostHog. No event delivery was observed during this run.

## Unresolved follow-up issue

The app has no authenticated user identity, so attribution across anonymous-to-authenticated sessions cannot be established. If left unresolved, the dashboard can measure aggregate storefront behavior but cannot reliably attribute actions to known accounts or join pre-login and post-login activity.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the run verified `npm run build` and `npm run typecheck`, but no lint script exists. Review `package.json` scripts and the changed files under `app/`.
- [ ] Run the test suite, if one is added or available, and update mocks or fixtures for the instrumented handlers in `app/routes/products.tsx`, `app/routes/products.$productId.tsx`, `app/routes/cart.tsx`, and `app/routes/checkout.tsx`.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only local `.env`; check `app/posthog.client.ts` and deployment/bootstrap configuration.
- [ ] Manually exercise category selection, add-to-cart, cart adjustment/removal, checkout completion, and an error path, then confirm the corresponding events and exception appear in PostHog; the run only verified source wiring.
- [ ] If authentication is introduced, wire stable non-PII identification on login and refresh plus reset on logout before relying on account-level attribution; see the future auth call sites and `app/posthog.client.ts`.
