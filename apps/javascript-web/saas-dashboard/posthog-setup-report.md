<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the TrackFlow JavaScript SaaS dashboard. The following changes were made:

- **Created `src/posthog.js`**: Initializes the PostHog SDK using `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` environment variables.
- **Edited `src/main.js`**: Imports the PostHog init module and identifies the current user on page load if they are already logged in (e.g. after a page refresh).
- **Edited `src/pages/login.js`**: Calls `posthog.identify()` with user ID, name, email, and role on successful login; captures `user_signed_in`; captures `login_failed` for invalid credentials; captures exceptions for unexpected errors.
- **Edited `src/components/shell.js`**: Captures `user_signed_out` before logout and calls `posthog.reset()` to unlink the session from the user.
- **Edited `src/pages/projects.js`**: Captures `project_created` (with `project_id`) and `project_deleted` (with `project_id`); captures exceptions on errors.
- **Edited `src/pages/project-detail.js`**: Captures `task_created` (with `project_id` and `priority`), `task_status_updated` (with `project_id`, `task_id`, `new_status`), `task_assigned` (with `project_id`, `task_id`, `assigned`), and `task_deleted` (with `project_id`, `task_id`).
- **Edited `src/pages/settings.js`**: Captures `settings_theme_changed` (with `theme`), `settings_notifications_changed` (with `setting` and `enabled`), and `data_reset`.
- **Created `.env`**: Added `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` with the project credentials.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully logs in with a valid email | `src/pages/login.js` |
| `login_failed` | User attempted to log in but credentials were invalid | `src/pages/login.js` |
| `user_signed_out` | User clicks Sign Out from the app shell | `src/components/shell.js` |
| `project_created` | User creates a new project via the New Project modal | `src/pages/projects.js` |
| `project_deleted` | User confirms deletion of a project | `src/pages/projects.js` |
| `task_created` | User adds a new task to a project | `src/pages/project-detail.js` |
| `task_status_updated` | User moves a task to a different status column | `src/pages/project-detail.js` |
| `task_deleted` | User deletes a task from a project | `src/pages/project-detail.js` |
| `task_assigned` | User assigns a task to a team member (or unassigns it) | `src/pages/project-detail.js` |
| `settings_theme_changed` | User changes the UI theme (light/dark) | `src/pages/settings.js` |
| `settings_notifications_changed` | User toggles email notifications or weekly digest preferences | `src/pages/settings.js` |
| `data_reset` | User confirms reset of all app data to defaults | `src/pages/settings.js` |

## Next steps

We've set up analytics tracking for the key events above. To visualize and monitor these in PostHog, create an "Analytics basics" dashboard with these suggested insights:

1. **Login funnel** — Funnel insight: `user_signed_in` → `project_created` → `task_created` (conversion funnel from login to active engagement)
2. **Daily active users** — Trends insight: unique users per day performing `user_signed_in`
3. **Churn signals** — Trends insight: `user_signed_out` and `data_reset` events over time
4. **Project activity** — Trends insight: `project_created` and `project_deleted` stacked to show project lifecycle
5. **Task engagement** — Trends insight: `task_created`, `task_status_updated`, and `task_deleted` to measure task workflow adoption

To create insights in PostHog, navigate to [https://us.posthog.com/project/2/insights](https://us.posthog.com/project/2/insights).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_web/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
