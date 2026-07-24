# PostHog setup report

PostHog browser analytics was added to this Astro marketing site, with anonymous CTA and documentation interaction tracking, exception autocapture, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-js` with npm; `npm add posthog-js` completed successfully and recorded the dependency in `package.json` and `package-lock.json`.
- Added a single browser initialization in `src/components/posthog.astro`, using the environment-backed `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` values.
- Included that component from `src/layouts/Layout.astro`, so pages using the shared layout receive the client.
- The initialization uses Astro ViewTransitions-safe history-change pageviews and enables `autocaptureExceptions: true`.
- `.env.example` documents the required environment keys; the run verified both keys are configured locally. Deployment configuration was not verified.
- No server SDK was installed because the run found no server/API routes.

## Events instrumented

These are instrumented call sites and event definitions. The run did **not** observe events arriving in PostHog, so capture delivery remains unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `free_trial_cta_clicked` | A visitor selecting a free-trial CTA from the homepage or pricing page. | `src/pages/index.astro`, `src/pages/pricing.astro` |
| `pricing_plan_selected` | A visitor selecting a plan-specific pricing CTA. | `src/pages/pricing.astro` |
| `get_started_cta_clicked` | A visitor selecting the primary Get Started navigation CTA. | `src/components/Navigation.astro` |
| `documentation_topic_selected` | A visitor selecting a documentation topic card. | `src/pages/docs.astro` |

The event calls are intentionally personless. The identify step was skipped because this is a static marketing site with no authentication flow, account state, or stable user identifier. No `identify()` or `reset()` calls were added.

## Error tracking

Global PostHog exception autocapture was enabled in `src/components/posthog.astro` with `autocaptureExceptions: true`, covering uncaught browser exceptions and unhandled promise rejections. No manual exception handlers were added.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1901774)

The dashboard contains four saved insights for CTA clicks over time, pricing interest by plan, documentation topics selected, and a trial-to-plan CTA funnel. They use the instrumented event names and the last 30 days, and will populate as events arrive. The dashboard's existence and configuration were verified; event data was not.

## Verification and limitations

- `npm install` completed with dependencies up to date.
- `npm run build` completed successfully and generated all five static routes. This verifies compilation/build output only; it does not prove that PostHog initialized in a deployed browser or that any event was captured.
- Review found no required fixes, no source Content Security Policy, and no lint or typecheck script defined.
- The run did not perform a browser session or inspect incoming PostHog events, so event delivery, pageview delivery, exception delivery, and production-host behavior remain unconfirmed.

## Build and dependency conflict

npm reported 12 existing audit vulnerabilities and pending approval for dependency install scripts. Neither affected installation or the successful production build. No other build conflict was reported.

## Before you merge

- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deployment environment, not only locally; check `.env.example` and the environment-backed initialization in `src/components/posthog.astro`.
- [ ] Run a full production build and fix any lint or type errors introduced by the integration; verify the generated initialization and layout inclusion in `src/components/posthog.astro` and `src/layouts/Layout.astro`.
- [ ] Run the test suite, if one is added or available, and update mocks/fixtures for the instrumented call sites in `src/pages/index.astro`, `src/pages/pricing.astro`, `src/components/Navigation.astro`, and `src/pages/docs.astro`.
- [ ] In a deployed browser, click each instrumented CTA/topic card and confirm the four documented event names arrive in PostHog; inspect the corresponding call sites in `src/pages/index.astro`, `src/pages/pricing.astro`, `src/components/Navigation.astro`, and `src/pages/docs.astro`.
- [ ] If authentication is introduced later, add stable non-PII `identify()` and logout `reset()` handling at that authentication boundary; the current anonymous behavior is documented by the skipped identify step and has no call-site line to verify.
