# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into **TrackFlow**, a vanilla JavaScript SaaS project-management dashboard built with Vite. The following changes were made:

- **`src/posthog.js`** (new file): PostHog is initialized here using `import.meta.env` variables so API keys never appear in source code. This module is imported first in `src/main.js` so PostHog is ready before any route renders.
- **`src/main.js`**: Added `import './posthog.js'` as the first import to guarantee initialization order.
- **`src/pages/login.js`**: On successful login, calls `posthog.identify()` with the user's ID, name, email, and role to link all future events to a known person. Fires `user_signed_in`. Calls `posthog.captureException()` on login errors.
- **`src/components/shell.js`**: Re-identifies the logged-in user on every page render (covers page refreshes). Fires `user_signed_out` before logout and calls `posthog.reset()` afterwards to unlink future anonymous events.
- **`src/pages/projects.js`**: Fires `project_created` (with `project_id`) after a new project is created, and `project_deleted` (with `project_id`) after a project is deleted. `captureException` on create errors.
- **`src/pages/project-detail.js`**: Fires `task_created` (with `project_id`, `task_id`, `priority`), `task_status_updated` (with `project_id`, `task_id`, `status`), `task_assigned` (with `project_id`, `task_id`, `assigned` boolean), and `task_deleted` (with `project_id`, `task_id`). `captureException` on add-task errors.
- **`src/pages/settings.js`**: Fires `settings_updated` (with `setting` name and `value`) for each preference change (theme, email notifications, weekly digest), and `data_reset` when the user confirms resetting all data.
- **`.env`**: `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` written and added to `.gitignore`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in via the login form | `src/pages/login.js` |
| `user_signed_out` | User clicked the Sign Out button in the app shell | `src/components/shell.js` |
| `project_created` | User created a new project via the New Project modal | `src/pages/projects.js` |
| `project_deleted` | User confirmed deletion of a project and all its tasks | `src/pages/projects.js` |
| `task_created` | User added a new task to a project via the Add Task modal | `src/pages/project-detail.js` |
| `task_status_updated` | User moved a task to a different status column on the project board | `src/pages/project-detail.js` |
| `task_assigned` | User assigned (or unassigned) a task to a team member | `src/pages/project-detail.js` |
| `task_deleted` | User deleted a task from a project | `src/pages/project-detail.js` |
| `settings_updated` | User changed a preference setting (theme, email notifications, weekly digest) | `src/pages/settings.js` |
| `data_reset` | User reset all application data to defaults from the Danger Zone | `src/pages/settings.js` |

## Next steps

We've designed the following insights for an **Analytics basics** dashboard. Create these in your [PostHog project](https://us.posthog.com/project/2/dashboards):

1. **Sign-in trend** — Trends chart for `user_signed_in` over time. Shows daily/weekly active user growth.
2. **Project creation funnel** — Funnel: `user_signed_in` → `project_created` → `task_created`. Measures how many users who sign in go on to create a project and add a first task.
3. **Task completion rate** — Trends chart comparing `task_status_updated` (filtered to `status = done`) vs `task_created`. Shows team productivity.
4. **Churn signal: data resets** — Trends chart for `data_reset` over time. Spikes may indicate frustrated users or onboarding drop-off.
5. **Feature engagement breakdown** — Bar chart showing total event counts for `project_created`, `task_created`, `task_assigned`, `task_status_updated`, and `settings_updated`. Highlights which features are used most.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_web/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
