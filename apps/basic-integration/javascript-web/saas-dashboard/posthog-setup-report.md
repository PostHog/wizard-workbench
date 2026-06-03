<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TrackFlow SaaS dashboard. `posthog-js` was installed and initialized via a central `src/posthog.js` module (using the `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` environment variables set in `.env`). The SDK is bootstrapped in `src/main.js` before any routes are rendered. Users are identified by email at login and the identity is reset on logout. Exception capture is wired to login and project/task creation error paths.

| Event | Description | File |
|-------|-------------|------|
| `user signed in` | User successfully authenticated via the login form | `src/pages/login.js` |
| `user signed out` | User clicked Sign Out in the app shell topbar | `src/components/shell.js` |
| `dashboard viewed` | User landed on the dashboard — top of the engagement funnel | `src/pages/dashboard.js` |
| `project created` | User created a new project via the New Project modal | `src/pages/projects.js` |
| `project deleted` | User deleted a project and all its tasks | `src/pages/projects.js` |
| `task created` | User added a new task to a project via the Add Task modal | `src/pages/project-detail.js` |
| `task status updated` | User moved a task to a different status column | `src/pages/project-detail.js` |
| `task assigned` | User assigned or unassigned a task to a team member | `src/pages/project-detail.js` |
| `task deleted` | User deleted a task from a project | `src/pages/project-detail.js` |
| `settings updated` | User changed a preference (theme, email notifications, or weekly digest) | `src/pages/settings.js` |
| `data reset` | User triggered reset of all app data from the Danger Zone section | `src/pages/settings.js` |

## Next steps

We've set up event tracking across all key user actions. Create an "Analytics basics" dashboard in PostHog with these recommended insights:

1. **Login trend** — Trends chart for `user signed in` over time (daily active users)
2. **Project creation funnel** — Funnel: `user signed in` → `dashboard viewed` → `project created` (measures activation)
3. **Task lifecycle** — Trends chart comparing `task created` vs `task status updated` (where `new_status = done`) to track task completion rates
4. **Churn signals** — Trends chart for `project deleted` and `data reset` over time
5. **Settings engagement** — Trends chart for `settings updated` broken down by the `setting` property

You can create these at:
- [New insight](/insights/new)
- [Dashboards](/dashboards)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
