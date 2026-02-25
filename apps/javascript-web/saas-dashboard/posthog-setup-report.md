<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TrackFlow project. A new `src/posthog.js` module was created to initialize the `posthog-node` client (reading API key and host from Vite environment variables), and helper functions `trackEvent`, `identifyUser`, and `captureException` were exported for use across the app. Five existing source files were updated with targeted PostHog calls — no existing logic was altered or removed. User identification (`identifyUser`) is called on sign-in so all subsequent events are correlated to a named user. Exception capture is added at login failure and project/task creation error boundaries.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully logs in. Also calls `identifyUser` to set name, email, and role. | `src/pages/login.js` |
| `user_signed_out` | Fired when a user clicks the Sign Out button in the app shell. | `src/components/shell.js` |
| `project_created` | Fired when a user successfully creates a new project, with `project_id` and `project_name`. | `src/pages/projects.js` |
| `project_deleted` | Fired when a user confirms deletion of a project, with `project_id`. | `src/pages/projects.js` |
| `task_created` | Fired when a user adds a new task, with `task_id`, `task_title`, `priority`, `project_id`, `project_name`. | `src/pages/project-detail.js` |
| `task_status_updated` | Fired when a task is moved between columns, with `task_id`, `previous_status`, `new_status`, `project_id`. | `src/pages/project-detail.js` |
| `task_deleted` | Fired when a task is deleted, with `task_id`, `task_title`, `task_status`, `priority`, `project_id`. | `src/pages/project-detail.js` |
| `task_assigned` | Fired when a task is assigned or unassigned, with `task_id`, `assignee_id`, `project_id`. | `src/pages/project-detail.js` |
| `settings_updated` | Fired when a preference is changed, with `setting` (theme/email_notifications/weekly_digest) and `value`. | `src/pages/settings.js` |
| `data_reset` | Fired when a user resets all application data from the Danger Zone. | `src/pages/settings.js` |

## Next steps

Your PostHog project is now receiving events. To explore the data, visit your PostHog project and build insights around these events:

- **Daily Active Users** – Trend of `user_signed_in` over time
- **Project Creation Funnel** – Funnel from `user_signed_in` → `project_created`
- **Task Completion Rate** – Trend of `task_status_updated` where `new_status = done`
- **Project Churn** – Trend of `project_deleted` events
- **Feature Engagement** – Stacked trend of `task_created`, `task_assigned`, `settings_updated`

Visit your PostHog dashboard at: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
