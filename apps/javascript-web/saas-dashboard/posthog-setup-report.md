<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for the TrackFlow SaaS dashboard. Here is a summary of all changes made:

- **`src/posthog.js`** (new file): Initializes the PostHog JS SDK using `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables. This module is the single source of truth for the PostHog instance.
- **`src/main.js`**: Imports PostHog, re-identifies already-logged-in users on page refresh, and captures `$pageview` events on hash-based navigation changes.
- **`src/pages/login.js`**: Calls `posthog.identify()` with user ID, name, and role on successful login. Captures `user_logged_in` and `login_failed` events. Calls `posthog.captureException()` on login errors.
- **`src/components/shell.js`**: Captures `user_logged_out` and calls `posthog.reset()` when the user signs out to unlink future events from the current identity.
- **`src/pages/projects.js`**: Captures `project_created` (with project ID) and `project_deleted` (with project ID). Calls `posthog.captureException()` on project creation failure.
- **`src/pages/project-detail.js`**: Captures `task_added` (with project ID and priority), `task_status_updated` (with project ID, task ID, new status), `task_assigned` (with project ID, task ID, assigned boolean), and `task_deleted` (with project ID, task ID). Calls `posthog.captureException()` on task add failure.
- **`src/pages/settings.js`**: Captures `settings_theme_changed` (with theme value), `settings_notifications_updated` (with type and enabled state), and `data_reset`.
- **`.env`** (created/updated): Set `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` with your project credentials.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `src/pages/login.js` |
| `login_failed` | Fired when a login attempt fails (invalid credentials) | `src/pages/login.js` |
| `user_logged_out` | Fired when a user clicks Sign Out | `src/components/shell.js` |
| `project_created` | Fired when a new project is created | `src/pages/projects.js` |
| `project_deleted` | Fired when a project is deleted | `src/pages/projects.js` |
| `task_added` | Fired when a task is added to a project | `src/pages/project-detail.js` |
| `task_status_updated` | Fired when a task is moved to a different status column | `src/pages/project-detail.js` |
| `task_deleted` | Fired when a task is deleted from a project | `src/pages/project-detail.js` |
| `task_assigned` | Fired when a task is assigned or unassigned | `src/pages/project-detail.js` |
| `settings_theme_changed` | Fired when the user changes their theme preference | `src/pages/settings.js` |
| `settings_notifications_updated` | Fired when email notifications or weekly digest preference is toggled | `src/pages/settings.js` |
| `data_reset` | Fired when the user resets all app data (danger zone action) | `src/pages/settings.js` |

## Next steps

To build an "Analytics basics" dashboard in PostHog, navigate to your project and create a new dashboard with insights based on the events above. Recommended insights include:

1. **Login conversion funnel** — Funnel: `user_logged_in` → `project_created` → `task_added` → `task_status_updated` (where `new_status = done`)
2. **Daily active users** — Unique users triggering `user_logged_in` over time
3. **Project creation trend** — `project_created` event count over time
4. **Task completion rate** — `task_status_updated` filtered to `new_status = done` vs `task_added`
5. **Churn signal: data reset** — `data_reset` event count over time (indicates frustrated users)

Visit your PostHog project at: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_web/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
