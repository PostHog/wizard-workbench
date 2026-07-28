# PostHog setup report

PostHog client analytics was installed and initialized for the file-based TanStack Router app, with four product events and a starter dashboard configured.

## What was installed and initialized

- Installed `@posthog/react` `^1.10.3` with pnpm; `package.json` and `pnpm-lock.yaml` were updated.
- Added one `PostHogProvider` in `src/routes/__root.tsx`.
- Initialization reads `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from Vite environment variables, enables exception capture, and uses a development failure / production no-op path when configuration is missing.
- Added the variable names to `.env.example`; the run confirmed both real variables are present in the local `.env`.
- No CSP changes were needed: the review found no shipped CSP in `index.html` or `vite.config.js`.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `login_submitted` | A visitor submits the sign-in form. | `src/routes/login.tsx` |
| `logout_clicked` | A signed-in visitor clicks sign out. | `src/routes/login.tsx` |
| `invoice_create_submitted` | A dashboard user submits a new invoice. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_update_submitted` | A dashboard user submits changes to an invoice, with a non-PII invoice identifier. | `src/routes/dashboard.invoices.$invoiceId.tsx` |

The capture step confirmed each call is in its corresponding action handler. The run did **not** observe events arriving in PostHog, so event delivery remains unconfirmed.

## User identification

Identification was skipped. The demo auth model exposes only a mutable `username`, with no stable user primary key or persisted session identifier. No identifier was invented or sent to PostHog. The unresolved issue is that events remain personless and cannot reliably attribute activity to returning users until a stable identifier is added to the auth/session model. The relevant model is `src/utils/auth.tsx` (the `username` field and `login` shape around lines 3–18), and the login call site is `src/routes/login.tsx:26`.

## Error tracking

Global exception capture is configured through the existing root `PostHogProvider` with `capture_exceptions: true` in `src/routes/__root.tsx`. No duplicate boundary or manual exception handler was added. The run verified the configuration in source, but did not exercise an exception and therefore did not observe an error event arriving in PostHog.

## Dashboard

The starter dashboard is available at [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918366). It contains four tagged insights: authentication activity, invoice creation, invoice updates, and a login-to-invoice-creation funnel. The dashboard and insight definitions were created successfully; they may remain empty until the app sends data.

## Verification and build conflict

- `pnpm install` completed successfully and dependencies were already current.
- `pnpm build` completed Vite production compilation and TypeScript checking successfully.
- The build emits a pre-existing TanStack Router generator diagnostic for `/login`, but still exits successfully. This diagnostic is unrelated to the PostHog changes and was not resolved by the run.
- No automated test suite or runtime event-delivery verification was recorded.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code; the reviewed build passed, but this should be repeated in the target environment (`package.json` build script).
- [ ] Run the test suite; the instrumented handlers may require updated mocks or fixtures (`src/routes/login.tsx`, `src/routes/dashboard.invoices.index.tsx`, `src/routes/dashboard.invoices.$invoiceId.tsx`).
- [ ] Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deploy environment, not only local `.env`, matching `.env.example`.
- [ ] Add a genuine stable user ID to the auth/session model, then wire `identify` on successful login and refresh and `reset` on logout (`src/utils/auth.tsx`, `src/routes/login.tsx:26`).
- [ ] Trigger login, logout, invoice creation, and invoice update in a real browser and confirm the four named events arrive in the PostHog project; the run could not verify delivery.
- [ ] Trigger an uncaught browser exception in a real browser and confirm exception data arrives; the run verified configuration only (`src/routes/__root.tsx`).
