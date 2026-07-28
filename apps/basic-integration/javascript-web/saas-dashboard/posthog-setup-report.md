# PostHog setup report

PostHog browser analytics, authenticated-user identity, exception autocapture, nine product events, and a starter dashboard were added to the TrackFlow JavaScript web app.

## What was installed and initialized

- Installed `posthog-js` with npm; `package.json` and `package-lock.json` were updated.
- `src/posthog.js` is the single browser initialization point. It reads `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` from `import.meta.env`, initializes only when both are present, and reports a development-only missing-variable error while production remains a no-op.
- `src/main.js` imports the shared client before router startup. Autocapture remains enabled by default.
- The real environment values were configured in `.env` through wizard tooling; `.env.example` documents `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`.
- No CSP was present or changed.

## Events instrumented

These nine events are defined in `.posthog-wizard-cache/.posthog-events.json` and captured from `src/api.js` after successful mutations, except logout, which is captured before identity reset.

| Event name | What it measures | File |
|---|---|---|
| `user_logged_in` | An authenticated team member successfully signs in. | `src/api.js` |
| `user_logged_out` | An authenticated team member signs out. | `src/api.js` |
| `project_created` | A team member creates a project. | `src/api.js` |
| `project_deleted` | A team member deletes a project. | `src/api.js` |
| `task_created` | A team member adds a task to a project. | `src/api.js` |
| `task_status_updated` | A team member moves a task between workflow statuses. | `src/api.js` |
| `task_deleted` | A team member deletes a task from a project. | `src/api.js` |
| `task_assignee_updated` | A team member assigns or unassigns a task. | `src/api.js` |
| `settings_updated` | A team member saves one or more application preferences. | `src/api.js` |

The run verified nine matching `posthog.capture` calls in `src/api.js`. It did **not** exercise the running application or observe events arriving in PostHog, so ingestion and production delivery remain unconfirmed.

## User identification

Identification was wired. `src/api.js` calls `posthog.identify()` after successful login with the stable team-member ID and person properties for email, name, and role. `src/main.js` repeats identification for a persisted current user on page refresh. Logout calls `posthog.reset()`, and direct account switching resets before identifying the new account.

The run did not verify identity or event attribution in a live browser session. The stable-ID assumption is based on the simulated team-member records in the app.

## Error tracking

`src/posthog.js` imports PostHog's exception-autocapture extension and enables capture of unhandled errors and unhandled promise rejections. Console-error capture remains disabled, and no additional manual handlers were added. The run verified the configuration in source but did not trigger an error or observe an exception event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918265)

The dashboard contains five saved insights covering authenticated activity, projects created, task workflow activity, task assignments, and the login-to-project-creation funnel. The definitions use the captured event names and may remain empty until the application sends events.

## Build and conflicts

The review step ran `npm install` and `npm run build`. The production build passed with Vite 6.4.1, transforming 22 modules and generating the production bundle. No lint or typecheck script is defined in `package.json`, and tests were not run. Production event delivery was not exercised.

The full recorded dependency conflict is: npm reports four existing high-severity audit vulnerabilities and pending install-script approval warnings for core-js and esbuild, but installation and the production build both succeed. These warnings did not block the integration or build.

## Before you merge

- [ ] Run the full production build again and fix any lint or type errors introduced by the generated code; the recorded review found no lint or typecheck script. Check `package.json` scripts and the integration files `src/posthog.js`, `src/main.js`, and `src/api.js`.
- [ ] Run the test suite, if one is added or available in the deployment environment, and update mocks or fixtures for the instrumented API methods in `src/api.js`.
- [ ] Set `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` in every deploy environment, not only local `.env`; verify the names in `.env.example` and the reads in `src/posthog.js`.
- [ ] If authentication behavior changes, verify the returning-visitor path in `src/main.js` and the login/logout transitions in `src/api.js` still identify stable users and reset on logout.
- [ ] Exercise login, logout, project, task, assignment, and settings flows in a real browser and confirm the nine events arrive in PostHog; this run only verified source calls and did not observe ingestion.
- [ ] If the app is deployed with minified browser bundles, configure source-map upload in CI so production exception stack traces de-minify; the current run did not configure source-map upload.
