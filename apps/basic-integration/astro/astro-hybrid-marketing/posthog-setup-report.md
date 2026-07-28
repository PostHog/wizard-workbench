# PostHog setup report

PostHog was installed and initialized for the Astro marketing site, with four personless browser conversion events, browser exception autocapture, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-js` `^1.407.5` and `posthog-node` `^5.46.1` with npm. The install completed successfully; npm reported 13 existing/audit vulnerabilities and pending install-script approvals.
- Added the shared browser initialization in `src/components/posthog.astro`, using `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, Astro's `is:inline` directive, one-time initialization, tracing headers, and a development-time missing-configuration error. Production remains a no-op when configuration is missing.
- Imported the shared component into `src/layouts/Layout.astro`, so layout-wrapped pages use the same browser client.
- The real environment values were set through wizard environment tooling; `.env.example` documents the two required variable names.
- `capture_exceptions: true` was added to the shared browser initialization for uncaught browser errors and unhandled promise rejections.
- No server-side PostHog event was added: the site has no stable authenticated identity, and the capture step intentionally used the shared personless browser client.

## Instrumented events

These are the event contracts recorded in `.posthog-wizard-cache/.posthog-events.json` and the corresponding capture call sites. The run verified that the event names are present at their intended handlers; it did **not** observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `contact_form_submitted` | A visitor successfully submits the contact form, categorized by selected interest without form content or contact details. | `src/pages/contact.astro` |
| `trial_cta_clicked` | A visitor clicks a free-trial or plan-start call-to-action, with the originating placement or plan. | `src/pages/index.astro`, `src/pages/pricing.astro` |
| `sales_contact_cta_clicked` | A visitor begins a sales-contact journey from the home or enterprise-pricing call-to-action. | `src/pages/index.astro`, `src/pages/pricing.astro` |
| `get_started_cta_clicked` | A visitor clicks the persistent navigation call-to-action to indicate top-level acquisition intent. | `src/components/Navigation.astro` |

The contact event is intended to fire after a successful API response. CTA events are intended to fire from click handlers. The run did not execute those flows or confirm delivery.

## User identification

Identification was skipped. The inspected application has no authentication flow, user model, session state, login/register handler, logout action, or stable user identifier. Adding identification would have required inventing an identity or using PII. Events are therefore intentionally personless. If authentication is added later, identify with the application's stable user ID after login and on refresh for persisted sessions, and reset on logout.

## Error tracking

Browser exception autocapture was enabled in `src/components/posthog.astro` with `capture_exceptions: true`. The run verified the configuration was added, but did not trigger an error or observe an exception event in PostHog. The existing server API route retains its local catch handler; no server-side exception capture was added.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918202) was created with four attached insights covering conversion events over time, contact submissions by interest, CTA intent by placement, and an acquisition-intent funnel. The dashboard and insight definitions were saved successfully. The dashboard may have no observed event data yet because the run did not execute the instrumented flows.

## Build and conflicts

`npm install` completed with dependencies up to date, and `npm run build` completed successfully after the review fix, including server entrypoints, client build, and prerendering of all five static routes. No build conflict was reported. No lint, typecheck, or test scripts are defined in `package.json`, so those were not run. npm did report 13 existing/audit vulnerabilities and pending install-script approvals during dependency installation; these are not reported as build failures.

## Unresolved issue to follow up

- **No stable distinct ID is available.** The identify step could not establish an authenticated identity, so all four events remain personless. If left unresolved, behavior cannot be reliably attributed across sessions or tied to an authenticated user; add identification only when a real stable user ID exists.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the verified build was `npm run build`, but no lint or typecheck scripts exist. Review the generated initialization and call sites in `src/components/posthog.astro`, `src/pages/contact.astro`, `src/pages/index.astro`, `src/pages/pricing.astro`, and `src/components/Navigation.astro`.
- [ ] Run the test suite, if one is added or available in the deployment project, and update mocks or fixtures for the new capture calls in `src/pages/contact.astro:80`, `src/pages/index.astro:17-18`, `src/pages/pricing.astro:27,43,60`, and `src/components/Navigation.astro:15`.
- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deploy environment, not only locally; confirm the names documented in `.env.example` and used in `src/components/posthog.astro:2-3`.
- [ ] Trigger the contact success path and each CTA in a real browser, then confirm `contact_form_submitted`, `trial_cta_clicked`, `sales_contact_cta_clicked`, and `get_started_cta_clicked` arrive in PostHog with the intended non-PII properties. The run only verified source call sites, not event delivery.
- [ ] Trigger a representative uncaught browser error or unhandled rejection in a safe environment and confirm exception data arrives; the run verified only `capture_exceptions: true` in `src/components/posthog.astro:16`.
