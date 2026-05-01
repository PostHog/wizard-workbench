<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your TrackFlow SaaS dashboard. Here is a summary of what was added:

- **`src/posthog.js`** (new file): Initializes the PostHog JS SDK using `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables. This is the single source of truth for the PostHog instance, imported by all other files.
- **`src/main.js`**: Imports and starts PostHog; listens to `hashchange` events to capture `$pageview` on every route change; re-identifies the current user if one is already logged in from a previous session.
- **`src/pages/login.js`**: Calls `posthog.identify()` with the user's ID, name, and role on successful login; captures `user_logged_in`; captures any login exception with `posthog.captureException()`.
- **`src/components/shell.js`**: Captures `user_logged_out` and calls `posthog.reset()` on sign-out to unlink future events from the current user.
- **`src/pages/projects.js`**: Captures `project_created` (with project ID and name) on project creation; captures `project_deleted` (with project ID) when a project is deleted.
- **`src/pages/project-detail.js`**: Captures `task_added` (with project ID, task ID, priority); `task_status_updated` (with new status); `task_assigned` (with assigned boolean); `task_deleted`.
- **`src/pages/settings.js`**: Captures `settings_updated` for each preference change (theme, email notifications, weekly digest); captures `data_reset` when the user resets all data.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` — never committed to source control.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully signs in; triggers identify | `src/pages/login.js` |
| `user_logged_out` | User clicks Sign Out; triggers reset | `src/components/shell.js` |
| `project_created` | User creates a new project | `src/pages/projects.js` |
| `project_deleted` | User deletes a project (churn signal) | `src/pages/projects.js` |
| `task_added` | User adds a new task to a project | `src/pages/project-detail.js` |
| `task_status_updated` | Task moved to a new status (todo/in_progress/done) | `src/pages/project-detail.js` |
| `task_assigned` | Task assigned or unassigned to a team member | `src/pages/project-detail.js` |
| `task_deleted` | User deletes a task | `src/pages/project-detail.js` |
| `settings_updated` | User changes a preference (theme, notifications) | `src/pages/settings.js` |
| `data_reset` | User resets all app data | `src/pages/settings.js` |

## Next steps

Build an **"Analytics basics"** dashboard in PostHog with these five insights to monitor user behavior:

1. **[User Logins trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"user_logged_in","type":"events"}]&date_from=-30d)** — Daily active users signing in over the last 30 days.

2. **[Project Creation trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"project_created","type":"events"}]&date_from=-30d)** — How many projects are being created — your key growth metric.

3. **[Login → Project Created funnel](https://us.posthog.com/project/2/insights/new#insight=FUNNELS&events=[{"id":"user_logged_in","type":"events","order":0},{"id":"project_created","type":"events","order":1}]&date_from=-30d)** — Conversion rate from login to creating a first project.

4. **[Task Completion trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"task_status_updated","type":"events","properties":[{"key":"status","value":"done","operator":"exact","type":"event"}]}]&date_from=-30d)** — How many tasks are being marked done each day.

5. **[Project Deletions trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"project_deleted","type":"events"}]&date_from=-30d)** — A churn signal: track how often projects are removed.

You can also browse all events in [PostHog's event explorer](https://us.posthog.com/project/2/events).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_web/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
