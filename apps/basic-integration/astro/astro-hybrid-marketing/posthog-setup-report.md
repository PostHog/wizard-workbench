# PostHog setup report

PostHog browser analytics, anonymous marketing-event capture, client exception tracking, and a starter dashboard were added to the Astro hybrid marketing site.

## Installed and initialized

- Installed `posthog-js` (`^1.408.0`) and `posthog-node` (`^5.46.1`) with npm; `package.json` and `package-lock.json` were updated. `posthog-node` is installed but not used because no server-side event was added.
- Created `src/components/posthog.astro`, which reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, guards missing configuration, loads the browser SDK, initializes it globally, and enables `tracing_headers` and `capture_exceptions: true`.
- Mounted the component from `src/layouts/Layout.astro`, making the browser client available to pages using the shared layout.
- Documented the required keys in `.env.example`; both keys were confirmed present in the local `.env`. Deployment environments still need their own configuration.
- No CSP changes were needed because the source contains no Content-Security-Policy.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `free_trial_cta_clicked` | A visitor clicks the home-page Start Free Trial call to action. | `src/pages/index.astro` |
| `pricing_plan_selected` | A visitor selects a pricing-plan call to action; the event includes the non-PII plan property. | `src/pages/pricing.astro` |
| `get_started_cta_clicked` | A visitor clicks the primary Get Started navigation call to action. | `src/components/Navigation.astro` |
| `contact_form_submitted` | A valid contact form submission is accepted by the API; the event includes the selected non-PII interest property. | `src/pages/contact.astro` |

All four captures are anonymous browser events by design. Contact free text and contact PII are not event properties, and the contact API was not separately instrumented to avoid duplicate submissions.

## Identity

User identification was skipped. Review found no authentication flow, user/session model, login, registration, logout, or stable user identifier in this unauthenticated marketing site. No `identify` or `reset` calls were added, and no placeholder distinct ID is present.

## Error tracking

Global PostHog browser initialization enables SDK-managed exception autocapture with `capture_exceptions: true` in `src/components/posthog.astro`. This is intended to feed uncaught client exceptions to PostHog Error Tracking. Server-side exception handling was not added.

## Dashboard

[Open Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926560)

The dashboard contains four insights covering marketing events over time, pricing-plan selections by plan, a free-trial-to-contact funnel, and a Get Started-to-contact funnel. The dashboard and insights were created successfully, but this run did not observe events arriving in PostHog, so their data population is unconfirmed.

## Verification and unresolved issues

- Verified: `npm run build` completed successfully; Astro built the server and client assets and prerendered all five static routes without errors.
- Verified: the configured public environment keys are present locally, and the source review found exactly four planned capture callsites.
- Not verified: event delivery, browser SDK loading in a deployed environment, actual exception arrival in PostHog, or dashboard data population. The review explicitly noted that delivery could not be exercised here.
- No build conflict was reported. No separate lint or typecheck script exists in `package.json`.
- Follow-up issue — attribution remains intentionally unresolved: without an authenticated stable identifier, events and errors cannot be attributed to known users. If an auth model is introduced later, adding identification at that real boundary will be necessary for user-level attribution.

## Next steps

1. Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deployment environment, matching the names documented in `.env.example`.
2. Deploy or run the site in a browser and exercise each CTA and a successful contact submission; confirm the four named events arrive in PostHog and populate the dashboard.
3. Trigger a controlled client exception in a non-production environment and confirm it appears in PostHog Error Tracking.
4. If authentication is introduced, use its stable non-PII user ID with `identify` and reset identity at logout; do not use email or names as event properties.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced at `src/components/posthog.astro`, `src/layouts/Layout.astro`, `src/components/Navigation.astro`, `src/pages/index.astro`, `src/pages/pricing.astro`, or `src/pages/contact.astro` (the recorded build passed, but no lint/typecheck script was available).
- [ ] Run the project test suite, if one is added or available, and update mocks or fixtures for the capture callsites in `src/components/Navigation.astro`, `src/pages/index.astro`, `src/pages/pricing.astro`, and `src/pages/contact.astro`.
- [ ] Configure `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in deployment environments, not only `.env`; check the initialization reads in `src/components/posthog.astro` and the names in `.env.example`.
- [ ] Exercise the four instrumented callsites in a deployed browser and confirm delivery; the recorded run verified compilation only, not event flow.
