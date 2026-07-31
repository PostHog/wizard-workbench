# PostHog setup report

PostHog browser analytics, conversion events, exception autocapture, and a starter dashboard were added to the Astro marketing site.

## Installed and initialized

- Installed `posthog-js` (`^1.409.5`) and `posthog-node` (`^5.47.2`) with npm; both are recorded in `package.json` and `package-lock.json`.
- Browser PostHog is initialized once in `src/components/posthog.astro`, mounted globally through `src/layouts/Layout.astro`.
- Initialization reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, documented in `.env.example` and configured locally in `.env`.
- The client keeps default capture behavior, uses same-origin tracing headers, and guards missing configuration so production remains a no-op while development reports the missing variable.

## Events instrumented

These are instrumented call sites, not confirmed deliveries. The run did not exercise the application or observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `free_trial_cta_clicked` | Visitor expresses interest in starting a free trial from the homepage hero; includes non-PII placement context. | `src/pages/index.astro` |
| `pricing_plan_cta_clicked` | Visitor selects a self-service pricing-plan CTA, segmented by the selected plan. | `src/pages/pricing.astro` |
| `contact_form_submitted` | Visitor successfully submits the sales contact form, segmented by selected interest only; form PII is excluded. | `src/pages/contact.astro` |

## Identification

User identification was skipped. The inspected application has no login, registration, logout, authenticated session, user model, or stable non-PII user identifier. Contact-form email, name, company, and message data must not be used as a distinct ID or event properties. The events above are intentionally personless browser events.

## Error tracking

Global browser exception autocapture was enabled in `src/components/posthog.astro` for unhandled errors and unhandled promise rejections. Console-error capture remains disabled. No server-side error handler was added.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935588)

The dashboard contains four saved insights: daily trial CTA clicks, pricing intent broken down by `plan`, daily successful contact submissions, and a 14-day ordered trial-to-contact funnel. Definitions are ready, but the dashboard may remain empty until the application emits events.

## What the run verified

- npm installation completed successfully, with the SDK dependencies present in the manifest and lockfile.
- The production Astro build passed after the review fix. Astro built client and server bundles and prerendered all five static routes.
- The local environment check confirmed `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` are present.
- The dashboard and four insight definitions were created in PostHog.

## What the run did not verify

- No event delivery was observed. A passing build proves the code compiles; it does not prove captures reach PostHog.
- No browser session, contact submission, or production deployment was exercised.
- No tests or lint/typecheck commands were run; `package.json` defines no lint or typecheck scripts.
- No server-side PostHog singleton or API-route capture was implemented, despite `posthog-node` being installed. Server-side contact-route attribution and flushing remain unresolved.
- No CSP was found in the inspected source, so CSP behavior was not tested.

## Issues to follow up

1. **Server-side instrumentation remains unresolved.** `src/pages/api/contact.ts` exists, but no `src/lib/posthog-server.ts`, server-side capture, or awaited flush was added. If left unresolved, contact submissions will only be represented by the browser success event and server-side processing/errors will not be attributed or measured.
2. **Identity attribution is unavailable.** The site has no stable user ID, so events cannot be tied to known users or joined across future authenticated activity until an authentication/session identity exists. Do not replace this with contact-form PII.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the recorded build passed, but no lint/typecheck scripts are defined in `package.json`.
- [ ] Run the test suite and update any mocks or fixtures needed by the new browser capture call sites.
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only local `.env`; inspect `src/components/posthog.astro` and the deployment environment settings.
- [ ] Open the deployed site and trigger the homepage CTA, Starter or Pro pricing CTA, and a successful contact submission; confirm the three named events appear in PostHog and populate the dashboard.
- [ ] Decide whether server-side tracking is required for `src/pages/api/contact.ts`; if so, add the server singleton, request tracing attribution, capture, and awaited flush before returning the response.
