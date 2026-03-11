<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TrackFlow SaaS dashboard. The `posthog-js` package was installed and initialized in `src/main.js` using environment variables. PostHog is initialized once at app startup and persists across all SPA route navigations. Users are identified on login (and on page refresh if already authenticated) using their user ID, email, name, and role. On logout, `posthog.reset()` is called to unlink future events from the signed-out user. Hash-based pageview tracking was added to capture navigation between SPA routes. Error tracking via `posthog.captureException()` was added to login failures and project/task creation error paths.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in | `src/pages/login.js` |
| `login_failed` | User attempted sign-in with invalid credentials | `src/pages/login.js` |
| `user_signed_out` | User clicked Sign Out | `src/components/shell.js` |
| `project_created` | User created a new project | `src/pages/projects.js` |
| `project_deleted` | User deleted a project | `src/pages/projects.js` |
| `task_created` | User added a task to a project | `src/pages/project-detail.js` |
| `task_status_updated` | User moved a task to a different status | `src/pages/project-detail.js` |
| `task_deleted` | User deleted a task | `src/pages/project-detail.js` |
| `task_assigned` | User assigned a task to a team member | `src/pages/project-detail.js` |
| `settings_updated` | User changed a setting (theme, notifications) | `src/pages/settings.js` |
| `data_reset` | User reset all application data to defaults | `src/pages/settings.js` |

## Next steps

To monitor user behavior, create an "Analytics basics" dashboard in PostHog with insights based on these events:

- **Sign-in funnel**: Trend of `user_signed_in` vs `login_failed` over time — track authentication success rates
- **Project creation trend**: Trend of `project_created` and `project_deleted` — measure project lifecycle activity
- **Task completion funnel**: Funnel from `task_created` → `task_status_updated` (new_status=done) — track task completion rates
- **User churn signal**: Trend of `data_reset` — identifies users resetting data (potential churn indicator)
- **Team collaboration**: Trend of `task_assigned` — shows team collaboration activity

You can create these insights at:
- [PostHog Insights](https://us.posthog.com/project/2/insights)
- [PostHog Dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_web/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
