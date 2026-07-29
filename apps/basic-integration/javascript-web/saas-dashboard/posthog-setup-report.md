# PostHog setup report

PostHog browser analytics was installed and initialized for the Vite SPA, with identified-user context, ten operational events, global exception autocapture, and a starter dashboard configured.

## What was installed and initialized

- Installed `posthog-js` at `^1.407.8` using npm; `package.json` and `package-lock.json` were updated.
- Initialized the browser singleton in `src/posthog.js`, imported before application startup from `src/main.js`.
- Configuration is read from `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`; the real values were set in the local `.env` through wizard environment tooling and the variable names are documented in `.env.example`.
- Missing configuration remains a production no-op but fails loudly in development with the required descriptive error. Default capture behavior remains enabled.
- User identity uses the existing stable team-member `id`. Login and persisted refresh identify the user with person properties; logout calls `reset()` before local authentication state is cleared.

## Events instrumented

These are configured capture points in the source. The run did not observe events arriving in PostHog, so runtime delivery remains unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A team member successfully signs in | `src/api.js` |
| `user_logged_out` | An authenticated team member signs out | `src/api.js` |
| `project_created` | A project is successfully created | `src/api.js` |
| `project_deleted` | A project is successfully deleted | `src/api.js` |
| `task_created` | A task is successfully added to a project | `src/api.js` |
| `task_status_updated` | A task is moved to a different workflow status | `src/api.js` |
| `task_deleted` | A task is successfully deleted | `src/api.js` |
| `task_assigned` | A task assignment changes, including unassignment | `src/api.js` |
| `settings_updated` | A user preference is successfully saved | `src/api.js` |
| `data_reset` | A user confirms restoration of demo-data defaults | `src/pages/settings.js` |

Capture calls are guarded when optional production configuration is absent and use operational, non-PII properties. User-entered titles, descriptions, names, emails, and assignee identifiers are excluded from event properties.

## Identification

Identification was wired, not skipped. Successful login identifies the existing stable team-member `id`; persisted identity is restored before routing on refresh; logout resets the PostHog identity boundary. The run did not perform a live login or refresh against PostHog, so the resulting identify calls and event attribution were not observed in the service.

## Error tracking

`src/posthog.js` imports the `posthog-js` exception-autocapture extension and starts exception autocapture after initialization with unhandled errors and unhandled promise rejections enabled. The run verified the source configuration and successful production build, but did not observe an exception arriving in PostHog Error Tracking.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924639)

The dashboard contains five tagged insights covering project/task activity, project lifecycle, task operations, workspace activation, and preferences/reset activity. These are definitions over the instrumented events and are expected to populate as data arrives; their data population was not verified during this run.

## Verification and unresolved issues

- `npm install` completed successfully and the dependency tree was lockfile-consistent.
- `npm run build` completed successfully with Vite 6.4.1, transforming 22 modules and producing `dist` assets. This proves the code compiles; it does not prove that events or exceptions flow to PostHog.
- No lint or typecheck scripts exist in `package.json`, so neither was run.
- No browser session, live event delivery check, or error-delivery check was recorded.
- The configured direct ingestion host has no reverse proxy. This is not a correctness failure, but production delivery may be more susceptible to browser ad blocking.
- Installation reported four existing high-severity npm audit vulnerabilities and pending install-script approval for existing `core-js` and `esbuild` dependencies. Installation and the integration build still succeeded; these issues were not resolved by this run.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration. The verified build command was `npm run build`; no lint or typecheck scripts are currently defined in `package.json`.
- [ ] Run the test suite, if one is added or available in CI, and update mocks or fixtures for the instrumented call sites. No test script was present in `package.json` and no suite was run.
- [ ] Confirm `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only local `.env`; review `src/posthog.js` and the deployment configuration.
- [ ] If production needs stronger ingestion reliability, review the direct host configuration and browser ad-blocking risk noted in `src/posthog.js`/deployment settings before release.
- [ ] With authentication enabled, exercise login, persisted refresh, and logout in `src/api.js` and `src/main.js`, then confirm identified users and event attribution in PostHog.
- [ ] Exercise the instrumented success paths in `src/api.js` and the confirmed reset path in `src/pages/settings.js`, then confirm the ten named events arrive in PostHog and populate the dashboard.
- [ ] Trigger a controlled unhandled error or rejected promise through the application and confirm Error Tracking receives it from the exception-autocapture setup in `src/posthog.js`.
- [ ] Review and address the four high-severity npm audit findings and pending install-script approval reported during installation before release, if they are acceptable release blockers for this project.
