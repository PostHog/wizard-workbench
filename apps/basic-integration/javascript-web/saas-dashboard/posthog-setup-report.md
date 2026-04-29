<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TrackFlow SaaS dashboard. `posthog-js` was installed and initialized in `src/main.js` with automatic pageview tracking on every hash-based route change. User identification is called on login and on page refresh for returning users, and `posthog.reset()` is called on logout to unlink future events. Exception capture (`captureException`) was added to login failures and project/task creation error paths.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully signed in with their email | `src/pages/login.js` |
| `login_failed` | User attempted to sign in but credentials were rejected | `src/pages/login.js` |
| `user_logged_out` | User clicked Sign Out to end their session | `src/components/shell.js` |
| `project_created` | User created a new project | `src/pages/projects.js` |
| `project_deleted` | User deleted a project and all its tasks | `src/pages/projects.js` |
| `task_created` | User added a new task to a project | `src/pages/project-detail.js` |
| `task_status_updated` | User moved a task to a different status column | `src/pages/project-detail.js` |
| `task_deleted` | User deleted a task from a project | `src/pages/project-detail.js` |
| `task_assigned` | User assigned or unassigned a task to a team member | `src/pages/project-detail.js` |
| `settings_updated` | User changed a preference (theme, notifications, digest) | `src/pages/settings.js` |
| `data_reset` | User triggered a full data reset from the Danger Zone | `src/pages/settings.js` |

## Next steps

Build an "Analytics basics" dashboard in PostHog with these recommended insights:

- **Login funnel** — Funnel from `user_logged_in` → `project_created` → `task_created` to see how users progress through core actions after signing in
- **Daily active users** — Unique users who fired `user_logged_in` over time (trend insight)
- **Project creation rate** — `project_created` event count over time to track growth
- **Task completion rate** — Ratio of `task_status_updated` (status=done) to `task_created` events
- **Churn signal** — Users who triggered `data_reset` or `user_logged_out` without creating anything

Create the dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
