# PostHog setup report

PostHog server-side analytics was added to the native Node.js HTTP contacts API, including mutation events, centralized exception tracking, and a starter dashboard.

## Installed and initialized

- Installed `posthog-node` with npm; installation completed successfully with zero reported vulnerabilities.
- Added a shared singleton in `posthog.js`, configured from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.
- Enabled `enableExceptionAutocapture`, with `flushAt: 1` and `flushInterval: 0`.
- Added development-time loud errors for missing configuration and production no-op behavior when configuration is absent.
- Added `.env.example` documenting the required variable names, and configured the real values in the local `.env` through the wizard environment tools.
- No CSP changes were needed because this is a server-only Node.js integration.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `group_created` | A contact group was successfully created. | `index.js` |
| `contact_created` | A contact was successfully created. | `index.js` |
| `contact_updated` | A contact was successfully updated; properties indicate which fields changed. | `index.js` |
| `contact_deleted` | A contact was successfully deleted. | `index.js` |

Each mutation capture is placed after the corresponding in-memory mutation succeeds and awaits `posthog.flush()` before responding. Events use the stable non-PII server distinct ID `native-http-server`; they do not include contact names, emails, phone numbers, or contact IDs as actor identity.

**Observed versus unconfirmed:** The run verified the capture call sites and flush behavior by reviewing the resulting source. It did not run the server against PostHog or observe any event arriving, so event delivery and live volumes remain unconfirmed.

## User identification

Identification was skipped. The API has no authentication, login, session, account, or caller identity context. Contact and group resource IDs identify managed data, not the caller, so using them as actor IDs would misattribute activity. If authentication is added later, establish request-wide identity from the authenticated caller's stable user ID rather than contact data.

## Error tracking

The centralized request-level catch handler in `index.js` calls `posthog.captureException()` for uncaught request errors, using an incoming `x-posthog-distinct-id` when available and `native-http-server` otherwise. It attaches only request method and path context and awaits `posthog.flush()` before returning the 500 response. The run verified this code by review; it did not trigger an error and observe an exception in PostHog.

## Dashboard

Created `Analytics basics (wizard)` (dashboard ID `1918833`) with four saved daily trends insights over the last 30 days: Contact mutations, Groups created, Contacts created, and Contact updates and deletions. The dashboard and insights were confirmed as saved and attached by the PostHog MCP. Current event ingestion was not verified.

Dashboard link: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918833)

## Build and verification status

- `npm install` completed successfully; the dependency was current and the audit reported zero vulnerabilities.
- No build, typecheck, lint, or test scripts are defined in `package.json`; only `start` and `dev` scripts exist.
- No supported finite build or test command was available, and the application was not started during this run. Therefore compilation, startup, request behavior, and event delivery were not verified.
- Build conflict: none reported.

## Issues to follow up

- **No caller attribution is available:** all ordinary mutation events currently use `native-http-server` because the API has no authentication context. If left unresolved, analytics cannot distinguish users or callers and all server mutations aggregate under one actor.
- **PostHog delivery was not observed:** the run confirmed instrumentation but did not send a request and verify ingestion. If left unresolved, dashboard tiles may remain empty even though the code compiles and queues events.

## Next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only the local `.env`; keep the names aligned with `.env.example`.
2. Start the API and exercise group creation plus contact create, update, and delete routes, then confirm the four event names appear in PostHog and populate the dashboard.
3. Trigger a controlled request error and confirm it appears in PostHog Error Tracking.
4. If authentication is introduced, bind the authenticated caller's stable ID at the request boundary and remove reliance on the server-wide fallback for attribution.

## Before you merge

- [ ] Run a full production build; this run had no build script and did not verify that the generated integration starts successfully in the target deployment.
- [ ] Run the test suite; this project has no test script, so add or run the project's applicable tests and update mocks or fixtures for the PostHog calls in `index.js`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in deployment environments, not just `.env`.
- [ ] Exercise the mutation routes and verify `group_created`, `contact_created`, `contact_updated`, and `contact_deleted` arrive in PostHog; delivery was not observed during this run.
- [ ] Trigger the centralized error path in `index.js` and verify the exception arrives in PostHog Error Tracking.
