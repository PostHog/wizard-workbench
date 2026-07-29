# PostHog setup report

PostHog was added to the client-side TanStack Router app with a root provider, four product events, exception capture, and a starter dashboard.

## What was installed and initialized

- Installed `@posthog/react` 1.10.3 with pnpm; `package.json` and `pnpm-lock.yaml` were updated.
- Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env` and documented them in `.env.example`.
- Mounted one `PostHogProvider` in `src/routes/__root.tsx`, using `import.meta.env` values and `api_host`. Development throws an explicit missing-configuration error; production renders without analytics when configuration is absent.
- No CSP changes were made. The app is client-side only; no server SDK was added.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `login_succeeded` | A login request completed successfully. | `src/routes/login.tsx` |
| `logout_requested` | A signed-in user explicitly requested logout. | `src/routes/login.tsx` |
| `invoice_created` | An invoice creation mutation completed successfully. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | An invoice update mutation completed successfully. | `src/routes/dashboard.invoices.$invoiceId.tsx` |

The event plan records non-PII invoice IDs and PostHog session information. No event delivery was observed during this run, so these events are instrumented but **not confirmed captured**.

## User identification

Identification was skipped. The demo auth state exposes only a user-entered username and no stable account ID, UUID, primary key, or other valid identifier. The four capture call sites therefore still contain the visible `DISTINCT_ID` placeholder:

- `src/routes/login.tsx:6`, `src/routes/login.tsx:28`, and `src/routes/login.tsx:67`
- `src/routes/dashboard.invoices.index.tsx:9` and `src/routes/dashboard.invoices.index.tsx:23`
- `src/routes/dashboard.invoices.$invoiceId.tsx:9` and `src/routes/dashboard.invoices.$invoiceId.tsx:39`

This is an unresolved identity issue: replacing the placeholder with the username would violate the identity contract, while leaving it means events cannot represent a stable authenticated user. Once authentication exposes a stable `userId`, wire `posthog.identify(userId, personProperties)` after successful login and `posthog.reset()` before logout in `src/routes/login.tsx`.

## Error tracking

Global exception capture was already enabled through `capture_exceptions: true` on the root `PostHogProvider` in `src/routes/__root.tsx`; no additional error-tracking code was required. Error delivery was not exercised or observed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924783) contains four tagged insights: authentication activity, invoice creation, invoice updates, and a login-to-invoice conversion funnel. The insights may remain empty until application events arrive.

## Verification and conflicts

The review step ran `pnpm install` successfully and verified that `pnpm build` passed, including Vite production bundling and `tsc --noEmit`. Vite emitted only its existing bundle-size advisory. No lint or standalone typecheck script exists. No automated browser run, test suite, or event-delivery verification was performed. There was no build conflict reported.

## Before you merge

- [ ] Run the full production build and fix any lint or type errors introduced by the generated integration; the wizard's recorded build passed, but no lint script exists.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only locally.
- [ ] Add a real stable authenticated user ID and wire identification/reset in `src/routes/login.tsx` before relying on user-level analytics; replace every `DISTINCT_ID` placeholder listed above.
- [ ] Exercise login, logout, invoice creation, and invoice update in a real browser and confirm the corresponding events arrive in PostHog; a passing build does not prove event flow.
