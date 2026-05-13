<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TrackFlow SaaS dashboard. Here is a summary of all changes made:

**New file: `src/posthog.js`**
Created a PostHog initialization module that imports `posthog-js` and calls `posthog.init()` with environment variables for the project token and API host.

**Edited: `src/main.js`**
Imported the PostHog singleton. Added `posthog.identify()` on startup for users who are already logged in (persisted via localStorage). Added `posthog.capture('$pageview')` on `hashchange` events to track navigation in this hash-based SPA.

**Edited: `src/pages/login.js`**
After a successful login, calls `posthog.identify()` with the user's ID, name, email, and role to link events to the known user. Captures `user_logged_in` with the user's role. Calls `posthog.captureException()` on login errors.

**Edited: `src/components/shell.js`**
Calls `posthog.reset()` on logout to unlink future events from the session.

**Edited: `src/pages/projects.js`**
Captures `project_created` (with `project_id`) after a new project is created. Captures `project_deleted` (with `project_id`) after deletion. Calls `posthog.captureException()` on project creation errors.

**Edited: `src/pages/project-detail.js`**
Captures `task_created` (with `project_id`, `task_id`, `priority`) after a task is added. Captures `task_completed` (with `project_id`, `task_id`) when a task is moved to done. Captures `task_status_updated` (with `project_id`, `task_id`, `status`) when moved to todo or in_progress. Captures `task_deleted` (with `project_id`, `task_id`) after deletion. Captures `task_assigned` (with `project_id`, `task_id`, `assigned`) after assignment changes. Calls `posthog.captureException()` on task creation errors.

**Edited: `src/pages/settings.js`**
Captures `settings_updated` (with `setting` name and new `value`) for theme, email notifications, and weekly digest changes. Captures `data_reset` when the user resets all app data.

**Environment variables (`.env`):**
- `VITE_PUBLIC_POSTHOG_KEY` — PostHog project token
- `VITE_PUBLIC_POSTHOG_HOST` — PostHog API host

**Package installed:** `posthog-js`

---

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `src/pages/login.js` |
| `project_created` | User creates a new project | `src/pages/projects.js` |
| `project_deleted` | User deletes a project | `src/pages/projects.js` |
| `task_created` | User adds a task to a project | `src/pages/project-detail.js` |
| `task_status_updated` | User moves a task to todo or in_progress | `src/pages/project-detail.js` |
| `task_completed` | User marks a task as done | `src/pages/project-detail.js` |
| `task_deleted` | User deletes a task | `src/pages/project-detail.js` |
| `task_assigned` | User assigns or unassigns a task | `src/pages/project-detail.js` |
| `settings_updated` | User changes a preference setting | `src/pages/settings.js` |
| `data_reset` | User resets all app data to defaults | `src/pages/settings.js` |

---

## Next steps

We've set up the events above. Head to PostHog to build insights and a dashboard for your TrackFlow analytics:

- **Create "Analytics basics" dashboard:** https://us.posthog.com/project/2/dashboards
- **Explore all events (Trends):** https://us.posthog.com/project/2/insights/new#insight=TRENDS
- **Login conversion funnel** (`user_logged_in` → `project_created` → `task_created`): https://us.posthog.com/project/2/insights/new#insight=FUNNELS
- **Task completion funnel** (`task_created` → `task_completed`): https://us.posthog.com/project/2/insights/new#insight=FUNNELS
- **User retention** (based on `user_logged_in`): https://us.posthog.com/project/2/insights/new#insight=RETENTION
- **Project activity trends** (`project_created`, `project_deleted`): https://us.posthog.com/project/2/insights/new#insight=TRENDS
- **Settings engagement** (`settings_updated`, `data_reset`): https://us.posthog.com/project/2/insights/new#insight=TRENDS

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
