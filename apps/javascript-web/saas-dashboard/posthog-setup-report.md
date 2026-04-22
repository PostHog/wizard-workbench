<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrackFlow, a vanilla JavaScript + Vite SPA. PostHog is initialized in `src/posthog.js` using environment variables, with hash-change pageview tracking enabled for the hash-based router and exception autocapture turned on. Users are identified on login and on page refresh (if already authenticated), and `posthog.reset()` is called on logout. Ten custom events are tracked across five files, covering the full user lifecycle from sign-in through project and task management to settings changes.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in via the login form | `src/pages/login.js` |
| `user_signed_out` | User clicks Sign Out in the app shell | `src/components/shell.js` |
| `project_created` | User creates a new project | `src/pages/projects.js` |
| `project_deleted` | User confirms deletion of a project | `src/pages/projects.js` |
| `task_added` | User adds a new task to a project | `src/pages/project-detail.js` |
| `task_status_updated` | Task is moved to a new status column | `src/pages/project-detail.js` |
| `task_assigned` | Task is assigned or unassigned to a team member | `src/pages/project-detail.js` |
| `task_deleted` | User deletes a task from a project | `src/pages/project-detail.js` |
| `settings_updated` | User changes a preference (theme, notifications, digest) | `src/pages/settings.js` |
| `data_reset` | User confirms resetting all app data to defaults | `src/pages/settings.js` |

## Next steps

You can build an "Analytics basics" dashboard in PostHog with insights like these:

- **Sign-in funnel** — `user_signed_in` → `project_created` → `task_added` (conversion funnel)
- **Task completion trend** — trend of `task_status_updated` where `status = done` over time
- **Project churn** — trend of `project_deleted` events over time
- **Settings engagement** — breakdown of `settings_updated` by `setting` property
- **Active users** — unique users who fired `user_signed_in` per day/week

Visit your PostHog project to create these: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_web/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
