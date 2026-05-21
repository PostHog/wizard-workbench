<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into **TrackFlow**, a SaaS project management dashboard built with vanilla JavaScript and Vite.

## What was done

- **Installed** `posthog-js` as a project dependency
- **Created** `src/posthog.js` — a singleton that initialises PostHog from environment variables and exports it for use throughout the app
- **Configured** `.env` with `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST`
- **Added user identification** on login (`posthog.identify`) and on page refresh if already logged in; `posthog.reset()` is called on logout
- **Instrumented 11 events** across 5 files covering auth, projects, tasks, and settings
- **Added exception capture** (`posthog.captureException`) in all critical error boundaries

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticated and logged in | `src/pages/login.js` |
| `user_signed_out` | User clicked Sign Out from the app shell | `src/components/shell.js` |
| `project_created` | User created a new project | `src/pages/projects.js` |
| `project_deleted` | User deleted a project and all its tasks | `src/pages/projects.js` |
| `project_viewed` | User opened a project detail page | `src/pages/project-detail.js` |
| `task_created` | User added a new task to a project | `src/pages/project-detail.js` |
| `task_status_updated` | User moved a task to a different status column | `src/pages/project-detail.js` |
| `task_assigned` | User assigned or unassigned a task to a team member | `src/pages/project-detail.js` |
| `task_deleted` | User deleted a task from a project | `src/pages/project-detail.js` |
| `settings_updated` | User changed a preference (theme, notifications, digest) | `src/pages/settings.js` |
| `data_reset` | User reset all app data to defaults | `src/pages/settings.js` |

## Next steps

We've prepared five insights for the **"Analytics basics"** dashboard. Create the dashboard and add each insight at the links below:

- **[New dashboard: "Analytics basics"](https://us.posthog.com/project/2/dashboard)** — click "New dashboard" and name it "Analytics basics"

- **[Login funnel](https://us.posthog.com/project/2/insights/new#eyJldmVudHMiOlt7ImlkIjoidXNlcl9zaWduZWRfaW4iLCJ0eXBlIjoiZXZlbnRzIn1dLCJpbnNpZ2h0IjoiVFJFTkRTIn0=)** — Trends of `user_signed_in` over time; spot drop-offs in daily active users

- **[Project creation rate](https://us.posthog.com/project/2/insights/new)** — Trends of `project_created` vs `project_deleted`; track growth and churn signals

- **[Task completion funnel](https://us.posthog.com/project/2/insights/new)** — Funnel: `project_viewed` → `task_created` → `task_status_updated` (where `new_status = done`); measures how many viewers become productive users

- **[Task activity breakdown](https://us.posthog.com/project/2/insights/new)** — Trends of `task_created`, `task_status_updated`, `task_assigned`, `task_deleted` grouped together; shows overall task engagement

- **[Churn signals](https://us.posthog.com/project/2/insights/new)** — Trends of `user_signed_out` and `data_reset` over time; helps identify potential churn before it happens

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_web/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
