<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this TrackFlow SaaS dashboard. The project is a client-side Vite + vanilla JavaScript SPA. A new `src/posthog.js` module was created to initialize PostHog using environment variables (`VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`), and `posthog-js` was installed as a dependency. User identification is called on login, on page refresh for already-authenticated users, and reset on logout. Exception tracking is added to key error boundaries (login failures and project/task creation failures).

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in to TrackFlow | `src/pages/login.js` |
| `user_signed_out` | User clicks Sign Out from the app shell | `src/components/shell.js` |
| `project_created` | User creates a new project | `src/pages/projects.js` |
| `project_deleted` | User deletes a project | `src/pages/projects.js` |
| `task_created` | User adds a new task to a project | `src/pages/project-detail.js` |
| `task_status_updated` | User moves a task to a different status column | `src/pages/project-detail.js` |
| `task_deleted` | User deletes a task from a project | `src/pages/project-detail.js` |
| `task_assigned` | User assigns a task to a team member | `src/pages/project-detail.js` |
| `settings_updated` | User changes a preference setting (theme or notifications) | `src/pages/settings.js` |
| `data_reset` | User resets all app data to defaults | `src/pages/settings.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1344803)
  - [Churn Signals](https://us.posthog.com/project/2/insights/7259995)
  - [Team Collaboration Activity](https://us.posthog.com/project/2/insights/7259994)
  - [Subscription Activity](https://us.posthog.com/project/2/insights/7259993)
  - [User Acquisition](https://us.posthog.com/project/2/insights/7259992)
  - [Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/7259991)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
