# PostHog setup report

PostHog browser analytics was installed, initialized from Vite environment variables, connected to authenticated users, instrumented for nine product actions, and paired with a starter dashboard.

## Installed and initialized

- Installed `posthog-js` `^1.407.5` with npm; the lockfile resolves version `1.407.5` (`package.json`, `package-lock.json`).
- Initialized the shared browser singleton in `src/lib/posthog.js` using `import.meta.env.VITE_POSTHOG_KEY` and `import.meta.env.VITE_POSTHOG_HOST`.
- Imported the initialization module from `src/main.js`. Missing configuration is a production no-op and raises the required diagnostic in development.
- The configured environment keys were present during review: `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`. The real values are kept in environment configuration, not source code.
- Autocapture was left enabled. No CSP was present in the app, so no CSP changes were needed.

## Events instrumented

These are planned client-side captures recorded in `.posthog-wizard-cache/.posthog-events.json`. The run did not exercise the application or observe events arriving in PostHog, so delivery remains **unconfirmed**.

| Event | What it measures | File |
|---|---|---|
| `login_succeeded` | A team member successfully signs in. | `src/api.js` |
| `logged_out` | A signed-in team member signs out. | `src/api.js` |
| `project_created` | A project is created. | `src/api.js` |
| `project_deleted` | A project is deleted. | `src/api.js` |
| `task_created` | A task is added to a project. | `src/api.js` |
| `task_status_updated` | A task is moved to a different status. | `src/api.js` |
| `task_deleted` | A task is deleted from a project. | `src/api.js` |
| `task_assignee_updated` | A task assignment is changed or cleared. | `src/api.js` |
| `settings_updated` | One or more application preferences are updated. | `src/api.js` |

Captures were placed after successful client-side state mutations. The review also prevented task status, deletion, and assignment events when the referenced task does not exist. Event properties avoid PII and user-entered titles, descriptions, names, and emails.

## User identification

Identification was wired. `src/api.js` identifies a successful login with the stable team-member `id`, while email, name, and role are person properties. `src/main.js` identifies a persisted signed-in user on refresh before routes start. Logout calls `posthog.reset()` before clearing application authentication. The run did not verify identity or event attribution in a live browser session.

## Error tracking

`src/lib/posthog.js` starts exception autocapture immediately after initialization, with unhandled errors and unhandled promise rejections enabled. Console-error capture remains disabled. The run verified the code change but did not observe an exception arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919754) was created with five insights covering logins, projects created, tasks created, task status changes by status, and settings updates over the last 30 days. The dashboard and insight definitions exist in PostHog; they may remain empty until the application sends events.

## What the run verified

- `npm install` completed successfully and dependencies were synchronized.
- `npm run build` passed after review; Vite transformed 21 modules successfully.
- The configured Vite environment keys were present during review.
- Static review found the shared initialization, identity transitions, captures, and exception-autocapture wiring.

## What the run did not verify

- No live application session was run, so no custom event, exception, or identity attribution was observed arriving in PostHog.
- No test suite was run.
- Network delivery and production deployment environment configuration were not exercised.

## Build and dependency conflicts

`npm install` reported four high-severity audit findings and pending `allowScripts` approvals for `core-js` and `esbuild`. Neither prevented the production build, and neither was caused by this integration. No other build conflict was reported.

## Before you merge

- [ ] Run the full production build and fix any lint or type errors introduced by the integration; inspect `src/lib/posthog.js`, `src/main.js`, and `src/api.js` at their PostHog call sites.
- [ ] Run the test suite and update any mocks or fixtures affected by the instrumentation; inspect `src/api.js` at the capture and identity call sites.
- [ ] Confirm `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only local `.env`; inspect `.env.example` and the deployment/bootstrap configuration.
- [ ] Exercise login, refresh, logout, and representative product actions in a real browser and confirm the corresponding events and user attribution arrive in PostHog; inspect `src/api.js` and `src/main.js` at the PostHog calls.
- [ ] Review and resolve the four high-severity npm audit findings and pending `allowScripts` approvals for `core-js` and `esbuild`; inspect `package.json` and `package-lock.json`.
