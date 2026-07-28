# PostHog setup report

PostHog was installed and initialized for the client-side TanStack Router app, with three product events instrumented, global exception capture enabled, and a starter dashboard created.

## Installed and initialized

- Installed `@posthog/react` `^1.10.3` with pnpm; `package.json` and `pnpm-lock.yaml` were updated/current.
- Added a single `PostHogProvider` at `src/routes/__root.tsx`, using `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from the environment.
- Missing configuration is loud in development and a no-op in production. `capture_exceptions: true` is enabled in the provider options (`src/routes/__root.tsx`).
- The configured environment keys are documented in `.env.example`; real values were configured in `.env` during the run.
- No server-side SDK was installed because this is a client-only app.

## Events instrumented

These events are present in the event plan and are instrumented at successful action points. The run did **not** launch the app or observe events arriving in PostHog, so delivery and event volume remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A demo sign-in form submission that succeeds, without username or other user-entered data | `src/routes/login.tsx` |
| `invoice_created` | A new invoice created successfully from the invoice creation form | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | An existing invoice saved successfully from its detail view | `src/routes/dashboard.invoices.$invoiceId.tsx` |

The invoice events include the internal `invoice_id`; the run treated that identifier as non-PII. User-entered invoice content and usernames are not sent as event properties.

## Identification status

User identification and logout reset were **skipped**. The demo authentication model only exposes a mutable username and has no durable, stable, non-PII user identifier. Using the username as a distinct ID would not meet the integration requirements. This leaves the three product events intentionally personless until the app provides a stable user ID.

### Unresolved issue to follow up

Stable attribution could not be established because the auth model in `src/utils/auth.tsx` and login flow in `src/routes/login.tsx` expose only a username. If left unresolved, login and invoice activity cannot be reliably tied to a durable user across sessions or account changes. Add a stable non-PII user identifier, then wire `identify()` on successful login/restoration and `reset()` before logout state is cleared.

## Error tracking

Global exception autocapture is enabled through `capture_exceptions: true` in `src/routes/__root.tsx`. No manual exception event was observed during the run; the build verifies configuration compiles, not runtime error delivery.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919864)

The dashboard was created with five insights: login trend, invoice activity trend, invoice updates by `invoice_id`, login-to-invoice funnel, and invoice-creation-to-update funnel. The insights may remain empty until the app sends events; this run did not confirm event arrival.

## Build and verification

- `pnpm install` completed successfully and reported the lockfile was current.
- `pnpm build` completed successfully: Vite built 183 modules and TypeScript completed with exit code 0.
- No lint or standalone typecheck script exists in `package.json`.
- The package install emitted pnpm's ignored build-scripts warning for `core-js` and `esbuild`; it did not prevent the build.
- Vite emitted a non-failing chunk-size advisory. No build conflict blocked the integration.
- The run did not run the app, a test suite, or a browser verification, so it did not verify that events or exceptions actually reach PostHog.

## Before you merge

- [ ] Run the full production build and fix any lint or type errors introduced by the integration; the run verified `pnpm build` successfully, but this remains a deployment check.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `.env.example` are configured in every deploy environment, not only local `.env` (`.env.example`, `src/routes/__root.tsx:26-27`).
- [ ] Add a stable non-PII user ID to the auth model and wire identification/reset before relying on attribution (`src/utils/auth.tsx`, `src/routes/login.tsx`).
- [ ] Exercise successful login, invoice creation, and invoice update in a real browser and confirm `user_logged_in`, `invoice_created`, and `invoice_updated` arrive in PostHog; the run only verified code paths and dashboard configuration.
