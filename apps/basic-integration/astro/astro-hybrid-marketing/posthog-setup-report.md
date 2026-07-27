# PostHog setup report

PostHog browser analytics, contact-form conversion tracking, exception autocapture, and a starter dashboard were added to the Astro marketing site.

## What was installed and initialized

- Installed `posthog-js` and `posthog-node` with npm; both are recorded in `package.json` and `package-lock.json`.
- Configured `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in `.env`, and documented the keys in `.env.example`.
- Added the centralized browser initialization component at `src/components/posthog.astro` and mounted it from `src/layouts/Layout.astro`, so pages using the shared layout receive the same PostHog instance.
- Initialization uses the environment values, `tracing_headers`, and `capture_exceptions: true`. No Content-Security-Policy changes were needed because no CSP was present.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `contact_form_submitted` | A visitor successfully submits the contact form; includes the selected non-PII interest value. | `src/pages/contact.astro` |
| `contact_form_submission_failed` | A contact-form submission receives an error response or network failure; includes `failure_type` (`response_error` or `network_error`). | `src/pages/contact.astro` |

The successful event is captured only after a successful API response. The failure event is captured for response and network failure branches. The run did not browser-exercise the form or observe either event arrive in PostHog, so event delivery remains unconfirmed. No PII is included in event properties.

## User identification

Identification was skipped. This is an anonymous marketing site with a contact form and no login, registration, session, logout, account-switching flow, or stable non-PII user identifier. Contact-form name and email cannot be used as a distinct ID. Events therefore rely on PostHog's anonymous browser identity.

## Error tracking

Browser exception autocapture was enabled with `capture_exceptions: true` in `src/components/posthog.astro`. No route-level wrappers or manual exception capture calls were added. Server API error-handler capture was not added. The run verified configuration and compilation, not that an exception was observed in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1912730)

The dashboard contains three insights for the last 30 days: successful submissions over time, successful submissions by `interest`, and failed submissions by `failure_type`. It is configured against the instrumented event names and will populate as events arrive; the run did not confirm captured data.

## Verification and unresolved issues

- `npm add` completed successfully and dependencies were current.
- `npm run build` passed before and after review, building the server/client entrypoints and prerendering all five static pages.
- No lint or standalone typecheck scripts are defined.
- Environment presence was confirmed for `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`.
- The run did not verify runtime event delivery, dashboard population, or exception arrival.
- npm reported 13 audit vulnerabilities and three pending install-script approvals. Neither prevented installation or the clean production build; they remain dependency follow-up items.

## Before you merge

- [ ] Run the contact form success and failure paths in a real browser and confirm `contact_form_submitted` and `contact_form_submission_failed` arrive in PostHog; inspect the capture branches in `src/pages/contact.astro`.
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` are set in every deployment environment, not only `.env`; verify the documented names in `.env.example`.
- [ ] Run the full production build in the merge environment and fix any generated-code lint or type errors; the reviewed build passed, but no lint or standalone typecheck script exists.
- [ ] Run the test suite, if one is added or available in CI, and update mocks or fixtures for the contact-form capture calls in `src/pages/contact.astro`.
- [ ] Review the 13 npm audit vulnerabilities and three pending install-script approvals before release; installation and build were not blocked.
