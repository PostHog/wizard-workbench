# PostHog setup report

PostHog product analytics and browser error tracking were added to the client-side TanStack Router app, with a starter dashboard and four instrumented application events.

## Installed and initialized

- Installed `@posthog/react` 1.10.3 with pnpm; `package.json` and `pnpm-lock.yaml` were updated. No server-side SDK was added because this app is client-only.
- `PostHogProvider` is mounted at the code-based TanStack Router root in `src/main.tsx`.
- Initialization reads `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from the environment. The real values are configured locally in `.env`; `.env.example` documents both names.
- In development, missing configuration throws the required variable-specific error. In production, missing configuration leaves the app running without analytics.
- `capture_exceptions: true` is enabled on the provider for global browser exception capture.
- No CSP changes were needed because the project had no Content-Security-Policy configuration.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A user completes the demo sign-in form. | `src/main.tsx` |
| `invoice_created` | A user successfully creates an invoice. | `src/main.tsx` |
| `invoice_updated` | A user successfully saves changes to an invoice. | `src/main.tsx` |
| `user_logged_out` | A signed-in user selects sign out. | `src/main.tsx` |

Captures are placed in the login/sign-out handlers and invoice mutation success callbacks. Event properties do not include usernames, emails, titles, bodies, notes, or other user-entered content; invoice IDs are the only event property recorded for invoice events.

**Verification boundary:** the run verified the capture call sites and the event plan, but did not run a browser delivery test and did not observe events arriving in PostHog. The dashboard may therefore initially be empty.

## User identification

Identification was skipped. The demo authentication flow exposes only a mutable username and no stable immutable account ID, UUID, persisted user identifier, or suitable email-based identity. No `identify()` or `reset()` call was added, so events remain personless until the application supplies a stable authenticated user ID.

### Unresolved follow-up issue

The app currently cannot attribute events to stable users. If left unresolved, login, invoice, and logout activity cannot be reliably connected across sessions or separated when usernames change. A future authentication implementation should identify the stable user exactly once after successful login and on a known persisted session, then reset on logout; the relevant integration surface is `src/main.tsx` around the authentication handlers (currently approximately lines 1105–1181).

## Error tracking

Global exception capture was enabled with `capture_exceptions: true` in the root `PostHogProvider` in `src/main.tsx`. The run verified the configuration in source, but did not observe an exception arrive in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914319)

The dashboard contains four wizard-tagged insights: sign-ins over time, invoice creation activity, invoice updates over time, and an authentication-to-invoice-update funnel. These are configured against the exact event names above and are expected to populate as events arrive.

## Build and review

- `pnpm install` completed successfully with the existing lockfile.
- `pnpm build` completed successfully: Vite built 143 modules and `tsc --noEmit` passed.
- No lint script is defined in `package.json`.
- No runtime browser delivery test was performed.
- Full build conflict: Vite emitted a non-blocking advisory that the generated main bundle exceeds 500 kB after minification. This did not fail the build.

## Before you merge

- [ ] Run the full production build in the deployment environment and fix any lint or type errors introduced by the integration; the build verified during the run was `pnpm build`.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` are set in every deploy environment, not only the local `.env`; the documented names are in `.env.example`.
- [ ] Trigger sign-in, invoice creation, invoice update, and sign-out in a real browser and confirm the corresponding events arrive in PostHog; the run did not verify delivery.
- [ ] If stable authentication identifiers become available, wire `identify()` and `reset()` in the authentication handlers in `src/main.tsx` around lines 1105–1181, and verify returning sessions are identified rather than fragmented into anonymous IDs.
- [ ] If production browser source maps are shipped, configure source-map upload in CI so captured stack traces can be de-minified; the current run did not configure source-map upload.
- [ ] Review the non-blocking Vite bundle-size advisory and decide whether code splitting or manual chunks are needed for the generated main bundle over 500 kB.
