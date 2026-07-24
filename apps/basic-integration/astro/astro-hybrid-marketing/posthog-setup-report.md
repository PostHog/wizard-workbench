# PostHog setup report

PostHog browser analytics is initialized globally for the Astro site, with one conversion event, client-side exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` (`^1.407.2`) and `posthog-node` (`^5.46.1`) using npm; both dependencies were written to `package.json` and `package-lock.json`.
- Added `src/components/posthog.astro`, which initializes one browser PostHog client from `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, enables tracing headers, and enables exception autocapture with `capture_exceptions: true`.
- Rendered that component from `src/layouts/Layout.astro`, making the initialized browser client available across the shared layout.
- Added the environment variable names to `.env.example` and configured the real values in `.env` through the environment tooling. The configured values were not independently runtime-validated in this run.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `contact_form_submitted` | A visitor successfully submits the contact form, segmented by the selected non-PII `interest` value. | `src/pages/contact.astro` |

The event is captured after a successful contact API response. Contact name, email, company, and message are excluded from event properties. The run verified the call site and event definition, but did not observe an event arriving in PostHog.

## User identification

Identification was skipped. The site has no login, signup, account record, authenticated session, stable non-PII user identifier, or logout flow. Contact-form name and email are user-entered PII and must not be used as a distinct ID. If authentication is added later, wire `identify()` at successful authentication and reset on logout or account switch using the stable non-PII identifier.

## Error tracking

Client-side global uncaught exception autocapture was enabled in `src/components/posthog.astro` with `capture_exceptions: true`. Server-side `posthog-node` exception handling was not added. The run did not trigger an exception or verify delivery of an error event.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902566)

The dashboard contains three live insight definitions for `contact_form_submitted`: daily submissions over 30 days, submissions broken down by `interest`, and a 30-day total KPI. It may show no data until real submissions occur; the run did not verify incoming event data.

## Verification and unresolved items

- `npm install` completed successfully.
- `npm run build` passed before and after the review fix, producing the static pages and Node server build.
- No lint or typecheck script is defined in `package.json`.
- No CSP was found in the inspected source or Astro configuration, so no CSP change was required.
- Runtime network delivery was not exercised; a passing build proves compilation, not event flow.
- **Follow-up issue — server error tracking remains unresolved:** only browser exception autocapture is configured. If SSR or API failures must be tracked, server-side `posthog-node` error handling still needs a deliberate implementation; leaving it unresolved means those server failures will not be reported by this setup.
- **Follow-up issue — identity remains unresolved by design:** no stable authenticated identifier exists. Events remain anonymous/personless until the application adds an auth model; adding identity later without the login, refresh, and logout boundaries could fragment user activity.

## Build conflict

npm reported 13 existing audit vulnerabilities and pending install-script approval warnings, but installation and the production build both succeeded. No build conflict was reported.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the wizard verified `npm run build`, but no lint or typecheck script exists in `package.json`.
- [ ] Run the test suite and update mocks or fixtures if the instrumented contact-form call site requires them.
- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deployment environment, not only the local `.env`; confirm the exact names in `.env.example`.
- [ ] Submit the contact form in a deployed or local browser and confirm `contact_form_submitted` arrives in PostHog; also verify the `interest` breakdown in the [dashboard](https://us.posthog.com/project/483112/dashboard/1902566).
- [ ] If server-side SSR/API error tracking is required, implement and verify it around the relevant server boundaries; the current setup only enables browser exception autocapture.
