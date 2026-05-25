<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TrackFlow SaaS dashboard. `posthog-js` was installed, initialized in `src/main.js` with environment-variable-backed token and host, and event capture was added across all key user flows. Users are identified on login and on page refresh (for existing sessions), and `posthog.reset()` is called on logout to cleanly unlink the session.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully logs in | `src/pages/login.js` |
| `project_created` | User creates a new project | `src/pages/projects.js` |
| `project_deleted` | User deletes a project | `src/pages/projects.js` |
| `task_added` | User adds a task to a project | `src/pages/project-detail.js` |
| `task_status_updated` | User moves a task to a new status | `src/pages/project-detail.js` |
| `task_assigned` | User assigns a task to a team member | `src/pages/project-detail.js` |
| `task_deleted` | User deletes a task | `src/pages/project-detail.js` |
| `settings_updated` | User changes a preference (theme or notifications) | `src/pages/settings.js` |
| `data_reset` | User resets all app data to defaults | `src/pages/settings.js` |
| `user_signed_out` | User clicks Sign Out | `src/components/shell.js` |

## Next steps

To build an "Analytics basics" dashboard in PostHog, navigate to [Dashboards](/dashboards) and create a new dashboard. We recommend the following insights based on the instrumented events:

1. **Sign-in trend** — Trends chart on `user_signed_in` over time, broken down by `role`
2. **Project funnel** — Funnel from `user_signed_in` → `project_created` to measure new-project conversion
3. **Task completion rate** — Trends chart comparing `task_status_updated` where `new_status = done` vs `task_added`
4. **Task activity breakdown** — Trends chart with all four task events (`task_added`, `task_status_updated`, `task_assigned`, `task_deleted`) displayed as separate series
5. **Churn signals** — Trends chart on `data_reset` and `user_signed_out` to monitor engagement risk

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
