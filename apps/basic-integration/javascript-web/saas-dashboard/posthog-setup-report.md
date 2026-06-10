<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrackFlow, a Vite-based client-side JavaScript SaaS dashboard. PostHog is initialized in `src/main.js` using environment variables, with user identification called immediately on page load for returning sessions. Ten business-critical events are now captured across six files, covering the full user lifecycle from sign-in through project and task management.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully logs in. Calls `posthog.identify()` to link events to a known user. | `src/pages/login.js` |
| `user_signed_out` | User clicks Sign Out. Calls `posthog.reset()` to unlink future events. | `src/components/shell.js` |
| `project_created` | User creates a new project — key activation event. | `src/pages/projects.js` |
| `project_deleted` | User deletes a project and all its tasks — potential churn signal. | `src/pages/projects.js` |
| `task_created` | User adds a new task to a project, capturing priority. | `src/pages/project-detail.js` |
| `task_status_updated` | User moves a task between statuses (todo → in_progress → done). | `src/pages/project-detail.js` |
| `task_deleted` | User deletes a task. | `src/pages/project-detail.js` |
| `task_assigned` | User assigns or unassigns a task to a team member. | `src/pages/project-detail.js` |
| `settings_updated` | User changes a preference (theme, email notifications, weekly digest). | `src/pages/settings.js` |
| `data_reset` | User resets all data to defaults — strong frustration/churn signal. | `src/pages/settings.js` |

Error tracking via `posthog.captureException()` was added to the login form and project/task creation flows.

## Next steps

We recommend building the following insights in PostHog to monitor user behavior:

- **[User sign-ins over time](https://us.posthog.com/project/2/insights/new)** — Trends of `user_signed_in` by day to track engagement.
- **[Activation funnel](https://us.posthog.com/project/2/insights/new)** — Funnel from `user_signed_in` → `project_created` → `task_created` to measure activation rate.
- **[Task activity](https://us.posthog.com/project/2/insights/new)** — Stacked trends of `task_created`, `task_status_updated`, and `task_deleted` to track productivity.
- **[Churn signals](https://us.posthog.com/project/2/insights/new)** — Trends of `project_deleted` and `data_reset` to catch at-risk users.
- **[Settings adoption](https://us.posthog.com/project/2/insights/new)** — Breakdown of `settings_updated` by `setting` property to see which preferences users change most.

Build these into a dashboard: [PostHog Dashboards](https://us.posthog.com/project/2/dashboard)

Browse incoming events: [Event Explorer](https://us.posthog.com/project/2/data-management/events)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
