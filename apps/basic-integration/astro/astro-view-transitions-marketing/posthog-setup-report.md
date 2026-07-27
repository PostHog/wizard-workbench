# PostHog setup report

PostHog browser analytics, anonymous conversion events, browser error autocapture, and an analytics dashboard were added to this static Astro marketing site.

## Installed and initialized

- Installed `posthog-js` `^1.407.3` with npm; `package.json` and `package-lock.json` were updated. No server-side SDK was added because the project has no API routes or server event-sending code.
- Initialized one browser client in `src/components/posthog.astro`, mounted from `src/layouts/Layout.astro`. It uses `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, keeps default capture behavior, enables tracing headers, and guards initialization across Astro ViewTransitions.
- Added the documented environment names to `.env.example`; the configured public environment keys were present locally during review.

## Events instrumented

The run verified that these capture call sites exist. It did **not** run a browser session or observe events arriving in PostHog, so delivery remains unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `trial_cta_clicked` | A visitor selects a free-trial CTA from the homepage or primary navigation. | `src/pages/index.astro`, `src/components/Navigation.astro` |
| `pricing_plan_selected` | A visitor selects a pricing-plan CTA, including the selected plan and intent. | `src/pages/pricing.astro` |

The trial CTA links are currently placeholders, so the click instrumentation exists but no enrollment destination is implemented in this project.

## Identity

User identification was skipped. The source contains no authentication, account, login, registration, logout, or stable user-state flow. Events intentionally remain anonymous; no `identify()` or `reset()` call was added. If authenticated functionality is added later, identify only with a stable application user ID when identity becomes known, and reset on logout.

## Error tracking

`src/components/posthog.astro` enables PostHog JS exception autocapture for uncaught browser errors and unhandled promise rejections. The initialization guard prevents repeated SDK setup during Astro ViewTransitions. No manually triggered error event was observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1912733) contains four insights for the two instrumented events: a trial CTA trend, pricing-plan breakdown, trial-to-pricing funnel, and pricing-intent breakdown. The insights use the last 30 days and may be empty until events arrive.

## Verification and unresolved issues

- `npm install` completed successfully.
- `npm run build` passed before and after review fixes and generated all five static routes.
- The review confirmed the capture listeners no longer depend on `DOMContentLoaded`, so they can attach correctly after Astro ViewTransitions navigation.
- Environment-key presence was verified locally.
- Event delivery, production deployment configuration, and real-user attribution were not verified.
- npm reported 12 dependency-tree audit findings (2 moderate, 10 high); dependency remediation was outside this integration and was not changed.
- No build conflict was reported.

## Before you merge

- [ ] Run a full production build and address any lint or type errors introduced by the integration; inspect `src/components/posthog.astro`, `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/pages/pricing.astro`, and `src/components/Navigation.astro`.
- [ ] Run the test suite, if one is added or available, and update mocks or fixtures for the capture call sites in `src/pages/index.astro`, `src/pages/pricing.astro`, and `src/components/Navigation.astro`.
- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in each deployment environment, not only local `.env`; use `.env.example` and the initialization in `src/components/posthog.astro` as the naming reference.
- [ ] Load the deployed site and click the homepage/navigation trial CTAs and pricing CTAs, then confirm `trial_cta_clicked` and `pricing_plan_selected` arrive in PostHog; this run did not verify delivery.
- [ ] Decide and implement the real trial/enrollment destinations for the placeholder CTA links before relying on downstream conversion analysis; inspect `src/pages/index.astro`, `src/components/Navigation.astro`, and `src/pages/pricing.astro`.
- [ ] Review the 12 npm audit findings (2 moderate, 10 high) before release; the integration run did not remediate them.
