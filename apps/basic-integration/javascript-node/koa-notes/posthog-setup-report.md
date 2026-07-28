# PostHog setup report

PostHog server-side analytics was added to the Koa notes API, with five personless lifecycle events, centralized exception tracking, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-node` with npm. The install completed successfully; the dependency audit reported 0 vulnerabilities.
- Installed `dotenv` during review so the checked-in `.env` configuration is loaded when the app starts.
- Added the shared initialization in `posthog.js`, using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment. The client enables exception autocapture and uses `flushAt: 1` and `flushInterval: 0`.
- Missing configuration is a production no-op; non-production startup reports the missing required variable. The configured values are documented in `.env.example` and are present in the local `.env`.
- `index.js` imports the single shared client. Successful mutation handlers await `posthog.flush()` after capture.

## Events instrumented

These are the events the run verified as instrumented in `index.js`. The run did **not** exercise the API or observe any event arriving in PostHog, so event delivery and dashboard volume remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `folder_created` | A folder is created in the notes workspace. | `index.js` |
| `folder_deleted` | A non-default folder is deleted and its notes are moved to General. | `index.js` |
| `note_created` | A note is created in a folder. | `index.js` |
| `note_updated` | An existing note is edited or moved between folders. | `index.js` |
| `note_deleted` | An existing note is deleted. | `index.js` |

Event properties are operational metadata only: resource and folder IDs, content presence/length, moved-note count, and changed note fields. No user-entered PII was added to event properties.

## Identity status and unresolved attribution

User identification was skipped. The API has no authentication, user records, sessions, or stable user identifier, so the events are intentionally personless. No placeholder distinct ID was introduced.

**Follow-up issue — attribution is unresolved:** if these events need to be attributed to users, a future authentication or stable-session model must establish request-scoped identity at the Koa boundary and bind it to captures and exceptions. Until then, the dashboard cannot distinguish activity by user, and historical personless events cannot be retroactively attributed.

## Error tracking

`index.js` registers one app-level Koa `error` listener. It calls `posthog.captureException(err)` and awaits `posthog.flush()` through the guarded shared client. Exception autocapture is also enabled in the PostHog constructor. The run reviewed this wiring but did not trigger an application error or observe an exception in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918243)

The dashboard contains five daily trend insights for the instrumented events. Dashboard and insight creation succeeded, but fresh insights may remain empty because this run observed no event arrivals.

## Verification and limits

- Dependency installation and review completed successfully; the final audit reported 0 vulnerabilities.
- Source review verified the shared initialization, guarded captures, awaited flushes, five event call sites, and the Koa error boundary.
- No build, typecheck, lint, test suite, or app-start validation was run. `package.json` has only `start` and `dev` scripts and no build, typecheck, or lint commands.
- No event flow, exception delivery, or dashboard population was observed.
- No build conflict was reported. The only review issue was the missing environment loader, which was resolved by adding `dotenv/config` and the `dotenv` dependency.

## Before you merge

- [ ] Run a full production build or equivalent startup validation; this run had no build script, and fix any errors introduced by the integration.
- [ ] Run the test suite; this run had no test command, and instrumented call sites may need updated mocks or fixtures.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in each deploy environment, not only in the local `.env`.
- [ ] Exercise folder and note mutation routes and confirm the five corresponding events arrive in PostHog and populate the dashboard; instrumentation alone was verified, not delivery.
- [ ] If authentication or stable sessions are added later, establish request-scoped identity before relying on user-level attribution; currently no identify call is wired.
