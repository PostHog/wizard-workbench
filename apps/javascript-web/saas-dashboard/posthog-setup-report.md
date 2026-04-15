<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TrackFlow SaaS dashboard. `posthog-js` was installed and initialized at app startup via a shared `src/posthog.js` module. PostHog keys are sourced from environment variables (`VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST`) written to `.env`. Exception autocapture is enabled globally. User identification is called on every successful login, and `posthog.reset()` is called on logout to clear the anonymous/identified session. Error tracking via `posthog.captureException()` was added to login and project/task creation failure paths.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated and entered the app | `src/pages/login.js` |
| `user_logged_out` | User clicked Sign Out from the app shell | `src/components/shell.js` |
| `project_created` | User created a new project | `src/pages/projects.js` |
| `project_deleted` | User deleted an existing project and all its tasks | `src/pages/projects.js` |
| `task_created` | User added a new task to a project | `src/pages/project-detail.js` |
| `task_status_updated` | User moved a task to a different status column on the board | `src/pages/project-detail.js` |
| `task_assigned` | User assigned (or unassigned) a task to a team member | `src/pages/project-detail.js` |
| `task_deleted` | User deleted a task from a project | `src/pages/project-detail.js` |
| `settings_updated` | User changed a settings preference (theme, notifications, digest) | `src/pages/settings.js` |
| `data_reset` | User reset all app data to defaults from the Danger Zone | `src/pages/settings.js` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with the following suggested insights:

1. **Login funnel** — Funnel from `user_logged_in` → `project_created` → `task_created` to measure user activation depth
2. **Project creation trend** — Trend of `project_created` over time to track growth in active usage
3. **Task completion rate** — `task_status_updated` filtered to `new_status = done` vs total `task_created` events
4. **Churn signal** — Trend of `user_logged_out` without a preceding `project_created` or `task_created` in the same session
5. **Danger Zone usage** — Trend of `data_reset` events to identify at-risk users

You can create these at: https://us.i.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
