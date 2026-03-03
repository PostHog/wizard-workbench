# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TrackFlow SaaS dashboard. The posthog-js SDK was installed and initialized via a dedicated `src/posthog.js` module using Vite environment variables (`VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST`). Event tracking was added to six key source files covering the full user lifecycle: authentication (sign in, sign out), project management (create, delete), task management (add, update status, assign, delete), and settings changes. User identification is performed on login and on page refresh for already-authenticated users, and `posthog.reset()` is called on logout to unlink future events.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticated via the login form | `src/pages/login.js` |
| `login_failed` | Login attempt failed due to invalid credentials | `src/pages/login.js` |
| `user_signed_out` | User clicked Sign Out from the app shell | `src/components/shell.js` |
| `project_created` | User created a new project | `src/pages/projects.js` |
| `project_deleted` | User deleted an existing project and all its tasks | `src/pages/projects.js` |
| `task_added` | User added a new task to a project | `src/pages/project-detail.js` |
| `task_status_updated` | User moved a task to a different status column (todo, in_progress, done) | `src/pages/project-detail.js` |
| `task_assigned` | User assigned (or unassigned) a task to a team member | `src/pages/project-detail.js` |
| `task_deleted` | User deleted a task from a project | `src/pages/project-detail.js` |
| `settings_updated` | User changed a preference setting (theme, notifications, or weekly digest) | `src/pages/settings.js` |
| `data_reset` | User reset all app data to defaults via the Danger Zone | `src/pages/settings.js` |

## Next steps

To monitor user behavior, create an **Analytics basics** dashboard in PostHog with these recommended insights:

1. **Sign-in conversion funnel** — Funnel from `user_signed_in` → `project_created` → `task_added` to measure onboarding activation
2. **Daily active users (sign-ins)** — Trend of `user_signed_in` over time
3. **Project creation rate** — Trend of `project_created` over time
4. **Task completion rate** — Trend of `task_status_updated` where `new_status = done`
5. **Churn signal** — Trend of `data_reset` and `user_signed_out` without a subsequent `user_signed_in`

You can build these at: [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_web/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
