# PostHog setup report

PostHog browser analytics was installed and initialized for the Vite app, with authenticated identity, nine product events, global exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` `^1.407.3` with npm; the lockfile resolves version 1.407.3.
- `src/posthog.js` reads `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`, initializes the browser SDK once when configured, and keeps production as a no-op when configuration is absent. Development fails loudly when either required variable is missing.
- `src/main.js` imports the initialization module before routing and identifies a persisted authenticated user on app boot.
- `.env.example` documents the required variable names. The run confirmed both variables are present in the local environment; deployment environments still need their own configuration.
- Default SDK capture behavior remains enabled. No CSP was present in `index.html`, so no CSP changes were required.

## Events instrumented

These events were added to `src/api.js` at successful state-mutation boundaries. The run verified their definitions and source call sites, but did **not** exercise the browser, so arrival in PostHog is unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | Authenticated team member successfully signs in. | `src/api.js` |
| `user_logged_out` | Authenticated team member signs out before analytics state is reset. | `src/api.js` |
| `project_created` | Team member creates a project. | `src/api.js` |
| `project_deleted` | Team member deletes a project. | `src/api.js` |
| `task_created` | Team member adds a task to a project. | `src/api.js` |
| `task_status_changed` | Team member moves a task to a different workflow status. | `src/api.js` |
| `task_deleted` | Team member deletes a task. | `src/api.js` |
| `task_assignee_changed` | Team member assigns or unassigns a task. | `src/api.js` |
| `settings_updated` | Team member updates an application preference. | `src/api.js` |

## Identity and error tracking

- User identification is wired. The stable authenticated user `id` is used as the distinct ID at login and on refresh; email, name, and role are sent as person properties rather than event properties. Logout and direct account switching reset analytics state.
- Global exception autocapture was added in `src/posthog.js` with `posthog.startExceptionAutocapture()`, covering the configured browser SDK's uncaught errors and unhandled rejections. Error delivery was not exercised and is therefore unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914241)

The dashboard contains five tagged insights: successful logins, projects created, tasks created, task workflow changes by status, and a login-to-project-creation funnel. These are definitions over the intended events and may remain empty until the app sends data; no event counts were observed during this run.

## Verified versus unconfirmed

### Verified by this run

- `posthog-js` installation completed and the dependency is declared in the manifest.
- `npm run build` passed with Vite 6.4.1, transforming 21 modules and producing `dist` assets.
- The integration was statically reviewed; initialization precedes identify and capture calls, captures are guarded, identity/reset flows are present, and no PII is placed in event properties.
- The dashboard and five insights were created successfully in PostHog.

### Not verified by this run

- No browser session or production-like action flow was run.
- No event, exception, identify call, or dashboard data point was observed arriving in PostHog.
- No lint or typecheck scripts exist in `package.json`, so neither was run.

## Build and dependency conflict

The integration installed and built successfully. npm reported four existing high-severity audit findings and pending install-script approvals for `core-js` and `esbuild`; these did not prevent installation or the production build. No integration-specific build conflict was reported.

## Unresolved follow-up issue

Event delivery remains unresolved because the run did not exercise the browser. If left unverified, the dashboard and nine event definitions can exist without confirming that real user actions produce data, making analytics decisions unreliable. A browser smoke test should trigger representative login, project, task, and settings actions and confirm the events arrive.

## Before you merge

- [ ] Run the full production build again and fix any lint or type errors introduced by the integration; the current run verified `npm run build`, but no lint or typecheck scripts are defined. Review `package.json` scripts.
- [ ] Run the test suite, if one is added or available in the deployment workflow, and update mocks or fixtures for the instrumented API paths in `src/api.js`.
- [ ] Set `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` in every deploy environment, not only locally; verify the names in `.env.example` and the initialization in `src/posthog.js`.
- [ ] Because auth and identify are wired, sign in, refresh, and confirm the returning-visitor path identifies the persisted user; review `src/main.js` and `src/posthog.js`.
- [ ] Run a browser smoke test for representative actions and confirm the nine events arrive in PostHog; review the capture call sites in `src/api.js`.
