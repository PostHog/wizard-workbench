# PostHog setup report

PostHog server-side analytics was added to the Express todo API, including todo lifecycle events, exception tracking, graceful shutdown flushing, and a starter dashboard.

## Installed and initialized

- Installed `posthog-node` and `dotenv` with npm; both are recorded in `package.json` and `package-lock.json`.
- `posthog.js` loads local environment configuration with dotenv and reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `process.env`.
- A single shared PostHog client is created with `enableExceptionAutocapture: true`. Development fails loudly when either required variable is missing; production uses a no-op when unconfigured.
- `.env.example` documents the required variable names. The run recorded both values as present in the local `.env`.
- `index.js` uses the shared client, installs Express request context before routes, and shuts the client down on SIGINT/SIGTERM.

## Events instrumented

These events are instrumented after successful todo mutations. The run did not execute the app or observe events arriving in PostHog, so capture delivery remains unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A todo was successfully created. | `index.js` |
| `todo_updated` | A todo title was successfully updated. | `index.js` |
| `todo_completed` | A todo changed from incomplete to complete. | `index.js` |
| `todo_reopened` | A completed todo changed back to incomplete. | `index.js` |
| `todo_deleted` | A todo was successfully deleted. | `index.js` |

Captures intentionally contain no todo title, ID, or other user-entered content. They are personless because this API has no authentication, session, or stable user model.

## User identification

Identification was skipped. The run found no authentication or user identity boundary, so no stable distinct ID could be established without inventing one. If authentication is added later, bind its verified stable user primary key to the Express request context; do not use todo IDs, titles, emails, or usernames.

## Error tracking

`index.js` installs `setupExpressErrorHandler` after the routes and `setupExpressRequestContext` before them. Uncaught Express errors are therefore configured to reach PostHog Error Tracking, with incoming PostHog tracing context available. The run did not trigger an error or observe an error event, so delivery is unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935569)

The dashboard contains a daily todo-creation trend, a multi-series todo-lifecycle trend, and a todo creation-to-completion funnel. It may initially be empty because the run observed no incoming events.

## Verification and unresolved issues

### Verified by the run

- npm installation completed successfully with zero reported vulnerabilities.
- The integration files were reviewed, and the shared singleton, static snake_case event names, Express middleware ordering, exception autocapture, and graceful shutdown were present.
- No CSP applies because this is a server-only Express application.

### Not verified

- No build, typecheck, lint, test suite, app startup, live route request, event delivery, or error delivery was run. `package.json` has no build, typecheck, or lint script.
- The PostHog docs MCP request returned HTTP 503; implementation review used the framework rules and local integration code instead.

### Follow-up issue

The run could not establish authenticated attribution because the application has no identity boundary. Leaving this unresolved means lifecycle events and exception reports cannot be reliably associated with a user if user-level analysis is later required.

## Before you merge

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the integration; `package.json` currently defines no build, lint, or typecheck script.
- [ ] Run the test suite and update any mocks or fixtures needed for the instrumented `index.js` call sites.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only local `.env`; the exact names are documented in `.env.example` and `posthog.js`.
- [ ] Start the API and exercise create, title update, complete, reopen, and delete routes, then confirm the five events arrive in PostHog and that the dashboard populates.
- [ ] Trigger an Express error and confirm it appears in PostHog Error Tracking.
- [ ] If authentication is introduced, add a verified stable user primary key to the Express request context before relying on user-level attribution.
