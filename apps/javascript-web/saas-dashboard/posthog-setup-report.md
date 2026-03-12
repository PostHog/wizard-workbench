<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrackFlow, a client-side Vite + vanilla JavaScript SPA. The `posthog-js` SDK was installed and initialized in `src/posthog.js` with environment-variable-driven configuration. PostHog is initialized on app startup in `src/main.js`, which also re-identifies any already-logged-in user on page refresh. Users are identified with their `id`, `email`, `name`, and `role` on login, and `posthog.reset()` is called on logout to unlink subsequent events. Exception capture (`posthog.captureException`) was added to login and project creation error paths. Eleven events across five files capture the most business-critical user actions.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully logs in | `src/pages/login.js` |
| `user_signed_out` | Fired when a user signs out | `src/components/shell.js` |
| `project_created` | Fired when a new project is created | `src/pages/projects.js` |
| `project_deleted` | Fired when a project is deleted | `src/pages/projects.js` |
| `task_added` | Fired when a task is added to a project | `src/pages/project-detail.js` |
| `task_status_updated` | Fired when a task is moved to a new status column | `src/pages/project-detail.js` |
| `task_deleted` | Fired when a task is deleted | `src/pages/project-detail.js` |
| `task_assigned` | Fired when a task is assigned to a team member | `src/pages/project-detail.js` |
| `settings_theme_changed` | Fired when the user switches between light and dark theme | `src/pages/settings.js` |
| `settings_updated` | Fired when notification preferences are changed | `src/pages/settings.js` |
| `data_reset` | Fired when the user resets all app data to defaults | `src/pages/settings.js` |

## Next steps

Once data starts flowing into PostHog, we recommend building an "Analytics basics" dashboard with these insights:

1. **Sign-in trend** — Track `user_signed_in` over time to monitor daily/weekly active users
2. **Project creation funnel** — Funnel from `user_signed_in` → `project_created` to measure new-project activation rate
3. **Task completion rate** — Filter `task_status_updated` where `status = done` to see task throughput
4. **Churn indicators** — Monitor `project_deleted` and `data_reset` events as early churn signals
5. **Settings engagement** — Track `settings_theme_changed` and `settings_updated` to understand user preference adoption

To build these in PostHog, go to **Insights** → **New insight** and use the event names above.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
