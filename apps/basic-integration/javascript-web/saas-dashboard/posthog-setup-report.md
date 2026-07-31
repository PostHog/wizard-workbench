# PostHog setup report

PostHog was added to the browser-only Vite app with shared initialization, authenticated-user identity, ten product-event capture call sites, exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` with npm; `package.json` and `package-lock.json` were updated. No server SDK was needed because the app has only a client-side simulated API layer.
- `src/posthog.js` initializes the browser singleton once using `import.meta.env.VITE_POSTHOG_KEY` and `import.meta.env.VITE_POSTHOG_HOST`. Initialization and identity/capture calls are guarded when optional configuration is absent; development reports the specific missing variable while production remains a no-op.
- `src/main.js` imports the initialization module before routing. The real environment values were configured locally through the wizard, and `.env.example` documents both variable names.
- Autocapture remains enabled by default. No CSP was present in the inspected app files, so no CSP changes were made.

## Events instrumented

These are instrumented call sites planned by the run. The run did **not** start the app or observe events arriving in PostHog, so delivery and dashboard population remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | An authenticated team member successfully signs in. | `src/pages/login.js` |
| `project_created` | A team member creates a project. | `src/pages/projects.js` |
| `project_deleted` | A team member confirms deletion of a project. | `src/pages/projects.js` |
| `task_created` | A team member adds a task to a project. | `src/pages/project-detail.js` |
| `task_status_changed` | A team member moves a task to a different workflow status. | `src/pages/project-detail.js` |
| `task_assignee_changed` | A team member assigns or unassigns a task. | `src/pages/project-detail.js` |
| `task_deleted` | A team member deletes a task. | `src/pages/project-detail.js` |
| `theme_changed` | A team member changes their interface theme preference. | `src/pages/settings.js` |
| `notification_preference_changed` | A team member changes an email notification preference. | `src/pages/settings.js` |
| `data_reset` | A team member confirms resetting all application data. | `src/pages/settings.js` |

All captures are guarded, occur after the corresponding local action succeeds, use lower-snake-case names, and exclude PII and user-entered project/task content. No stable-ID placeholders were reported.

## Identity and error tracking

User identification was wired, not skipped. Successful login identifies the stable team-member `id` in `src/pages/login.js`; email, name, and role are person properties rather than event properties. `src/main.js` re-identifies the persisted authenticated user on startup, and `src/components/shell.js` resets PostHog after successful logout. The settings data-reset path resets and re-identifies the restored account.

`src/posthog.js` enables exception autocapture for unhandled browser errors and unhandled promise rejections (`capture_unhandled_errors: true` and `capture_unhandled_rejections: true`). Console-error capture was left disabled. No exception event was observed during this run.

## Dashboard

[Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1935640)

The dashboard contains four tagged insights covering sign-ins/projects, project activation, task workflow activity, and account preferences. Queries use the instrumented events, with a 30-day range and a 14-day ordered funnel window. The dashboard and insights exist, but may remain empty until application events arrive; the run did not verify ingestion.

## Verification and conflicts

- `npm install` completed successfully with dependencies current.
- `npm run build` completed successfully with Vite, transforming 21 modules and emitting `dist` assets. This verifies compilation only; it does not prove that events flow to PostHog.
- No lint or typecheck scripts exist, and no test suite was run.
- npm reported four existing dependency audit vulnerabilities and pending allow-scripts notices for `core-js` and `esbuild`; neither was caused by this integration or blocked the build. This is the complete reported build/dependency conflict.

## Follow-up issues

- Event ingestion and exception delivery remain unresolved because the run never started the app, exercised the handlers, or observed data in PostHog. Until verified, the dashboard cannot be treated as populated or the instrumentation as operational.
- The dashboard uses the planned event names, but its freshness and counts are unconfirmed. Leaving this unresolved costs confidence in product-usage reporting and funnel analysis.
- No CSP exists in the inspected app files. If deployment adds a response-header CSP, it must allow the SDK's required origins or events may be blocked silently.

## Next steps

1. Configure `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` in every deployment environment, not only the local `.env`; keep the real values out of source control.
2. Exercise login, project, task, settings, logout, and reset flows in a deployed or local build, then confirm the ten named events and exception events appear in project 483112 with the expected stable identity.
3. Open the dashboard and verify its tiles populate with the observed events.
4. Review and remediate the four npm audit vulnerabilities and the pending `core-js`/`esbuild` allow-scripts notices according to the application's dependency policy.

## Before you merge

- [ ] Run a full production build and confirm there are no generated-code lint or type errors; the verified build command is `npm run build` (review `src/posthog.js`, `src/main.js`, `src/pages/login.js`, `src/pages/projects.js`, `src/pages/project-detail.js`, `src/pages/settings.js`, and `src/components/shell.js`).
- [ ] Run the test suite, if added by the application, and update mocks or fixtures for the instrumented call sites in `src/pages/login.js`, `src/pages/projects.js`, `src/pages/project-detail.js`, and `src/pages/settings.js`.
- [ ] Set `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` in deployment environments and confirm the names remain documented in `.env.example` (initialization: `src/posthog.js`; entry-point import: `src/main.js`).
- [ ] Because auth and identify are wired, verify the returning-visitor startup path re-identifies the persisted user in `src/main.js` rather than fragmenting onto an anonymous distinct ID.
