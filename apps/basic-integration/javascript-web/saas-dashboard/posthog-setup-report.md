# PostHog setup report

PostHog browser analytics was installed and initialized for the Vite SaaS dashboard, with authenticated product-event capture, exception tracking, and a starter dashboard.

## Installed and initialized

- Installed the `posthog-js` client package with npm; `package.json` and `package-lock.json` were updated.
- Initialized PostHog once in `src/posthog.js` using the Vite environment variables `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`.
- Imported the initialization module from `src/main.js` before application startup.
- The environment keys are present in `.env` and documented in `.env.example`. Their deployment values still need to be configured wherever the app is built and served.
- No server-side package or sender was added; this is a client-side Vite application.

## Events instrumented

These are the nine event call sites documented by the run. The run verified the call sites and their contracts, but did **not** observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `login_completed` | An authenticated user completes sign-in. | `src/api.js` |
| `project_created` | An authenticated user creates a project. | `src/api.js` |
| `project_deleted` | An authenticated user deletes a project. | `src/api.js` |
| `task_created` | An authenticated user creates a task, including project, task, and priority metadata. | `src/api.js` |
| `task_status_updated` | An authenticated user changes a task status. | `src/api.js` |
| `task_deleted` | An authenticated user deletes a task. | `src/api.js` |
| `task_assignee_updated` | An authenticated user changes a task assignee. | `src/api.js` |
| `preferences_updated` | An authenticated user updates preferences. | `src/api.js` |
| `data_reset` | An authenticated user resets application data. | `src/pages/settings.js` |

The captures use stable internal identifiers and categorical metadata; the run reports that user-entered titles, descriptions, names, and email addresses are not event properties.

## Identification

User identification is wired. After simulated login succeeds and a verified `currentUser` exists, `src/api.js` calls `posthog.identify(user.id, { email, name, role })`. The stable user ID is used as the distinct ID, while email and name are person properties. Logout calls `posthog.reset()` before clearing local state. The run assumed the demo IDs are stable application identifiers; production identity behavior was not independently verified.

## Error tracking

`src/posthog.js` enables `capture_exceptions: true` in the shared PostHog initialization, so SDK-supported uncaught exception capture is centralized. The run verified the configuration but did not trigger an exception or observe exception telemetry arriving in PostHog.

## Dashboard

The starter dashboard **Analytics basics (wizard)** was created in project 483112 with five tagged insights covering sign-ins by role, project creation, task creation by priority, task status updates, and a project-to-task activation funnel. The dashboard and insights were created from the event contracts and may initially be empty until events arrive.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1901817)

## Verification and unresolved items

### Verified by this run

- `npm install` completed successfully and dependencies were current.
- `npm run build` completed successfully with Vite 6.4.1, transforming 21 modules and producing the `dist` bundle.
- The PostHog environment keys were present.
- The event contract matched nine `posthog.capture` call sites.
- No lint or typecheck scripts are defined in `package.json`.
- No Content-Security-Policy was found in the inspected Vite configuration or initialization files.

### Not verified by this run

- No event or exception was observed arriving in PostHog; the dashboard data is therefore unconfirmed.
- The app was not started interactively and no end-to-end analytics delivery test was run.
- Returning-visitor identity behavior was not separately exercised, although login identification is wired.

### Build and dependency conflicts

No build conflict occurred: the production build passed. npm reported four existing high-severity audit findings and pending install-script approval notices. They did not block installation or the build, but should be reviewed separately before release.

## Before you merge

- [ ] Run the full production build again and fix any lint or type errors introduced by the integration; no lint or typecheck scripts are currently available in `package.json`.
- [ ] Run the test suite, if one is added or available in the deployment environment, and update mocks or fixtures for the instrumented API and settings call sites.
- [ ] Set `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` in every deployment/build environment, not only the local `.env`; verify the names against `.env.example` and the initialization in `src/posthog.js`.
- [ ] Exercise login and the instrumented product actions in a running build, then confirm the corresponding events arrive in PostHog and populate the dashboard; inspect the capture calls in `src/api.js` and `src/pages/settings.js` if any are missing.
- [ ] Trigger an intentional test exception in a safe environment and confirm exception telemetry arrives; inspect `capture_exceptions: true` in `src/posthog.js`.
- [ ] Review the four existing high-severity npm audit findings and pending install-script approvals before release; inspect the dependency changes in `package.json` and `package-lock.json`.
