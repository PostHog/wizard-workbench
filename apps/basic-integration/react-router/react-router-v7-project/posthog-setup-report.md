# PostHog setup report

PostHog product analytics, user identification, error tracking, and a starter dashboard were added to this React Router v7 application.

## Installed and initialized

- Installed `posthog-js` at `^1.407.5` in `package.json`; `package-lock.json` was updated.
- Added the browser-only singleton in `app/lib/posthog.client.ts`, initialized once from `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`, with default capture behavior preserved.
- Imported the singleton from `app/entry.client.tsx` and used dynamic browser-only imports from route, auth, and root modules to keep it out of the SSR graph.
- Added the required variable names to `.env.example`; the real values were configured in `.env` during the run.
- No server SDK was added because no server-side event sender was present.
- No CSP changes were needed because the run found no shipped Content-Security-Policy.

## Instrumented events

These are the seven planned event names recorded in `.posthog-wizard-cache/.posthog-events.json`:

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | An existing account successfully logs in. | `app/routes/login.tsx` |
| `login_failed` | A login submission does not match an existing account. | `app/routes/login.tsx` |
| `user_signed_up` | A new account is created successfully. | `app/routes/signup.tsx` |
| `user_logged_out` | An authenticated user explicitly logs out. | `app/routes/profile.tsx` |
| `country_claimed` | An authenticated user claims an unclaimed country. | `app/routes/countries.tsx` |
| `country_liked` | An authenticated user adds a country to favorites. | `app/routes/countries.tsx` |
| `country_visited` | An authenticated user marks a country as virtually visited. | `app/routes/countries.tsx` |

Country events carry only `country_code` and `country_region`; email and username are not sent as event properties. Default autocapture covers navigation and page-load behavior, so no additional pageview events were added.

## Identity and error tracking

User identification **was wired** in `app/context/AuthContext.tsx`. The stable `FakeUser.id` is used on successful login, signup, and persisted-session restoration; email and username are person properties. Logout calls `posthog.reset()` before clearing local authentication state. Failed login remains personless because no stable account identity exists at that point.

Unhandled non-response application errors are sent with `posthog.captureException(error)` from the root error boundary in `app/root.tsx`. Route response errors such as 404s remain presentation-only.

## Dashboard

[Open the Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1918324). It contains four saved insights covering authentication activity, country engagement by region, signup-to-country-claim conversion, and country action volume. The dashboard and insight definitions were created successfully, but the run did **not** observe events arriving from a running browser session; the dashboard may initially contain no event data.

## What the run verified

- `npm install` completed successfully.
- `npm run typecheck` passed.
- `npm run build` passed and produced client and SSR bundles.
- The configured PostHog environment keys were present.
- Source review found exactly seven new `posthog.capture` calls, all in action handlers, plus root exception capture.

A passing build and source review prove compilation and wiring only. They do not prove that events were delivered to PostHog. No production browser flow or ingestion check was run, so event delivery, dashboard population, and exception arrival remain unconfirmed.

## Build conflicts and warnings

Non-blocking tool output reported npm audit vulnerabilities and stale Browserslist data during the successful verification run. Neither was attributed to the PostHog integration. No PostHog-specific build conflict was reported.

## Next steps

1. Configure `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deployment environment, not only the local `.env`; keep the names aligned with `.env.example`.
2. Run the app in a real browser and exercise login success/failure, signup, logout, and the three country actions; then confirm the seven named events arrive in PostHog with the expected identity and country properties.
3. Trigger a representative uncaught application error and confirm it appears in PostHog error tracking.
4. Review the dashboard after ingestion and validate that its four insights contain data.
5. Run the test suite and address any mocks or fixtures affected by the new client calls. No lint script exists in `package.json`.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the instrumentation; the wizard verified `npm run build` and `npm run typecheck`, but did not validate every deployment configuration.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` are present in `.env.example` and configured in deployment environments, not just locally; review `app/lib/posthog.client.ts:3-4` and `.env.example`.
- [ ] Because auth identification is wired, verify the returning-session path identifies the restored user after refresh; review `app/context/AuthContext.tsx:34-39`.
- [ ] Exercise the browser flows and confirm event delivery; inspect the capture handlers in `app/routes/login.tsx:26-31`, `app/routes/signup.tsx:28`, `app/routes/profile.tsx:17`, and `app/routes/countries.tsx:144-192`.
- [ ] Trigger an uncaught application error and confirm error tracking; review `app/root.tsx:61`.
