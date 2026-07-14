# PostHog post-wizard report

The wizard has completed a JavaScript web PostHog integration for this TrackFlow demo app. The setup installs `posthog-js`, initializes PostHog from Vite environment variables, identifies returning authenticated users on app load, identifies users again after login, resets identity on logout, and adds product analytics plus exception capture around key project-management flows. Instrumentation now covers login, dashboard usage, project lifecycle actions, task workflow actions, settings changes, demo data resets, and logout behavior.

| Event name | Description | File |
| --- | --- | --- |
| `login_submitted` | Tracks when a user submits the sign-in form and whether the attempt succeeds. | `src/pages/login.js` |
| `dashboard_viewed` | Tracks when an authenticated user loads the dashboard overview. | `src/pages/dashboard.js` |
| `project_created` | Tracks when a user creates a new project from the projects page. | `src/pages/projects.js` |
| `project_deleted` | Tracks when a user deletes a project. | `src/pages/projects.js` |
| `project_detail_viewed` | Tracks when a user opens a specific project workspace. | `src/pages/project-detail.js` |
| `task_created` | Tracks when a new task is added to a project. | `src/pages/project-detail.js` |
| `task_status_changed` | Tracks when a task is moved between workflow states. | `src/pages/project-detail.js` |
| `task_assigned` | Tracks when a task is assigned or unassigned. | `src/pages/project-detail.js` |
| `task_deleted` | Tracks when a task is removed from a project. | `src/pages/project-detail.js` |
| `settings_updated` | Tracks when a user changes application settings preferences. | `src/pages/settings.js` |
| `app_data_reset` | Tracks when a user resets the demo workspace data to defaults. | `src/pages/settings.js` |
| `user_logged_out` | Tracks when a user signs out from the application shell. | `src/components/shell.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846739)
- [Successful logins (wizard)](https://us.posthog.com/project/483112/insights/6NZQd39W)
- [Login to project creation funnel (wizard)](https://us.posthog.com/project/483112/insights/ERGur1i2)
- [Projects created (wizard)](https://us.posthog.com/project/483112/insights/SWZFNZnj)
- [Task assignment activity (wizard)](https://us.posthog.com/project/483112/insights/BDoUai8W)
- [Task workflow events (wizard)](https://us.posthog.com/project/483112/insights/QN1brZaQ)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here (`VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST`) to `.env.example` and any bootstrap docs or scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or bundler upload) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — this integration does so on app load when a stored user exists, and that behavior should be preserved in future auth changes.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
