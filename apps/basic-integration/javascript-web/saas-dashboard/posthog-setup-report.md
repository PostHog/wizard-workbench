# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the TrackFlow SaaS dashboard. `posthog-js` was installed and initialised via a shared `src/posthog.js` singleton that reads credentials from environment variables. Six source files were updated to capture 10 distinct user-action events covering the full lifecycle: authentication, project management, task operations, and settings changes. User identification runs on every successful login so that all subsequent events are attributed to the correct person profile. `posthog.reset()` is called on logout to clear the local anonymous session. Exception capture is wired into the login and project-creation error paths.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User authenticated via the login form; also triggers `identify()` | `src/pages/login.js` |
| `user_logged_out` | User clicked Sign Out; triggers `posthog.reset()` | `src/components/shell.js` |
| `project_created` | New project submitted and created successfully | `src/pages/projects.js` |
| `project_deleted` | Project (and all its tasks) deleted after confirmation | `src/pages/projects.js` |
| `task_created` | Task added to a project's kanban board | `src/pages/project-detail.js` |
| `task_status_updated` | Task moved to a new status column (todo / in_progress / done) | `src/pages/project-detail.js` |
| `task_deleted` | Task removed from the kanban board | `src/pages/project-detail.js` |
| `task_assigned` | Task assigned or unassigned to a team member | `src/pages/project-detail.js` |
| `settings_updated` | User changed a preference (theme, email notifications, weekly digest) | `src/pages/settings.js` |
| `data_reset` | User reset all application data to defaults | `src/pages/settings.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/991016)

Suggested insights to add to the dashboard:

1. **Login trend** — Trends: `user_logged_in` over time to track daily/weekly active users.
2. **Login → Project created funnel** — Funnel: `user_logged_in` → `project_created` to measure onboarding conversion.
3. **Task completion rate** — Trends: `task_status_updated` filtered to `new_status = done` over time.
4. **Project churn** — Trends: `project_deleted` over time to spot churn signals.
5. **Settings engagement** — Trends: `settings_updated` broken down by `setting` property to see which preferences users change most.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
