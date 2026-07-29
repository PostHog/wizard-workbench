# PostHog setup report

PostHog server-side analytics was added to the Koa notes API, with five CRUD events, global error capture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-node` and `dotenv` with npm; `package.json` and `package-lock.json` were updated. The final review reported successful npm installation with zero vulnerabilities.
- Added the shared singleton in `posthog.js`. It loads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` through `dotenv/config`, uses the server-side `PostHog` client, enables exception autocapture, and sets `flushAt: 1` and `flushInterval: 0`.
- Missing configuration fails loudly outside production and uses a guarded production no-op. The real keys were configured in the local `.env`; `.env.example` documents the variable names.
- No browser SDK or reverse proxy was added. No CSP changes apply because this is server-only Node instrumentation.

## Events instrumented

The run recorded these five successful mutation event definitions in `.posthog-wizard-cache/.posthog-events.json` and added captures in `index.js`:

| Event | What it measures | File |
|---|---|---|
| `folder_created` | A folder is successfully created. | `index.js` |
| `folder_deleted` | A non-default folder is deleted and its notes are moved to General. | `index.js` |
| `note_created` | A note is successfully created. | `index.js` |
| `note_updated` | A note is successfully updated. | `index.js` |
| `note_deleted` | A note is successfully deleted. | `index.js` |

The captures use operational, non-PII properties such as numeric resource IDs, folder IDs, content presence, changed-field booleans, and moved-note counts. The run did **not** observe events arriving in PostHog, so event delivery and resulting data are unconfirmed.

## User identification

Identification was skipped. The application has no authentication, sessions, user records, or stable user identifier. Events are deliberately personless; no fabricated distinct ID or placeholder was added. Until authentication provides a stable user ID at the request boundary, these events cannot be attributed to users. If identity remains absent, user-level adoption analysis will remain unavailable; if identity is added later, request-scoped context must use the authenticated stable ID rather than an email or name.

## Error tracking

`index.js` now registers one app-level Koa `error` listener. When the shared client exists, it calls `posthog.captureException(error)` and initiates `posthog.flush()`. This configures uncaught application-error reporting, but the run did not start the app or observe an error arriving in PostHog, so delivery is unconfirmed.

## Dashboard

Created dashboard **Analytics basics (wizard)** in PostHog project `483112` with five tagged, 30-day daily trend insights covering the instrumented events. The dashboard and tiles were created successfully according to the PostHog MCP response; the dashboard may remain empty until the application emits events.

[Open the Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1926589)

## What the run verified — and did not verify

- Verified: dependencies were installed; the shared initialization and route/error instrumentation were reviewed; the five event definitions and dashboard tiles were created.
- Verified: npm reported zero vulnerabilities after installation, and the configured local environment keys were present.
- Not verified: no build, typecheck, lint, test suite, or application start was run. The package has no build, typecheck, or lint script; one attempted `npm run` was rejected by runtime command policy before execution.
- Not verified: no event or exception was observed arriving in PostHog. A passing install/review is not evidence of event flow.

## Unresolved issues to follow up

1. **Stable attribution is unresolved.** `index.js` has no authenticated identity, so all five mutation events and captured exceptions lack user attribution. This costs user-level funnels, retention, and adoption breakdowns until an authenticated stable ID exists.
2. **Runtime delivery is unresolved.** The application was not started and no requests or errors were exercised, so transport, flushing, and dashboard population still need confirmation.
3. **Build-quality validation is unresolved.** No project build, typecheck, lint, or tests were available or run, so integration regressions remain possible.

## Before you merge

- [ ] Run a full production build or equivalent startup validation and fix any integration errors; review `posthog.js` and `index.js`.
- [ ] Run the test suite and update mocks or fixtures for the new PostHog import and captures; review `index.js`.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only local `.env`; verify the names in `.env.example` and `posthog.js`.
- [ ] Start the application, exercise folder and note create/update/delete routes, and confirm the five named events appear in PostHog and populate dashboard `1926589`; review the capture call sites in `index.js`.
- [ ] Trigger a controlled application error and confirm it appears in PostHog Error Tracking; review the Koa `error` listener in `index.js`.
- [ ] If authentication is introduced, add request-scoped identification with a stable user ID before relying on user-level analytics; review the request boundary in `index.js`.
