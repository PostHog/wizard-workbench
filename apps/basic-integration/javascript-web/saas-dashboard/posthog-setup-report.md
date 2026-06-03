# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into TrackFlow, a client-side Vite + vanilla JS project management SaaS dashboard. A new `src/posthog.js` module initializes the `posthog-js` SDK using `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` environment variables. Event capture and user identification calls were added across five source files, tracking all key user actions including login/logout, project lifecycle, and task management. Exception capture was added to critical async error paths.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticates and logs in | `src/pages/login.js` |
| `user_signed_out` | User clicks Sign Out and ends their session | `src/components/shell.js` |
| `project_created` | User creates a new project | `src/pages/projects.js` |
| `project_deleted` | User deletes a project and all its tasks | `src/pages/projects.js` |
| `project_viewed` | User opens a project detail page | `src/pages/project-detail.js` |
| `task_added` | User adds a new task to a project | `src/pages/project-detail.js` |
| `task_status_updated` | User moves a task to a new status column | `src/pages/project-detail.js` |
| `task_assigned` | User assigns or unassigns a task | `src/pages/project-detail.js` |
| `task_deleted` | User deletes a task from a project | `src/pages/project-detail.js` |
| `settings_updated` | User changes a preference setting | `src/pages/settings.js` |
| `data_reset` | User resets all app data | `src/pages/settings.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. To create the recommended "Analytics basics" dashboard in PostHog:

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard) in your PostHog project
- Suggested insights to add:
  - **Sign-in trend** — Trends of `user_signed_in` over time
  - **Project creation funnel** — Funnel: `user_signed_in` → `project_created` → `project_viewed` → `task_added`
  - **Task completion rate** — Trends comparing `task_status_updated` (filtered to `new_status = done`) vs `task_added`
  - **Churn signals** — Trends of `data_reset` and `user_signed_out`
  - **Settings engagement** — Trends of `settings_updated` broken down by `setting` property

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
