# PostHog setup report

PostHog was installed and initialized for this static Astro marketing site, with three CTA-intent events, global browser error autocapture, and a starter dashboard.

## What was set up

- Installed `posthog-js` at `^1.407.5`; no server-side SDK was added because the project has no API or server source files.
- Added the reusable browser initialization component at `src/components/posthog.astro`, mounted globally through `src/layouts/Layout.astro`.
- Initialization reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`. Missing configuration is a development error and a production no-op. The names are documented in `.env.example` and were configured locally in `.env`.
- Error tracking uses the SDK's global exception autocapture for uncaught browser errors and unhandled promise rejections.
- No user identification was wired: this codebase has no login, registration, session, authenticated user model, or stable user identifier.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `free_trial_cta_clicked` | A visitor clicks the hero call to action intended to begin a free trial; includes the CTA location. | `src/pages/index.astro` |
| `pricing_plan_selected` | A visitor selects a pricing-plan or sales-contact CTA; includes the selected plan. | `src/pages/pricing.astro` |
| `get_started_cta_clicked` | A visitor clicks the primary Get Started navigation CTA; includes the CTA location. | `src/components/Navigation.astro` |

These events measure expressed conversion interest, not a completed trial, signup, sales contact, or documentation action. The run did not observe events arriving in PostHog, so event delivery remains unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918193)

The dashboard contains four wizard-tagged insights covering CTA clicks over time, free-trial CTA clicks by location, pricing-plan interest by plan, and a three-step marketing CTA journey funnel. The insights were created for the last 30 days and are expected to remain empty until events arrive.

## Verification and unresolved items

### Verified by the run

- `npm install` completed with dependencies current.
- `npm run build` completed successfully and generated all five static routes.
- Review confirmed one global initialization point, preserved event names and properties, environment guards, and no project CSP configuration.
- No lint or typecheck script exists in `package.json`, and no tests were run.

### Not verified by the run

- No browser or production-like smoke test observed the SDK initialize or any event reach PostHog.
- Error tracking was configured but no exception or rejected promise was observed arriving in PostHog.
- Authentication attribution was not established because no authentication exists; events are intentionally personless.
- No server-side tracking was verified or added. No build conflict was reported.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; review the initialization and event call sites in `src/components/posthog.astro`, `src/components/Navigation.astro`, `src/pages/index.astro`, and `src/pages/pricing.astro`.
- [ ] Run the test suite, if one is added or supplied by the deployment project, and update mocks or fixtures for the three new capture call sites in `src/components/Navigation.astro`, `src/pages/index.astro`, and `src/pages/pricing.astro`.
- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deploy environment, not only local `.env`; verify the names documented in `.env.example` and the initialization in `src/components/posthog.astro`.
- [ ] Load the deployed site and click each instrumented CTA, then confirm the three event names and their properties arrive in PostHog; the run itself did not observe delivery.
- [ ] If authentication or accounts are introduced later, add stable-ID identification on login and returning authenticated page load, plus reset on logout; no such path exists in the current codebase.
