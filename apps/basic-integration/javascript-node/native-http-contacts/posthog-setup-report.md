# PostHog setup report

PostHog server-side analytics was added to the native Node.js contacts API for anonymous contact-management lifecycle events and centralized request error tracking.

## What was installed and initialized

- Installed `posthog-node` (`^5.46.1`) with npm; `package.json` and `package-lock.json` were updated. The install completed successfully and reported 0 vulnerabilities.
- Added `posthog.js` as the single module-level PostHog client. It reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `process.env`, enables `enableExceptionAutocapture: true`, fails loudly in development when configuration is missing, and is a guarded production no-op when unconfigured.
- Documented the required keys in `.env.example`. The real keys were configured in the local `.env` through the wizard environment tool; their values were not exposed here.
- Route captures await `posthog.flush()` before returning, so queued events are given a delivery opportunity.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `contact_group_created` | A contact group was successfully created | `index.js` |
| `contact_created` | A contact was successfully created | `index.js` |
| `contact_updated` | An existing contact was successfully updated | `index.js` |
| `contact_deleted` | An existing contact was successfully deleted | `index.js` |

Captures use non-PII contextual properties only. Contact names, email addresses, phone numbers, companies, and contact IDs are not sent. The run verified that capture calls are placed after successful mutations and that the event plan matches these four names. The run did **not** exercise the server or observe events arriving in PostHog, so event delivery and event volume remain unconfirmed.

## Identification

User identification was skipped. The API has no authentication, sessions, login flow, or application-user model, so there is no verified stable caller identifier to use. Events and handled exceptions are therefore anonymous by design. If authentication is added later, bind the authenticated user’s stable ID with request-scoped context; do not use contact resource fields or contact PII.

## Error tracking

`index.js` now sends errors reaching the centralized request error handler through `posthog.captureException(err)` and awaits `posthog.flush()` before returning the 500 response. Exception autocapture is also enabled in `posthog.js`. The run did not trigger an error request or observe an exception in PostHog, so error delivery remains unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918242)

The dashboard contains four daily trend insights for the four instrumented events over the last 30 days. It was created successfully, but the run did not confirm that event data has arrived.

## Verification status and unresolved issues

- `npm install` completed successfully and reported 0 vulnerabilities.
- No build, typecheck, or lint scripts are defined in `package.json`. The generic `npm run` verification attempt was blocked by runtime policy, so compilation was not verified.
- No runtime request exercise was performed. The integration therefore has not been proven to send events or exceptions.
- No attribution issue or `DISTINCT_ID` placeholder was reported. Anonymous attribution is intentional because no caller identity exists.

## Before you merge

- [ ] Run a full production build or equivalent startup verification for this Node.js service; `package.json` has no build script, so inspect `posthog.js` and `index.js` if a local verification command is added.
- [ ] Run the test suite, if one is added or available, and update mocks or fixtures for the PostHog calls in `index.js`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only local `.env`.
- [ ] Exercise successful group/contact create, update, and delete requests, then confirm the four corresponding events arrive in the linked dashboard.
- [ ] Exercise the centralized error path in `index.js`, then confirm the exception appears in PostHog Error Tracking.
- [ ] If authentication is introduced, wire a verified stable caller ID with request-scoped context before relying on person-level attribution.
