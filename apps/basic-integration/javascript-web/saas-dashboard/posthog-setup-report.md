<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrackFlow, a vanilla JavaScript SPA project management dashboard built with Vite. A central `src/posthog.js` module initializes PostHog using environment variables and exports `identifyUser` and `resetUser` helpers. Users are identified on login and on page load (if already authenticated), and reset on logout. Thirteen events are now captured across six files covering authentication, project management, task lifecycle, and settings changes.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticated and redirected to dashboard | `src/pages/login.js` |
| `login_failed` | Login form submitted but authentication failed | `src/pages/login.js` |
| `user_signed_out` | User clicked Sign Out | `src/components/shell.js` |
| `project_created` | User created a new project via the New Project modal | `src/pages/projects.js` |
| `project_deleted` | User deleted a project after confirmation | `src/pages/projects.js` |
| `project_viewed` | User opened a project's board view (top of task engagement funnel) | `src/pages/project-detail.js` |
| `task_added` | User added a new task with title and priority | `src/pages/project-detail.js` |
| `task_completed` | User moved a task to Done | `src/pages/project-detail.js` |
| `task_status_changed` | User moved a task to a status other than Done | `src/pages/project-detail.js` |
| `task_deleted` | User deleted a task from the board | `src/pages/project-detail.js` |
| `task_assigned` | User assigned or unassigned a team member to a task | `src/pages/project-detail.js` |
| `settings_updated` | User changed a preference (theme, email notifications, weekly digest) | `src/pages/settings.js` |
| `data_reset` | User triggered a full data reset from the Danger Zone | `src/pages/settings.js` |

## Next steps

To set up an **"Analytics basics"** dashboard in PostHog, navigate to [Dashboards](/dashboards) and create one with the following insights:

1. **Daily sign-ins** — Trends: `user_signed_in` over time. Tracks daily active user engagement.
2. **Project → Task engagement funnel** — Funnel: `project_viewed` → `task_added` → `task_completed`. Shows drop-off from viewing a project to completing work.
3. **Task completion trend** — Trends: `task_completed` count over time. Measures team productivity.
4. **Churn risk signals** — Trends: `data_reset` count. A spike here may indicate frustrated users.
5. **Project creation rate** — Trends: `project_created` over time. Tracks new project activity and growth.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
