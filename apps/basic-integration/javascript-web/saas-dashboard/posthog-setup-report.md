# PostHog setup report

PostHog browser analytics was installed and initialized for the Vite app, with authenticated identity, ten product events, global exception autocapture, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-js` (`^1.407.5`) in `package.json`; the lockfile was updated by the npm install step.
- `src/posthog.js` reads `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` from Vite environment configuration and initializes the shared client once when both are present. Development reports a missing-variable error; production remains a no-op when unconfigured.
- `src/main.js` imports the shared initialization before router startup.
- `.env.example` documents `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`; the run confirmed both keys are present in the configured `.env` without exposing their values.
- Autocapture remains enabled by default. No CSP changes were needed because the app has no CSP configuration.

## Instrumented events

These are instrumented call sites from `.posthog-wizard-cache/.posthog-events.json`; the run did not launch the app or observe event delivery.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | Authenticated user successfully signs in. | `src/api.js` |
| `user_logged_out` | Authenticated user explicitly signs out. | `src/api.js` |
| `project_created` | User creates a project. | `src/api.js` |
| `project_deleted` | User deletes a project. | `src/api.js` |
| `task_created` | User adds a task to a project. | `src/api.js` |
| `task_status_changed` | User moves a task between workflow statuses. | `src/api.js` |
| `task_deleted` | User deletes a task. | `src/api.js` |
| `task_assigned` | User assigns or unassigns a task. | `src/api.js` |
| `settings_updated` | User changes an application preference. | `src/api.js` |
| `data_reset` | User confirms restoring the demo workspace to defaults. | `src/pages/settings.js` |

Capture calls use operational metadata only; no PII or user-entered content was added to event properties. Calls are emitted after the corresponding state-changing action succeeds.

## Identity

Identification is wired. `src/api.js` identifies successful logins with stable `user.id` and person properties (`email`, `name`, and `role`); `src/main.js` identifies the persisted authenticated user on startup. `src/api.js` resets before direct account switching and on logout. The run verified the call structure and stable-ID usage, but did not exercise login, refresh, switching, or logout in a running browser.

## Error tracking

`src/posthog.js` enables `startExceptionAutocapture` for uncaught errors and unhandled promise rejections. Console-error capture is intentionally disabled. Error delivery was not observed during the run because the app was not started.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918859) contains three saved insights: User login activity, Project creation activity, and Task creation activity. Dashboard creation and attachment were confirmed by PostHog responses. The underlying event flow was not confirmed.

## Verification and unresolved items

- `npm install` completed successfully and dependencies were current.
- `npm run build` passed with Vite 6.4.1, transforming 21 modules and emitting the production bundle. This proves the code compiles; it does **not** prove that events or errors arrive in PostHog.
- No lint or typecheck scripts exist in `package.json`.
- Two parallel insight payload attempts failed due to malformed JSON, but valid individual calls subsequently created the three intended insights. No product conflict remains.
- Event delivery, exception delivery, and runtime identity attribution remain unconfirmed because no browser session was run.

## Before you merge

- [ ] Run the full production build in the target deployment environment and fix any lint or type errors introduced by the integration; the build verified here was `npm run build` and no lint/typecheck scripts exist. Review `src/posthog.js`, `src/main.js`, `src/api.js`, and `src/pages/settings.js`.
- [ ] Run the test suite (if added by the project) and update mocks or fixtures for the instrumented calls in `src/api.js` and `src/pages/settings.js`.
- [ ] Set `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` in every deploy environment, not only locally; check the names documented in `.env.example` and the reads in `src/posthog.js` lines 3–4.
- [ ] In a real browser session, verify login and returning-user attribution using `src/api.js` lines 31–39 and `src/main.js` lines 45–49, then verify logout/account switching at the reset call sites in `src/api.js`.
- [ ] Trigger representative successful actions and confirm the ten events in PostHog, especially `data_reset` at `src/pages/settings.js` line 102; the run only verified call sites, not delivery.
- [ ] Trigger an uncaught error and an unhandled rejection in a safe test environment, then confirm Error Tracking receives them from the setup in `src/posthog.js` lines 10–14.
