<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrackFlow, a client-side Vite SPA for project management. PostHog is initialized via `src/posthog.js` using environment variables and imported into all relevant pages. User identification is called on login and on page load (if a session already exists), and `posthog.reset()` is called on sign-out. Error tracking via `captureException` is added at all key failure boundaries.

| Event | Description | File |
|---|---|---|
| `login_succeeded` | User successfully signed in | `src/pages/login.js` |
| `login_failed` | User attempted to sign in with invalid credentials | `src/pages/login.js` |
| `signed_out` | User signed out of the application | `src/components/shell.js` |
| `project_created` | User created a new project | `src/pages/projects.js` |
| `project_deleted` | User deleted a project and all its tasks | `src/pages/projects.js` |
| `project_viewed` | User opened a project detail view (top of task management funnel) | `src/pages/project-detail.js` |
| `task_created` | User added a new task to a project | `src/pages/project-detail.js` |
| `task_status_updated` | User moved a task to a different status column | `src/pages/project-detail.js` |
| `task_deleted` | User deleted a task from a project | `src/pages/project-detail.js` |
| `task_assigned` | User assigned a task to a team member | `src/pages/project-detail.js` |
| `settings_updated` | User changed a preference setting (theme or notifications) | `src/pages/settings.js` |
| `data_reset` | User reset all app data to defaults | `src/pages/settings.js` |

## Next steps

Build an **Analytics basics** dashboard in PostHog with these recommended insights:

- **Login conversion funnel** — Funnel from `login_succeeded` → `project_created`: [Create insight](https://us.posthog.com/project/2/insights/new)
- **Task completion funnel** — Funnel from `project_viewed` → `task_created` → `task_status_updated`: [Create insight](https://us.posthog.com/project/2/insights/new)
- **Login success vs failure trend** — Trends comparing `login_succeeded` and `login_failed` over time: [Create insight](https://us.posthog.com/project/2/insights/new)
- **Churn signal: sign-outs** — Trend of `signed_out` events over time: [Create insight](https://us.posthog.com/project/2/insights/new)
- **Settings engagement** — Trend of `settings_updated` and `data_reset` events: [Create insight](https://us.posthog.com/project/2/insights/new)

Once you've created each insight, add them all to a new dashboard named **Analytics basics** at: [New dashboard](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
