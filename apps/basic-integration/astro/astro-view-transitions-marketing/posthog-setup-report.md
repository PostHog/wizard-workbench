# PostHog setup report

PostHog browser analytics, CTA conversion events, exception autocapture, and a starter dashboard were added to this Astro marketing site.

## What was installed and initialized

- Installed `posthog-js` with npm; `package.json` and `package-lock.json` were updated. No server-side API routes were found, so `posthog-node` was not added.
- Added the reusable client initialization in `src/components/posthog.astro` and included it from `src/layouts/Layout.astro`.
- Initialization reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from Astro environment variables, uses the inline browser bootstrap, enables tracing headers, and keeps default capture behavior.
- `.env.example` documents both public variable names. The configured values are present in `.env` according to the run's environment check; the report does not reproduce secret values.

## Events instrumented

The run defined and wired these browser events. The run did not observe visitors generating them, so delivery and volume remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `trial_started` | Visitor expresses intent to start a free trial from the homepage hero or primary navigation. | `src/pages/index.astro`, `src/components/Navigation.astro` |
| `documentation_opened` | Visitor opens documentation from the homepage hero. | `src/pages/index.astro` |
| `pricing_plan_selected` | Visitor selects a pricing CTA, including enterprise sales-contact intent; properties include the non-PII plan and action values. | `src/pages/pricing.astro` |

CTA handlers bind on initial load and `astro:page-load`, with duplicate-listener guards for Astro view transitions. The event properties are fixed context values and contain no PII.

## Identification

User identification was skipped. This is a static marketing site with no login, registration, logout, session, account state, API route, or stable user identifier. Events are intentionally anonymous/personless. If authentication is added later, identify with a stable user ID after authentication and on known-user refreshes, and reset on logout or account switching; do not use an email or name as the distinct ID.

## Error tracking

`capture_exceptions: true` was added to the centralized `posthog.init()` configuration in `src/components/posthog.astro`. This enables the installed SDK's uncaught-error and unhandled-promise-rejection autocapture. The run did not trigger an application error or observe an exception event arriving in PostHog, so runtime delivery remains unconfirmed.

## Verification and dashboard

- `npm install` completed successfully.
- `npm run build` passed; Astro generated all five static routes successfully.
- No lint or typecheck scripts exist in `package.json`, and no test suite was run or observed.
- The dashboard and three insights were created in PostHog. Fresh insights may remain empty until visitors generate the events: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935556).

## Build conflict

npm reported 12 pre-existing dependency audit vulnerabilities and pending install-script approvals, but installation and the production build succeeded. No build conflict blocked the integration.

## Unresolved issues to follow up

- Event delivery was not established: the run inspected and built the code but did not run the site with a browser visitor or observe `trial_started`, `documentation_opened`, or `pricing_plan_selected` arrive in PostHog. Until verified, the dashboard should be treated as configured but potentially empty.
- Identity attribution is unresolved by design: no stable user ID exists in this application. If authenticated flows are introduced without adding the identify/reset lifecycle, events will remain anonymous and cannot be reliably attributed to accounts.

## Before you merge

- [ ] Run a full production build in the target environment and fix any lint or type errors introduced by the integration; the run verified `npm run build`, but no lint or typecheck scripts exist.
- [ ] Run the test suite, if one is added or available in CI, and update mocks or fixtures for the instrumented CTA handlers.
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from `.env.example` are set in every deploy environment, not only locally; inspect `src/components/posthog.astro` lines 4–5 and the deployment environment configuration.
- [ ] Open the deployed site, click the homepage trial CTA and documentation CTA in `src/pages/index.astro` (lines 13–14), the navigation trial CTA in `src/components/Navigation.astro` (line 15), and each pricing CTA in `src/pages/pricing.astro` (lines 25, 42, and 63), then confirm the three event names arrive in PostHog.
- [ ] Trigger an uncaught error or rejected promise in a safe test environment and confirm exception data arrives, validating `capture_exceptions: true` in `src/components/posthog.astro` (line 28).
