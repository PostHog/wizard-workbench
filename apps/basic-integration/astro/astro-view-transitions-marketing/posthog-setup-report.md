# PostHog setup report

PostHog browser analytics, conversion-intent tracking, exception autocapture, and a starter dashboard were added to this Astro marketing site.

## Installed and initialized

- Installed `posthog-js` with npm; the dependency was resolved into `package.json` and `package-lock.json`.
- No `posthog-node` package was added because the run found no API routes or other server-side event-sending code.
- Added `src/components/posthog.astro` with an Astro `is:inline` browser script. It reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from `import.meta.env`, initializes the shared `window.posthog` client, enables history-change pageviews, and guards against Astro View Transitions re-execution.
- Mounted that component globally through `src/layouts/Layout.astro`.
- Added the real environment values to local `.env` through the wizard environment tool and documented the variable names in `.env.example`.
- In development, missing configuration now raises an explicit error; production remains a no-op when configuration is absent.

## Events instrumented

These events were added as click-intent signals. The run did not observe events arriving in PostHog, so these are **instrumented but unconfirmed**. Current CTA destinations use `href="#"`; they do not represent completed signup, checkout, or sales submissions.

| Event | What it measures | File |
|---|---|---|
| `trial_cta_clicked` | A visitor selects a call to start a free trial from the home or pricing page. | `src/pages/index.astro`, `src/pages/pricing.astro` |
| `plan_get_started_clicked` | A visitor selects the Starter plan get-started call to action. | `src/pages/pricing.astro` |
| `contact_sales_clicked` | A visitor selects the Enterprise contact-sales call to action. | `src/pages/pricing.astro` |
| `get_started_cta_clicked` | A visitor selects the global navigation get-started call to action. | `src/components/Navigation.astro` |

Capture properties are limited to non-PII context (`placement` and `plan` where applicable). The event plan is recorded in `.posthog-wizard-cache/.posthog-events.json`.

## User identification

Identification was skipped. This is a client-only static marketing site with no login, registration, logout, account state, backend API, or stable user identifier. The conversion events are intentionally personless; no `DISTINCT_ID` placeholder was introduced. If authentication is added later, identify with the stable non-PII user ID after login and on returning authenticated page loads, and call `window.posthog.reset()` on logout or account switching.

## Error tracking

Global browser exception tracking was added in `src/components/posthog.astro` with `autocaptureExceptions: true`; the SDK's exception-capture support is exposed. The configuration is intended to report uncaught browser exceptions and unhandled promise rejections. No observed exception event was recorded during this run.

## Dashboard

Created `Analytics basics (wizard)` in PostHog project 483112 with four tagged insights: CTA clicks over time, trial interest by placement, pricing intent by plan, and a trial-to-sales intent funnel. The dashboard uses the exact event names above and is configured for the last 30 days. Empty current results are acceptable because event delivery was not observed during the run.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1902559)

## Verification and conflicts

- `npm install` completed successfully and resolved the declared SDK dependency.
- `npm run build` completed successfully and built all five static routes.
- No separate typecheck or lint scripts are defined in `package.json`.
- The run confirmed environment keys are present locally and reviewed the instrumented call sites and event contract.
- The run did **not** verify events arriving in PostHog, production deployment configuration, or browser runtime delivery.
- npm reported 12 audit vulnerabilities and pending install-script approvals for existing dependencies. Installation and the production build still succeeded; these dependency warnings remain unresolved and should be reviewed independently.

## Follow-up issues

1. **Event delivery is unresolved:** no browser session or PostHog arrival was observed, so event flow and exception delivery remain unconfirmed. Leaving this unresolved means the dashboard may stay empty even though the code builds.
2. **CTA completion attribution is unresolved:** the instrumented links currently point to `#`, so the events measure intent only. Leaving this unresolved means the dashboard cannot distinguish interest from completed trial, checkout, or sales outcomes.
3. **Identity is intentionally unavailable:** no stable user identifier exists in this site. Leaving this unchanged is appropriate for the current anonymous marketing site; if authenticated flows are introduced without adding identity wiring, users will remain fragmented across anonymous IDs.

## Next steps

1. Configure `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`.
2. Exercise each CTA in a real browser session and confirm the four named events arrive in PostHog; then verify the dashboard tiles populate.
3. Replace placeholder CTA destinations with real flows and add completion events in those handlers if conversion measurement is required.
4. If authentication is introduced, define a stable non-PII user ID contract and add identify/reset behavior at the auth boundaries.
5. Review the npm audit vulnerabilities and pending install-script approvals before release.

## Before you merge

- [ ] Run a full production build in the deployment environment and fix any lint or type errors introduced by the integration.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` match `.env.example` and are set in every deploy environment.
- [ ] Exercise the instrumented CTAs in a real browser and confirm the events arrive in PostHog; a passing build alone does not prove event delivery.
