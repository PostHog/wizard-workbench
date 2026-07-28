# PostHog setup report

PostHog was added to the client-side file-based TanStack Router app with four product events, global exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed `@posthog/react` `^1.10.3` with pnpm; the lockfile was updated and no server-side package was added.
- Initialized `PostHogProvider` in `src/routes/__root.tsx`, wrapping the application and reading `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from the environment.
- Enabled `capture_exceptions: true`; default capture behavior was left enabled.
- Added the environment variable names to `.env.example`. The run confirmed both real keys are present in the local `.env`.
- No Content-Security-Policy was present, so no CSP changes were needed.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A user completes the demo sign-in flow. | `src/routes/login.tsx` |
| `user_logged_out` | A signed-in user explicitly signs out. | `src/routes/login.tsx` |
| `invoice_created` | A new invoice is created successfully. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | An existing invoice is updated successfully. | `src/routes/dashboard.invoices.$invoiceId.tsx` |

Captures are placed in submit, click, or successful mutation handlers rather than render effects. Event properties intentionally omit usernames, entered invoice text, and other PII. The run verified instrumentation in source code, but did **not** observe events arriving in PostHog; event delivery remains unconfirmed.

## User identification

Identification was skipped. The demo auth state exposes only a mutable username and no stable user ID, UUID, resource identifier, or authentic email. No placeholder distinct ID was introduced. As a result, the four events are intentionally personless. When authentication exposes a stable client-side account ID, add `identify(stableUserId, personProperties)` on successful login and persisted-session restoration, and `reset()` in every logout handler.

## Error tracking

Global exception autocapture is enabled through `capture_exceptions: true` on the application-wide provider in `src/routes/__root.tsx`. No manual error capture or component boundary was added. The run verified the configuration in source; it did not verify an exception arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914328)

The dashboard contains four saved wizard-tagged insights covering login activity, invoice creation, invoice updates, and login-to-invoice-creation conversion. It is expected to populate as events arrive; population was not verified during this run.

## Build and review status

The review handoff reports a successful production build: Vite built 183 modules and `tsc --noEmit` passed. The only build output was a non-failing chunk-size warning. `pnpm install` was successful and current, but warned that `core-js` and `esbuild` build scripts are unapproved. No lint script exists, so lint was not run. Two integration-adjacent fixes were required during review: Vite client environment typings in `tsconfig.json` and restoration of the TanStack Router generator-compatible inline route configuration in `src/routes/login.tsx`. No unresolved build conflict was reported.

## Unresolved issue to follow up

- **Stable attribution is unresolved:** `src/routes/login.tsx` and the invoice capture files `src/routes/dashboard.invoices.index.tsx` and `src/routes/dashboard.invoices.$invoiceId.tsx` currently emit events without a stable identified user because the demo auth model has no stable ID. If left unresolved, person-level funnels and account attribution will remain fragmented or unavailable. Do not replace this with the mutable username; expose a real stable account identifier first.

## Before you merge

- [ ] Run a full production build in the target environment and fix any lint or type errors introduced by the integration; the wizard verified `pnpm build` successfully, but deployment configuration still needs confirmation.
- [ ] Run the test suite; instrumented handlers may require updated mocks or fixtures. No test suite was run during this setup.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `.env.example` are configured in every deploy environment, not only local `.env`.
- [ ] Trigger login, logout, invoice creation, and invoice update in a real browser session and confirm the corresponding events arrive in PostHog; the run did not observe delivery.
- [ ] When a stable auth ID becomes available, wire `identify()` and `reset()` in the authentication boundary and verify returning sessions retain identity; currently no valid ID exists to use.
