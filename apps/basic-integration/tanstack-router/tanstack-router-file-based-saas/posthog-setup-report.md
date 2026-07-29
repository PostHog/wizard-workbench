# PostHog setup report

PostHog product analytics, exception capture, four application event captures, and a starter dashboard were added to the client-side TanStack Router app.

## Installed and initialized

- Installed `@posthog/react` 1.10.3 with pnpm; no server-side SDK was added because this is a client-only app.
- `PostHogProvider` was added at the root in `src/routes/__root.tsx`. It reads `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from Vite environment variables, enables `capture_exceptions: true`, and enables debug logging in development.
- Missing configuration fails loudly in development and uses a production no-op fallback. The real values were configured in `.env` through wizard tooling; `.env.example` documents the variable names.
- No CSP changes were needed: review found no CSP in `index.html` or the Vite configuration.

## Events instrumented

These are planned and instrumented captures. The run did **not** observe events arriving in PostHog, so delivery and persistence remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | A visitor successfully submits the demo sign-in form. | `src/routes/login.tsx` (line 26) |
| `user_signed_out` | A signed-in visitor explicitly signs out from the demo account. | `src/routes/login.tsx` (line 62) |
| `invoice_created` | A visitor submits the create-invoice form. | `src/routes/dashboard.invoices.index.tsx` (line 41) |
| `invoice_updated` | A visitor submits changes to an existing invoice; the event includes bounded `invoice_id`. | `src/routes/dashboard.invoices.$invoiceId.tsx` (line 100) |

Captures are intentionally personless. The invoice update includes only the non-PII invoice identifier; no username, email, or other user-entered identity is sent as an event property.

## Identity status and unresolved issue

User identification was **skipped**. The demo auth model exposes only `username`, with no stable primary key, UUID, resource identifier, or email. The run did not invent a distinct ID, so these captures cannot currently be tied to a stable authenticated person.

**Follow-up issue:** when authentication supplies a stable `userId`, wire `usePostHog().identify(userId, { username })` in the successful sign-in handler and `posthog.reset()` on sign-out. The unresolved attribution costs person-level journey analysis and means current events remain anonymous/personless. The relevant future call sites are `src/routes/login.tsx:26` and `src/routes/login.tsx:62`; do not replace the missing stable ID with the username.

## Error tracking

The existing root provider in `src/routes/__root.tsx` already sets `options.capture_exceptions: true`, enabling the SDK's global exception autocapture. No manual exception calls or route-specific wrappers were added. The run verified the configuration is present, but did not observe an exception event arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926662) contains three saved insights:

- Authentication activity trend (`user_signed_in`, `user_signed_out`)
- Invoice lifecycle activity trend (`invoice_created`, `invoice_updated`)
- Sign-in to invoice creation funnel (`user_signed_in` → `invoice_created`)

The dashboard and insight definitions were created successfully. They will populate as events arrive; the run did not verify populated data.

## Build and verification

- `pnpm install` completed successfully and the lockfile was up to date.
- `pnpm build` completed Vite bundling (167 modules transformed), emitted production files, and completed TypeScript checking after adding `"types": ["vite/client"]` to `tsconfig.json`.
- No tests or lint run was recorded.
- The build printed a non-fatal existing TanStack router-generator diagnostic in full: `expected identifier to be present in /login for export Route`. Vite and TypeScript still completed; the review treated this as pre-existing, but it remains a build output conflict to resolve or confirm independently.

## Before you merge

- [ ] Run the full production build and fix any lint or type errors introduced by the generated integration; inspect `src/routes/__root.tsx`, `src/routes/login.tsx`, `src/routes/dashboard.invoices.index.tsx`, `src/routes/dashboard.invoices.$invoiceId.tsx`, and `tsconfig.json`.
- [ ] Run the test suite and update mocks or fixtures for the new `usePostHog()` calls; focus on the handlers in `src/routes/login.tsx`, `src/routes/dashboard.invoices.index.tsx`, and `src/routes/dashboard.invoices.$invoiceId.tsx`.
- [ ] Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`; verify the exact names in `.env.example`.
- [ ] Resolve or independently confirm the non-fatal TanStack router-generator diagnostic `expected identifier to be present in /login for export Route`, associated with `src/routes/login.tsx`.
- [ ] Trigger sign-in, sign-out, invoice creation, and invoice update in a real browser session and confirm the four named events arrive in PostHog; also trigger an uncaught exception to verify exception delivery.
- [ ] Before relying on person-level attribution, expose a stable authenticated `userId` and wire identify/reset at the sign-in and sign-out handlers in `src/routes/login.tsx`.
