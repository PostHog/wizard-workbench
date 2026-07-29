# PostHog setup report

PostHog browser analytics, conversion-intent events, exception autocapture, and a starter dashboard were added to the Astro marketing site.

## What was installed and initialized

- Installed `posthog-js` `^1.408.0` in `package.json`; `package-lock.json` resolves version `1.408.0`.
- Added `src/components/posthog.astro`, mounted globally from `src/layouts/Layout.astro`.
- Initialization uses the public Astro environment variables `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, the inline PostHog browser snippet, SDK defaults, and `tracing_headers`.
- Exception autocapture is enabled with `capture_exceptions: true`.
- The configured environment keys were written to the local `.env`; `.env.example` documents the required key names.
- No server-side SDK was installed because this project has no API routes.

## Events instrumented

These events are wired at click handlers. The run did not perform a production delivery test, so arrival in PostHog is **unconfirmed**.

| Event | What it measures | File |
|---|---|---|
| `free_trial_started` | A visitor selects the primary free-trial CTA in the homepage hero. | `src/pages/index.astro:66-70` |
| `pricing_plan_selected` | A visitor selects a Starter, Pro, or Enterprise pricing-plan CTA; the selected plan is included. | `src/pages/pricing.astro:69-73` |
| `navigation_cta_clicked` | A visitor selects the persistent Get Started navigation CTA. | `src/components/Navigation.astro:21-25` |

The CTA destinations remain existing `#` placeholders, so these events measure intent rather than completed signup, checkout, or contact actions.

## Identity and error tracking

User identification was skipped. The site is a static marketing application with no login, registration, logout, auth state, user model, or stable identity source. Events therefore remain anonymous; no `identify()` or `reset()` flow was added.

Global browser exception autocapture was enabled in `src/components/posthog.astro:17` with `capture_exceptions: true`. The run did not observe an exception arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926559)

The dashboard contains four insights: free-trial intent trend, pricing-plan interest by plan, navigation CTA trend, and a navigation-to-pricing-to-trial funnel. It is expected to remain empty until events arrive; the run did not verify event delivery.

## Verification and conflicts

- `npm install` completed with dependencies up to date.
- `npm run build` completed successfully and built all five static pages with no errors.
- No separate typecheck or lint scripts exist in `package.json`.
- No production delivery test was performed, so event capture and exception delivery remain unconfirmed.
- Build conflict: npm reported 12 existing audit vulnerabilities and pending install-script approval warnings for `core-js`, `esbuild`, and `sharp`. These were unrelated to the PostHog integration and did not block the build.
- No Content-Security-Policy was found under `src`, so no CSP delivery check was applicable.

## Next steps

1. Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deployment environment, not only the local `.env`; keep the names documented in `.env.example`.
2. Exercise each CTA in a deployed or preview build and confirm `free_trial_started`, `pricing_plan_selected`, and `navigation_cta_clicked` arrive in PostHog.
3. Confirm the four dashboard insights populate after events arrive.
4. If authentication is added later, identify users with a stable non-PII user ID after login and on refresh, and reset on logout or account switch.
5. Run the project's test suite before merging; instrumented handlers may require updated mocks or fixtures.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the wizard verified `npm run build` only.
- [ ] Run the test suite and update mocks or fixtures for the instrumented click handlers if needed.
- [ ] Verify `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` are configured in deployment environments, not just local `.env`; check `.env.example:1-2` and `src/components/posthog.astro:2-3`.
- [ ] Trigger each CTA and confirm the three events arrive in PostHog; inspect `src/pages/index.astro:66-70`, `src/pages/pricing.astro:69-73`, and `src/components/Navigation.astro:21-25` if any event is missing.
- [ ] Confirm the dashboard populates: https://us.posthog.com/project/483112/dashboard/1926559
