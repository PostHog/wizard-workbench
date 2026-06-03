<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TrackFlow SPA. The `posthog-js` package was installed and a singleton module (`src/posthog.js`) was created to initialize PostHog using environment variables. User identification is set up on login and on page load when a session already exists. `posthog.reset()` is called on logout to unlink future events from the current user. Pageviews are captured manually on every hash-route navigation. Twelve custom events were added across six files covering the full user lifecycle — from sign-in through project and task management to settings changes and churn signals. `posthog.captureException()` was added to all major error handlers.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully logs in | `src/pages/login.js` |
| `user_signed_out` | Fired when a user clicks Sign Out | `src/components/shell.js` |
| `project_created` | Fired when a new project is successfully created | `src/pages/projects.js` |
| `project_deleted` | Fired when a project is deleted | `src/pages/projects.js` |
| `project_viewed` | Fired when a user opens a project detail page (top of task management funnel) | `src/pages/project-detail.js` |
| `task_created` | Fired when a new task is added to a project | `src/pages/project-detail.js` |
| `task_completed` | Fired when a task is moved to done status | `src/pages/project-detail.js` |
| `task_status_changed` | Fired when a task is moved to a non-done status | `src/pages/project-detail.js` |
| `task_deleted` | Fired when a task is deleted from a project | `src/pages/project-detail.js` |
| `task_assigned` | Fired when a task is assigned or reassigned to a team member | `src/pages/project-detail.js` |
| `settings_updated` | Fired when the user changes a preference (theme, notifications, weekly digest) | `src/pages/settings.js` |
| `data_reset` | Fired when the user resets all data to defaults — a strong churn signal | `src/pages/settings.js` |

## Next steps

The PostHog MCP did not have the required scopes to create the dashboard automatically. To create an "Analytics basics" dashboard manually, go to [PostHog Dashboards](/dashboard) and add the following insights:

1. **Sign-in trend** — Trends for `user_signed_in` over time (daily/weekly active users).
2. **Project lifecycle funnel** — Funnel with steps: `user_signed_in` → `project_viewed` → `task_created` → `task_completed`.
3. **Task completion rate** — Trends for `task_completed` vs `task_created` using a formula (`A/B*100`).
4. **Churn signal** — Trends for `data_reset` over time.
5. **Settings engagement** — Trends for `settings_updated` broken down by the `setting` property.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
