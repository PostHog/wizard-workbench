# PostHog setup report

PostHog was added to the TanStack Router React app with environment-driven initialization, four action-bound product events, global exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed `@posthog/react` version `1.10.3` with pnpm; it was added to `package.json` and `pnpm-lock.yaml`.
- Added a root `PostHogProvider` in `src/routes/__root.tsx`, reading `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` through `import.meta.env`.
- The provider initializes only when both values are available, keeps production as a no-op when configuration is missing, and reports missing variable-specific configuration in development.
- Added the variable names to `.env.example`; both keys were confirmed present in the local `.env` through the environment tooling. The actual values are not reproduced here.
- The app sends directly to the configured PostHog host. No reverse proxy or CSP change was added.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `login_submitted` | A user successfully submits the demo sign-in form. | `src/routes/login.tsx` |
| `logout_completed` | A signed-in user chooses to sign out. | `src/routes/login.tsx` |
| `invoice_creation_submitted` | A user submits the create-invoice form. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_update_submitted` | A user submits changes to an existing invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |

The captures omit usernames, invoice form content, and other user-entered PII. Each currently carries the local `DISTINCT_ID` marker plus the SDK session ID. The run verified that four `posthog.capture` calls exist at the intended action handlers; it did **not** observe events arriving in PostHog.

## User identification

Identification was skipped. The demo authentication model exposes only a mutable username and no stable account ID, UUID, or other immutable identifier. Using the username or derived email as `distinct_id` would violate the identity contract, so no `identify()` or sign-out `reset()` was added.

### Follow-up issue: unresolved stable attribution

Stable attribution remains unresolved and directly affects the meaning of authenticated event data. Replace the `DISTINCT_ID` placeholder with a real stable authenticated ID and add `identify()` after successful login plus `reset()` before sign-out once the auth model exposes that ID. The placeholder is present at:

- `src/routes/login.tsx:7`, used by captures at lines 29 and 68.
- `src/routes/dashboard.invoices.index.tsx:10`, used by the capture at line 41.
- `src/routes/dashboard.invoices.$invoiceId.tsx:10`, used by the capture at line 99.

Until resolved, these events cannot reliably be attributed to a returning authenticated user.

## Error tracking

Global exception autocapture is enabled with `capture_exceptions: true` in `src/routes/__root.tsx` (the root provider options). No additional manual exception wrappers were added. The run verified the configuration in source, but did not trigger an exception and therefore did not confirm an exception event arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902707)

The dashboard contains four saved insights: login submissions trend, invoice creation trend, invoice updates trend, and a login-to-invoice-creation conversion funnel. The dashboard and insights were created successfully, but fresh insights may remain empty until events arrive.

## Build and verification

- `pnpm install` completed successfully and the lockfile was current.
- `pnpm build` completed successfully, including the Vite production build and `tsc --noEmit`.
- No lint script exists in `package.json`, so lint was not run.
- No CSP was found in project source.
- No event delivery, exception delivery, or production deployment was observed during this run.
- Vite emitted a non-blocking generated bundle-size warning; it did not prevent the build.

## Before you merge

- [ ] Run the full production build again in the target environment and fix any lint or type errors introduced by the integration.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `.env.example` are set in every deploy environment, not only local `.env`.
- [ ] Resolve stable identity before relying on authenticated attribution: update `src/routes/login.tsx:7`, `src/routes/dashboard.invoices.index.tsx:10`, and `src/routes/dashboard.invoices.$invoiceId.tsx:10`, then wire login identification and sign-out reset at the corresponding handlers.
- [ ] Exercise login, logout, invoice creation, invoice update, and an uncaught client exception in a deployed or local runtime, then confirm the expected events and exception data arrive in PostHog; the build alone does not prove delivery.
- [ ] If production ad blockers affect ingestion, consider a reverse proxy for the direct PostHog host configured in `src/routes/__root.tsx`.
