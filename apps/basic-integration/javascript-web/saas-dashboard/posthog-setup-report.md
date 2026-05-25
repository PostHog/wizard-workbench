# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into TrackFlow, a Vite-based SPA project management dashboard. PostHog is initialized via `src/posthog.js` and imported into the app entry point (`src/main.js`), ensuring it is ready before any route renders. Hash-based SPA pageviews are captured on every route change via the router. Users are identified on login and re-identified on page refresh; `posthog.reset()` is called on logout to unlink future events from the previous session. Exception tracking (`captureException`) is wired into login and project-creation error handlers.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticates and enters the app | `src/pages/login.js` |
| `user_signed_out` | User clicks Sign Out and ends their session | `src/components/shell.js` |
| `project_created` | User creates a new project via the New Project modal | `src/pages/projects.js` |
| `project_deleted` | User confirms deletion of a project and all its tasks | `src/pages/projects.js` |
| `task_created` | User adds a new task to a project via the Add Task modal | `src/pages/project-detail.js` |
| `task_status_updated` | User moves a task to a different status column | `src/pages/project-detail.js` |
| `task_deleted` | User deletes a task from a project | `src/pages/project-detail.js` |
| `task_assigned` | User assigns or unassigns a task to a team member | `src/pages/project-detail.js` |
| `settings_updated` | User changes a preference setting (theme, notifications, digest) | `src/pages/settings.js` |
| `data_reset` | User resets all app data to defaults from the Danger Zone | `src/pages/settings.js` |

## Next steps

To build the recommended "Analytics basics" dashboard in PostHog, navigate to [Dashboards](/dashboards) and create a new dashboard with the following insights:

1. **Sign-in trend** — Trends insight on `user_signed_in` over time, broken down by `role`
2. **Project creation funnel** — Funnel insight: `user_signed_in` → `project_created` → `task_created` (conversion from sign-in to first task)
3. **Task completion rate** — Trends insight on `task_status_updated` filtered to `new_status = done` vs total `task_created`
4. **Feature engagement** — Trends insight comparing `task_created`, `task_assigned`, and `settings_updated` side-by-side
5. **Churn signals** — Trends insight on `user_signed_out` and `data_reset` to surface disengaged users

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
