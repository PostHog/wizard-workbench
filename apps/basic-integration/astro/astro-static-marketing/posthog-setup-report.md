# PostHog setup report

A browser PostHog integration was added to this static Astro marketing site, with four conversion events, browser exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` at `^1.409.5` using npm; `package.json` and `package-lock.json` were updated.
- Added the shared browser initialization in `src/components/posthog.astro` and mounted it from `src/layouts/Layout.astro`.
- Initialization reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from the environment, enables tracing headers, and enables `capture_exceptions: true`.
- Documented the environment variable names in `.env.example`; the real values were configured locally in `.env` through wizard tooling.
- No server-side SDK was installed because this project has no server/API routes.

## Events instrumented

These events were added at the existing homepage and pricing CTA interactions. The run verified that the call sites and event plan contain these definitions; it did **not** verify that events arrived in PostHog because browser delivery was not exercised.

| Event | What it measures | File |
|---|---|---|
| `free_trial_started` | Visitor selects the primary free-trial call to action from the homepage. | `src/pages/index.astro` |
| `documentation_opened` | Visitor opens the documentation from the homepage call to action. | `src/pages/index.astro` |
| `pricing_plan_selected` | Visitor selects a pricing plan CTA; the selected plan is captured in the non-PII `plan` property. | `src/pages/pricing.astro` |
| `sales_contact_requested` | Visitor selects the enterprise contact-sales call to action. | `src/pages/pricing.astro` |

The CTA destinations remain placeholder `#` links, as recorded by the capture step. Events are intentionally personless because the application has no authentication flow or stable user identifier.

## User identification

Identification was skipped. Review of the complete source tree found no login, registration, logout, session storage, API route, or stable user ID. No `identify()` or `reset()` calls were added. If authentication is introduced later, wire `window.posthog.identify()` using a stable non-PII user ID after authentication and restore it for authenticated returning visitors; call `window.posthog.reset()` on logout or account switching.

## Error tracking

Global browser exception autocapture was enabled in `src/components/posthog.astro` through `capture_exceptions: true`; the inline SDK stub also exposes `captureException`. This is configured to feed PostHog Error Tracking. The run did not start the app or observe an exception arriving in PostHog.

## Dashboard

Created `Analytics basics (wizard)` with four tagged trend insights covering the instrumented events over a 30-day range. Dashboard ID: `1935562`.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1935562)

The dashboard and insights were created successfully in PostHog, but the run did not confirm incoming event data; empty results are expected until traffic reaches the instrumented interactions.

## Verification and conflicts

- `npm install` completed successfully.
- `npm run build` passed after review, producing all five static Astro routes.
- No standalone lint or typecheck command exists in the package scripts.
- Browser delivery was not exercised, so event capture and exception delivery remain unconfirmed.
- npm reported 12 existing audit vulnerabilities and pending optional install-script approvals. These were not caused by this integration and did not prevent installation or the build.
- No build conflict was reported by any step.
- No Content-Security-Policy is shipped by this project, so CSP delivery could not be tested or required changes identified.

## Next steps

1. Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deployment environment, not only the local `.env`; keep the exact names documented in `.env.example`.
2. Exercise each CTA in a deployed browser and confirm the four event names appear in PostHog with the expected `plan` values.
3. Trigger a test browser exception in a safe environment and confirm it appears in PostHog Error Tracking.
4. Replace the placeholder CTA destinations with real product and documentation routes when available, then re-check that the listeners remain attached to the intended interactions.
5. Run the full production build and test suite before merging; update mocks or fixtures if the instrumented call sites require them.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated integration; the wizard verified `npm run build` but not every deployment configuration. (`package.json` scripts; `src/components/posthog.astro`)
- [ ] Run the test suite, if one is added or available in CI, and update mocks or fixtures for the new CTA capture calls. (`src/pages/index.astro`, `src/pages/pricing.astro`)
- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in deployment environments, not just locally, matching `.env.example`. (`.env.example`, `src/components/posthog.astro`)
- [ ] Deploy or preview the site, click each instrumented CTA, and confirm the events arrive in PostHog; the build alone does not prove delivery. (`src/pages/index.astro`, `src/pages/pricing.astro`)
- [ ] Trigger a controlled browser exception and confirm Error Tracking receives it; configuration is present but runtime delivery was not observed. (`src/components/posthog.astro`)
