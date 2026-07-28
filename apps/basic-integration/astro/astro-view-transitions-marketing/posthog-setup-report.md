# PostHog setup report

PostHog client-side analytics, conversion-intent tracking, exception autocapture, and a starter dashboard were added to this static Astro marketing site.

## What was set up

- Installed `posthog-js` `^1.407.5` with npm; `package.json` and `package-lock.json` were updated.
- Added shared browser initialization in `src/components/posthog.astro`, mounted globally through `src/layouts/Layout.astro`.
- Initialization reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, documented in `.env.example` and configured locally in `.env`. Development reports missing configuration; production remains a no-op.
- Default capture behavior remains enabled. The initializer includes pageview/pageleave capture, tracing headers, and `capture_exceptions: true` for uncaught browser exception autocapture.
- No server SDK or API routes were added because this project has no server-side tracking surface.

## Events instrumented

These are the events wired in source. The run did **not** perform a browser delivery test, so none are reported as observed arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `get_started_clicked` | A visitor clicks the primary navigation call to action to begin onboarding. | `src/components/Navigation.astro` |
| `free_trial_clicked` | A visitor expresses trial intent from the homepage hero. | `src/pages/index.astro` |
| `pricing_plan_selected` | A visitor selects a pricing-plan call to action, with the selected plan as context. | `src/pages/pricing.astro` |

The custom events are intentionally personless: the site has no authentication, user/session state, or stable user identifier. Event properties are limited to CTA context (`placement` or `plan`), not PII.

## User identification

Identification was skipped. Review found no authentication or stable identity source, so adding `identify()` would have required inventing an identity. If authentication is added later, identify with a stable non-PII user ID after login and on authenticated refresh, and call `reset()` on logout or direct account switching.

## Error tracking

Browser exception autocapture was enabled globally in `src/components/posthog.astro` with `capture_exceptions: true`; the bootstrap stub also exposes `captureException`. No runtime error was deliberately triggered, so delivery of an error event was not confirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918768)

The dashboard contains three tagged insights for CTA clicks over time, pricing selections broken down by `plan`, and an ordered marketing CTA funnel. It was created from the event definitions and may initially be empty; the run did not wait for observed event data.

## What the run verified

- `npm install` completed successfully.
- `npm run build` completed successfully and Astro statically generated all five routes.
- The review found the shared initialization mounted globally, the event markers and captures present, the configured environment keys present, and no project CSP that required changes.
- No lint or typecheck script exists in `package.json`.

## What the run did not verify

- No browser startup or runtime delivery test was performed. A passing build proves compilation and mounting, not that PostHog events or exception reports reach the service.
- No event was observed arriving in PostHog.
- No authenticated identity flow exists to test.

## Build conflicts and warnings

No build conflict occurred: `npm install` and `npm run build` both passed. `npm install` reported 12 dependency-audit vulnerabilities and pending install-script approvals for existing transitive packages; these were not changed because they were outside this integration's scope.

## Before you merge

- [ ] Run the production build again in the deployment environment and fix any lint or type errors introduced by the integration; this project has no lint or typecheck script, and the wizard's successful build only verifies the checked-in build path.
- [ ] Run the test suite, if one is added or available in CI; the project currently exposes no test script, and instrumented call sites may need mocks or fixtures.
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only local `.env`; inspect `src/components/posthog.astro` lines 2–3 for the exact names.
- [ ] Load the deployed site in a real browser, click the navigation CTA in `src/components/Navigation.astro` line 22, the homepage hero CTA in `src/pages/index.astro` line 67, and pricing CTAs in `src/pages/pricing.astro` line 70, then confirm the three events arrive in project 483112.
- [ ] If authentication is introduced, add stable-ID identification and logout reset at those auth boundaries before relying on person-level attribution; no current file can be tested for this because authentication is absent.
