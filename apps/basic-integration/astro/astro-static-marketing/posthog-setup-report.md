# PostHog setup report

PostHog browser analytics, CTA event instrumentation, exception autocapture, and a starter dashboard were added to this Astro static marketing site.

## Installed and initialized

- Installed `posthog-js` (`^1.407.2`) using npm; `package.json` and `package-lock.json` were updated.
- Added reusable initialization in `src/components/posthog.astro` and included it from `src/layouts/Layout.astro`.
- Initialization reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from Astro environment variables. Development builds fail loudly when either is missing; production remains a no-op when configuration is absent.
- The initialization uses the inline browser snippet and enables `autocaptureExceptions: true`.
- The configured environment check verified that both required variables are present locally. Deploy environments still need their own configuration.
- No server-side SDK was installed because the project has no API routes or server-side event handlers.

## Events instrumented

These events are wired to browser CTA click interactions. The run did **not** observe events arriving in PostHog, so delivery and event counts remain unconfirmed. The linked destinations are currently `#` placeholders; these events measure CTA intent rather than completed signup, trial, or sales outcomes.

| Event | What it measures | File |
|---|---|---|
| `free_trial_started` | Visitor selects the free-trial CTA from the home hero. | `src/pages/index.astro` |
| `pricing_plan_selected` | Visitor selects a pricing-plan CTA; the selected plan is recorded in the non-PII `plan` property. | `src/pages/pricing.astro` |
| `sales_contact_requested` | Visitor selects the enterprise contact-sales CTA. | `src/pages/pricing.astro` |
| `get_started_selected` | Visitor selects the persistent navigation get-started CTA. | `src/components/Navigation.astro` |

## User identification

Identification was skipped. This is a static marketing site with no login, signup, logout, session, API route, or user identity flow. Events therefore remain anonymous/personless by design. If authentication is added later, identify only with a verified stable non-PII user ID and reset on logout.

## Error tracking

Global browser exception autocapture was enabled with `autocaptureExceptions: true` in `src/components/posthog.astro`. It is inherited by pages using the shared layout. No manual error wrapper was added.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1901776)

The dashboard contains four attached insights for CTA engagement, pricing plan selection, the get-started-to-trial funnel, and sales interest. The dashboard and insights were created successfully, but their data is expected to remain empty until visitors generate events; no event delivery was verified during this run.

## What the run verified

- `npm add posthog-js` completed successfully and the dependency is present in the manifest and lockfile.
- `npm install` completed successfully with the dependency tree up to date.
- `npm run build` completed successfully, generated all five static routes, and reported `Complete!`.
- Review found no required fixes, no project CSP declaration blocking the SDK, and no PII in the configured event properties.
- No lint or typecheck script exists in `package.json`, so those checks were not available.
- npm reported 12 existing audit findings (2 moderate and 10 high) and pending install-script approval warnings; the run did not attribute these to the PostHog package.

## What remains unconfirmed or unresolved

- The run did not exercise the site in a real browser or observe any event arrive in PostHog. SDK loading, CTA capture delivery, exception delivery, and dashboard population must be confirmed separately.
- CTA destinations are placeholders (`href="#"`) in the instrumented marketing flows. Until real trial, signup, and sales flows exist, the events cannot establish completed outcomes.
- The notebook mirror could not be created: the PostHog MCP connection reported that `notebooks-create` requires the missing `notebook:write` scope. This costs the user the requested in-app shareable copy; the local report and dashboard remain available.

## Before you merge

- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deployment environment, using the names documented in `.env.example`; do not rely only on local `.env` values. Check `src/components/posthog.astro` for the initialization call.
- [ ] Run the full production build and fix any lint or type errors introduced by the generated instrumentation; the wizard verified `npm run build` only, and no lint/typecheck scripts exist in `package.json`.
- [ ] Run the test suite, if one is added, because the instrumented click call sites in `src/pages/index.astro`, `src/pages/pricing.astro`, and `src/components/Navigation.astro` may need updated mocks or fixtures.
- [ ] Replace the placeholder CTA destinations and add outcome events at successful trial, signup, or sales completion points; review the click listeners in `src/pages/index.astro` and `src/pages/pricing.astro`.
- [ ] Open the deployed site, click each tracked CTA, and confirm the four named events arrive in the PostHog project and populate the dashboard; the run itself did not verify runtime delivery.
