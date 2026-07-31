# PostHog setup report

PostHog Node analytics was installed and initialized for the anonymous Hono links API, with link mutation events, global exception capture, and a starter dashboard configured.

## Installed and initialized

- Installed `posthog-node` with npm; `package.json` and `package-lock.json` were updated. npm reported one moderate dependency audit vulnerability, but installation completed successfully.
- `posthog.js` creates one shared `PostHog` client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, enables `enableExceptionAutocapture: true`, and exports `null` in production when configuration is absent. Development missing configuration fails loudly with the required messages.
- The real configuration keys were added to the local `.env` through the wizard tools, and the names are documented in `.env.example`.
- Request-scoped captures in `index.js` await `posthog.flush()` before returning. Personless events explicitly set `$process_person_profile: false`.

## Events instrumented

The run verified that these capture call sites are present. It did **not** run the application or observe events arriving in PostHog, so ingestion remains unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `link_created` | A new link is successfully saved through the links API. | `index.js` |
| `link_updated` | An existing link is successfully updated, including favorite state and updated fields. | `index.js` |
| `link_deleted` | An existing link is successfully deleted through the links API. | `index.js` |

## User identification

Identification was skipped. The application has no authentication, session, user model, or stable request identity field. The custom events are intentionally personless; the error handler can use an `x-posthog-distinct-id` header when supplied, but no stable identity source was established by this run. Do not use link titles, URLs, or caller-provided PII as a distinct ID.

## Error tracking

`index.js` registers Hono's global `app.onError` handler (lines 6–14). It sends uncaught exceptions with `posthog.captureException`, flushes the shared client, and returns a generic 500 response. The exception capture is also configured as personless with `$process_person_profile: false`. The run verified the code configuration, but did not trigger an exception or observe an Error Tracking event.

## Dashboard

The dashboard `Analytics basics (wizard)` was created with three trends tiles for the instrumented link events over the last 30 days. The dashboard and insight definitions were created successfully, but the run did not confirm that any event data has been ingested.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1935614)

## Unresolved issues and impact

- **No stable distinct ID is available.** `index.js` capture sites at lines 52–64, 88–101, and 115–124 have no application-owned user/session identity. Until authentication or another stable identity source is added, analytics cannot associate link activity with a person or account.
- **Event delivery was not verified.** No app startup, request exercise, or PostHog arrival check was recorded. The dashboard may remain empty until the mutation routes are exercised in a configured deployment.
- **Build and runtime validation was not completed.** The review found no build, typecheck, or lint scripts in `package.json`; no such commands, tests, or app startup were run.
- **Dependency advisory remains.** npm reported one moderate vulnerability during installation. The run did not resolve or investigate it.

## Before you merge

- [ ] Run a full production build; `package.json` has no build script, so add or use the project’s deployment validation and fix any errors introduced by `posthog.js` or `index.js`.
- [ ] Run the test suite, if available, and update mocks or fixtures for the PostHog calls in `index.js`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in every deploy environment, not only local `.env` (`posthog.js`, lines 3–4).
- [ ] Exercise successful create, update, and delete requests and confirm `link_created`, `link_updated`, and `link_deleted` arrive in PostHog before relying on the dashboard (`index.js`, lines 52–64, 88–101, and 115–124).
- [ ] Decide whether the API needs authentication or a stable non-PII request identity; if so, replace the personless behavior at the capture sites and establish identity at the request boundary before interpreting user-level analytics.
- [ ] Review the moderate npm audit advisory reported during installation and decide whether remediation is required.
