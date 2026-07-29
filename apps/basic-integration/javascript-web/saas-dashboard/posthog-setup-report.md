# PostHog setup report

PostHog browser analytics, authenticated identity, workflow event instrumentation, SPA pageviews, exception autocapture, and a starter dashboard were added to the Vite app.

## Installed and initialized

- Installed `posthog-js` with npm; `package.json` and `package-lock.json` were updated.
- `src/posthog.js` initializes the browser singleton once using `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`, imported by `src/main.js`.
- Missing configuration remains a production no-op and throws the required development-only error.
- The real environment keys were configured in `.env`; `.env.example` documents both names. No CSP was found in the reviewed project files.
- `src/router.js` captures `$pageview` after hash-router resolution for SPA navigation.

## Events instrumented

These are instrumented event definitions, not runtime observations. The run did not observe events arriving in PostHog, and the dashboard may remain empty until the app is exercised in a browser.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A team member successfully signs in | `src/api.js` |
| `user_logged_out` | An authenticated team member signs out | `src/api.js` |
| `project_created` | A project is created successfully | `src/api.js` |
| `project_deleted` | A project is deleted successfully | `src/api.js` |
| `task_created` | A task is added to a project successfully | `src/api.js` |
| `task_status_changed` | A task moves to a different workflow status | `src/api.js` |
| `task_completed` | A task reaches the done status | `src/api.js` |
| `task_deleted` | A task is deleted successfully | `src/api.js` |
| `task_assigned` | A task assignment changes | `src/api.js` |
| `settings_updated` | Account preference settings are saved | `src/api.js` |
| `data_reset` | The current team member resets local application data | `src/pages/settings.js` |
| `$pageview` | A hash-router route is resolved in the SPA | `src/router.js` |

## Identity

Identification was wired. Successful login and application startup identify the persisted user with the stable existing user ID; email, name, and role are person properties rather than event properties. Account switching resets before identifying the replacement, and logout resets the PostHog session. This was verified by source review, not by observing live identity calls or events.

## Error tracking

`src/posthog.js` imports the `posthog-js` exception autocapture extension and enables unhandled error and unhandled promise rejection capture after initialization. Console-error capture remains disabled. Runtime exception delivery was not observed.

## Dashboard

[Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1926596)

The dashboard contains four saved insights: a team workflow funnel, core workflow activity trends, task status changes breakdown, and task completion trend. PostHog confirmed dashboard ID `1926596` and insight IDs `10578455`, `10578456`, `10578457`, and `10578458`. The definitions use the instrumented event names, but ingestion was not verified.

## Verification and unresolved issues

- `npm install` completed successfully and dependencies were already resolved.
- `npm run build` passed before and after the router pageview fix; Vite transformed 22 modules and emitted the production bundle.
- No lint or typecheck scripts are defined in `package.json`, and tests were not run.
- The run did not verify that browser events reached PostHog. Before relying on the dashboard, exercise login, project/task, settings, reset, and navigation flows in a real browser and confirm events in PostHog.
- `npm install` reported four high-severity dependency audit findings and pending install-script approvals for `core-js` and `esbuild`. They did not block the build and were not changed.
- No attribution issue or `DISTINCT_ID` placeholder was reported by the handoffs.

## Before you merge

- [ ] Run the full production build and fix any lint or type errors introduced by the generated integration; the run verified `npm run build`, but no lint or typecheck scripts exist.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures, and tests were not run during this setup.
- [ ] Confirm `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` are set in every deployment environment, not only in local `.env`; the exact names are documented in `.env.example`.
- [ ] Exercise the authenticated returning-user path and confirm startup identification in `src/main.js` preserves attribution across refreshes.
- [ ] Exercise the instrumented workflows and confirm the events listed above, plus `$pageview`, arrive in PostHog; a passing build alone does not prove event delivery.
