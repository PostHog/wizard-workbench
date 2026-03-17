<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the TrackFlow SaaS dashboard — a client-side Vite SPA for project management. The integration uses `posthog-js` (the browser SDK) initialized via a shared `src/posthog.js` singleton. The SDK is configured with `capture_exceptions: true` for automatic error tracking. Environment variables (`VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`) are used throughout — no keys are hardcoded in source files.

Users are identified on login via `posthog.identify()` with their id, email, name, and role. On logout, `posthog.reset()` is called to clear the session. Ten business-critical events are tracked across five files covering login, logout, project lifecycle, task lifecycle, and settings changes.

| Event | Description | File |
|-------|-------------|------|
| `user logged in` | Fires when a user successfully logs in; calls `posthog.identify()` with user id, email, name, and role | `src/pages/login.js` |
| `user logged out` | Fires when the user clicks Sign Out from the top navigation | `src/components/shell.js` |
| `project created` | Fires when a new project is created via the New Project modal (includes project_id, project_name) | `src/pages/projects.js` |
| `project deleted` | Fires when a project is deleted from the projects list (includes project_id) | `src/pages/projects.js` |
| `task created` | Fires when a task is added to a project (includes task_id, task_title, priority, project_id, project_name) | `src/pages/project-detail.js` |
| `task status updated` | Fires when a task is moved to a different status column (includes task_id, new_status, project_id, project_name) | `src/pages/project-detail.js` |
| `task deleted` | Fires when a task is removed from a project (includes task_id, project_id, project_name) | `src/pages/project-detail.js` |
| `task assigned` | Fires when a task is assigned to or unassigned from a team member (includes task_id, assignee_id, project_id, project_name) | `src/pages/project-detail.js` |
| `settings updated` | Fires when theme, email notifications, or weekly digest preference is changed (includes setting, value) | `src/pages/settings.js` |
| `data reset` | Fires when the user resets all application data from the Danger Zone section | `src/pages/settings.js` |

## Next steps

We've suggested the following insights for your "Analytics basics" dashboard to monitor user behavior and business health:

- **Daily active users** — Trend of `user logged in` events (DAU metric)
- **Project creation funnel** — Funnel from `user logged in` → `project created` → `task created` (conversion funnel)
- **Task completion rate** — Breakdown of `task status updated` events by `new_status` property
- **Projects created vs deleted** — Trend comparing `project created` vs `project deleted` (churn signal)
- **Settings adoption** — Breakdown of `settings updated` events by `setting` property

Dashboard: [https://us.posthog.com/project/2/dashboard/1346453](https://us.posthog.com/project/2/dashboard/1346453)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
