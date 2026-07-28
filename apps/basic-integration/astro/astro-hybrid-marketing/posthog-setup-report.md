# PostHog setup report

PostHog was installed and initialized for browser analytics and server-side contact-form tracking in the Astro marketing site.

## What was installed and initialized

- Installed `posthog-js` and `posthog-node` with npm; `package.json` and `package-lock.json` were updated.
- Added a guarded, inline browser initialization in `src/components/posthog.astro`, mounted globally from `src/layouts/Layout.astro`.
- Browser configuration reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, uses the SDK defaults, and enables hostname-based tracing headers for session and distinct-ID continuity.
- Added a guarded server singleton in `src/lib/posthog-server.ts` using `posthog-node`, with `flushAt: 1`, `flushInterval: 0`, and exception autocapture enabled.
- Documented `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in `.env.example`. The run configured both environment values through the wizard environment tools.

## Events instrumented

These events were added to the application. The run did not exercise the live application or observe events arriving in PostHog, so delivery is unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `contact_form_submitted` | A validated contact form submission accepted by the server, including the selected non-PII interest category. | `src/pages/api/contact.ts` |
| `free_trial_cta_clicked` | A visitor clicking a trial call to action, including placement and, where applicable, the selected plan. | `src/pages/index.astro`, `src/pages/pricing.astro`, `src/components/Navigation.astro` |

The contact event is captured only after validation succeeds and is flushed before the API response. The review added forwarded PostHog distinct and session IDs, with a per-request anonymous fallback when headers are unavailable. No user-entered PII is included in event properties.

## User identification

User identification was skipped. The application has no login, registration, logout, authenticated user model, serialized session, or other stable user identifier. All newly added events therefore remain anonymous; no `identify()` or `reset()` flow was added.

## Error tracking

- Browser initialization enables capture of unhandled errors and unhandled promise rejections through `capture_exceptions` in `src/components/posthog.astro`.
- The server singleton enables `enableExceptionAutocapture: true` in `src/lib/posthog-server.ts`.
- No runtime error was deliberately triggered, so error delivery was not observed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919717)

The dashboard contains a daily contact-submission trend, trial CTA clicks broken down by placement, and an ordered trial-CTA-to-contact-submission funnel. The saved insights were created from the intended event names; initial data may be empty because the run did not generate live traffic.

## Build status and conflicts

The review ran `npm install` successfully and `npm run build` successfully. The build compiled the server and client bundles and prerendered all five static routes. No lint or typecheck script is defined in `package.json`.

There was no build conflict attributable to the integration. npm reported 13 dependency audit vulnerabilities and pending install-script approvals; these did not block installation or the build and were not attributed to this integration.

## Unresolved issues and follow-up

- Live event delivery remains unconfirmed: the run did not exercise the site or verify events arriving in PostHog. If events do not appear after deployment, inspect the initialization and the capture call sites listed above.
- Anonymous attribution is intentional but limited: without a stable authenticated identity, events cannot be tied to known users. Introducing authentication later requires wiring `identify()` on login and returning authenticated sessions, plus `reset()` on logout.
- When the tracing headers are unavailable, `src/pages/api/contact.ts` uses a per-request anonymous fallback, so those requests will not have stable cross-request attribution.

## Before you merge

- [ ] Run a full production build in the target environment and fix any lint or type errors introduced by the integration; the wizard verified `npm run build`, but no lint or typecheck script exists in `package.json`.
- [ ] Run the test suite and update mocks or fixtures if the instrumented contact or CTA call sites are covered; no test command was defined or run during this integration.
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` are present in every deployment environment, using the exact names documented in `.env.example`, not only in the local wizard environment.
- [ ] Exercise a successful contact submission and each relevant trial CTA in a deployed or local browser, then confirm `contact_form_submitted` and `free_trial_cta_clicked` arrive in PostHog with the expected non-PII properties.
- [ ] If a stable user identity is added later, inspect the authentication boundary and returning-session path before adding `identify()` and `reset()` behavior.
