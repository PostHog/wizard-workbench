# PostHog setup report

PostHog browser analytics was installed and initialized for the Astro static marketing site, with four CTA conversion events, browser exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` `^1.408.0` with npm; `package.json` and `package-lock.json` were updated.
- Added one shared inline browser initialization in `src/components/posthog.astro`, rendered from `src/layouts/Layout.astro`.
- Initialization reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, and uses the shared `window.posthog` instance for event capture.
- `.env.example` documents the required variable names. The configured `.env` contains both keys, but deployment environments still need to be configured separately.
- No server-side SDK was added because this project has no server routes or API event handlers.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `get_started_clicked` | A visitor selects the global Get Started call to action. | `src/components/Navigation.astro` |
| `free_trial_started` | A visitor selects a Start Free Trial call to action from the homepage or pricing page. | `src/pages/index.astro`, `src/pages/pricing.astro` |
| `pricing_plan_selected` | A visitor selects a pricing-plan call to action. | `src/pages/pricing.astro` |
| `sales_contact_requested` | A visitor selects the Contact Sales call to action. | `src/pages/pricing.astro` |

The capture step recorded these events and their call sites, but no live browser delivery test observed any event arriving in PostHog. The dashboard insights may therefore be empty until visitors use the instrumented CTAs.

## User identification

Identification was skipped. The site has no login, registration, logout, authenticated session, API route, or user model, so no stable non-PII user identifier exists at an identity boundary. Events are intentionally personless. If authentication is added later, identify users with a stable internal ID after login or registration, and reset on logout; do not use email or display name as the distinct ID.

## Error tracking

Browser exception autocapture was enabled by adding `capture_exceptions: true` to the shared initialization in `src/components/posthog.astro`. No manual error capture or route-specific wrapper was added. The run did not trigger an exception and verify arrival in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926563)

The dashboard contains five tagged `(wizard)` insights covering CTA engagement, free-trial starts, pricing-plan selections by plan, sales interest, and a Get Started-to-free-trial conversion funnel. The dashboard and its five insights were created successfully; their live data was not verified during this run.

## What the run verified

- `npm add posthog-js` and the subsequent `npm install` completed successfully.
- `npm run build` passed before and after the review fix and produced all five static routes.
- The configured environment-key check found `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` present.
- The review found one shared initialization point, the expected CTA capture call sites, and no unnecessary SDK clients or unrelated instrumentation.

## What remains unconfirmed

- No live browser session confirmed that any event or exception reached PostHog.
- No production deployment test confirmed that the public environment variables are available at runtime.
- No authentication attribution can be verified because the application has no identity flow.
- The dashboard definitions exist, but their data population has not been observed.

## Build and dependency notes

No build conflict was reported. The production build passed and no lint or typecheck script is declared in `package.json`. npm reported pre-existing audit vulnerabilities and pending approval for dependency install scripts; these did not block installation or the build and were not introduced or remediated by this integration.

## Before you merge

- [ ] Run a full production build in the target deployment environment and fix any lint or type errors introduced by the generated integration.
- [ ] Run the test suite, if one is added or available; the instrumented call sites may require updated mocks or fixtures.
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` match the exact names in `.env.example` and are configured in every deployment environment, not only local `.env` (`.env.example`; `src/components/posthog.astro`).
- [ ] Open the deployed site, use each instrumented CTA, and confirm `get_started_clicked`, `free_trial_started`, `pricing_plan_selected`, and `sales_contact_requested` arrive in the linked dashboard (`src/components/Navigation.astro`; `src/pages/index.astro`; `src/pages/pricing.astro`).
- [ ] If production error monitoring is required, trigger a controlled browser exception in a safe environment and confirm exception data arrives through `capture_exceptions` (`src/components/posthog.astro`).
