<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TrackFlow SaaS dashboard application (Vite + vanilla JS SPA). PostHog is initialized once in a dedicated `src/posthog.js` singleton module and imported wherever events need to be captured. User identification is performed on login and on page refresh (if the user is already authenticated), and `posthog.reset()` is called on logout to unlink future events. Exception autocapture is enabled globally, and explicit `captureException` calls guard key error-prone flows.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticated and logged into the app | `src/pages/login.js` |
| `user_signed_out` | User clicked Sign Out and was logged out of the app | `src/components/shell.js` |
| `project_created` | User created a new project | `src/pages/projects.js` |
| `project_deleted` | User deleted an existing project and all its tasks | `src/pages/projects.js` |
| `task_added` | User added a new task to a project | `src/pages/project-detail.js` |
| `task_completed` | User moved a task to the done status | `src/pages/project-detail.js` |
| `task_status_updated` | User moved a task to a non-completion status (todo or in_progress) | `src/pages/project-detail.js` |
| `task_deleted` | User deleted a task from a project | `src/pages/project-detail.js` |
| `task_assigned` | User assigned or reassigned a task to a team member | `src/pages/project-detail.js` |
| `settings_updated` | User changed a settings preference (theme, notifications) | `src/pages/settings.js` |
| `data_reset` | User reset all application data to defaults — strong churn signal | `src/pages/settings.js` |

## Next steps

To monitor user behavior with these events, create an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Daily active users** — Unique users who fired `user_signed_in` over time (trend chart)
2. **Project creation funnel** — `user_signed_in` → `project_created` → `task_added` (funnel insight)
3. **Task completion rate** — `task_added` vs `task_completed` counts over time (trend chart)
4. **Churn risk signals** — `data_reset` + `user_signed_out` combined (trend chart)
5. **Settings engagement** — `settings_updated` breakdown by `setting` property (bar chart)

Visit your PostHog project to create these insights:
- PostHog project: https://us.posthog.com/project/238460/insights

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
