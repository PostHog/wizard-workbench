# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TrackFlow SaaS dashboard. PostHog is initialized via a singleton module (`src/posthog.js`) imported early in `src/main.js`, ensuring it's ready before any events fire. User identification is handled on login via `posthog.identify()` with stable user IDs and person properties, and `posthog.reset()` is called on logout to cleanly unlink sessions. Eleven business events are tracked across five files, covering the full user lifecycle from login to project and task management.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully signs in to TrackFlow. | `src/pages/login.js` |
| `login_failed` | Fired when a login attempt fails due to invalid credentials. | `src/pages/login.js` |
| `user_logged_out` | Fired when a user clicks the Sign Out button. | `src/components/shell.js` |
| `project_created` | Fired when a user successfully creates a new project. | `src/pages/projects.js` |
| `project_deleted` | Fired when a user deletes a project and all its tasks. | `src/pages/projects.js` |
| `task_created` | Fired when a user adds a new task to a project. | `src/pages/project-detail.js` |
| `task_status_changed` | Fired when a task is moved to a different status column on the board. | `src/pages/project-detail.js` |
| `task_assigned` | Fired when a task is assigned or reassigned to a team member. | `src/pages/project-detail.js` |
| `task_deleted` | Fired when a user deletes a task from a project. | `src/pages/project-detail.js` |
| `settings_updated` | Fired when a user changes a preference setting such as theme or notifications. | `src/pages/settings.js` |
| `data_reset` | Fired when a user resets all application data to defaults from the danger zone. | `src/pages/settings.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1829208)
- **Daily Logins (wizard):** [View insight](https://us.posthog.com/project/483112/insights/iiPh0uCu) — Login volume trend over the last 30 days.
- **Login to Project Creation Funnel (wizard):** [View insight](https://us.posthog.com/project/483112/insights/6kTJPpaw) — Conversion rate from login to creating a project.
- **Project Activity (wizard):** [View insight](https://us.posthog.com/project/483112/insights/rZS1l4tO) — Projects created vs deleted over time.
- **Task Status Changes by Status (wizard):** [View insight](https://us.posthog.com/project/483112/insights/P9ohC2wS) — Task moves broken down by target status (todo, in_progress, done).
- **Task Creation to Completion Funnel (wizard):** [View insight](https://us.posthog.com/project/483112/insights/qyTzZxtL) — How many tasks created go on to have their status updated.

Dashboard subscription and alerts were not configured (user skipped).

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
