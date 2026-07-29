# PostHog setup report

PostHog product analytics and global exception autocapture were added to the client-side TanStack Router app, with invoice event instrumentation and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` `^1.407.8` with pnpm and added it to `package.json` and `pnpm-lock.yaml`.
- Installed `@posthog/react` `1.10.3` with pnpm and added it to `package.json` and `pnpm-lock.yaml`.
- Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to the local `.env` through the wizard, and documented both names in `.env.example`.
- `src/main.tsx` reads those Vite variables and mounts one `PostHogProvider` around the root application when both are present. Development throws a descriptive missing-configuration error; production leaves the app running without PostHog when configuration is absent.
- `tsconfig.json` includes `vite/client` types so `import.meta.env` typechecks.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `invoice_created` | An invoice is successfully created from the new-invoice form. | `src/main.tsx` |
| `invoice_updated` | An existing invoice's changes are successfully saved. | `src/main.tsx` |

Both events are captured only in successful mutation callbacks and include the non-PII `invoice_id` property. The run did not observe either event arriving in PostHog; the event plan and code call sites verify instrumentation only.

## User identification

Identification was skipped. The demo auth model in `src/main.tsx` exposes only a username, and the run did not find a stable non-PII account identifier. The username was deliberately not used as a distinct ID or event property. Until a stable account ID is exposed, events remain anonymous/personless. No `identify()` or `reset()` wiring was added.

## Error tracking

Global exception autocapture is configured centrally through `PostHogProvider` in `src/main.tsx` with `capture_exceptions: true`. No manual error wrapper or additional scattered error captures were added. The run did not trigger an exception and therefore did not verify an error arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924775) contains three tagged trends tiles for invoice creations, invoice updates, and invoice activity comparison over the last 30 days. The dashboard and insights were created successfully, but the run did not verify incoming event data.

## Verification and conflicts

The review task ran `pnpm build`: Vite built 143 modules and `tsc --noEmit` completed successfully. The only output was a non-failing, pre-existing Vite chunk-size advisory. No build conflict occurred. No lint or standalone typecheck script was present in `package.json`, and no test suite was run. A green build confirms compilation/typechecking, not that analytics events or exceptions reach PostHog.

## Unresolved issue to follow up

- **Stable identity is unresolved:** `src/main.tsx` auth state and login/logout flow (inspect the `Auth` declaration and `auth.login`/`auth.logout` call sites, around the lower section of the file) provide only `username`. Leaving this unresolved prevents reliable cross-session attribution of `invoice_created` and `invoice_updated`, and prevents safely wiring login-time `identify()` and logout `reset()`.

## Before you merge

- [ ] Run the full production build and fix any lint or type errors introduced by the integration; the wizard verified `pnpm build`, but not every production/CI configuration.
- [ ] Run the test suite and update any mocks or fixtures affected by the new `@posthog/react` provider and `usePostHog()` calls in `src/main.tsx` (around lines 154, 462, and 554).
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `.env.example` are set in each deployment environment, not only in the local `.env`.
- [ ] Expose a stable, non-PII account identifier in the auth model and add `identify(stableUserId, ...)` after login plus `reset()` on logout in `src/main.tsx`; do not use the current username-only value.
- [ ] In a real browser session, create and update an invoice, then confirm `invoice_created` and `invoice_updated` arrive in PostHog with the expected `invoice_id`; the run itself did not observe event delivery.
- [ ] If production uncaught exceptions must be validated, trigger a controlled test exception and confirm error tracking receives it; `capture_exceptions` is configured in `src/main.tsx`, but delivery was not observed during this run.
