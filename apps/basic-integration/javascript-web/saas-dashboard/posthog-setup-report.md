<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrackFlow, a vanilla JavaScript SPA built with Vite.

**What was done:**

- Installed `posthog-js` as a dependency
- Created `src/analytics.js` — a dedicated module that initializes PostHog using `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables (set in `.env`)
- Added `posthog.init()` with `capture_pageview: false` (correct for a hash-based SPA with a custom router)
- Added `posthog.identify()` in two places: on successful login (`src/pages/login.js`) and on page refresh if the user is already logged in (`src/main.js`), ensuring sessions are always linked to a known user
- Added `posthog.reset()` and a `user_signed_out` event on logout (`src/components/shell.js`) to unlink future events from the logged-out user
- Instrumented 12 business events across 4 files (see table below)
- Added `posthog.captureException()` around critical error paths (login failure, project creation, loading project, adding a task)

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in | `src/pages/login.js` |
| `user_signed_out` | User clicks the Sign Out button | `src/components/shell.js` |
| `project_created` | User creates a new project | `src/pages/projects.js` |
| `project_deleted` | User deletes a project and all its tasks | `src/pages/projects.js` |
| `project_viewed` | User opens a project's board view | `src/pages/project-detail.js` |
| `task_added` | User adds a new task to a project | `src/pages/project-detail.js` |
| `task_status_updated` | User moves a task to a new status column | `src/pages/project-detail.js` |
| `task_assigned` | User assigns or unassigns a task | `src/pages/project-detail.js` |
| `task_deleted` | User deletes a task | `src/pages/project-detail.js` |
| `settings_theme_changed` | User switches the UI theme | `src/pages/settings.js` |
| `settings_notifications_updated` | User toggles email notifications or digest | `src/pages/settings.js` |
| `data_reset` | User resets all application data | `src/pages/settings.js` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights — these map directly to the events instrumented above:

1. **Sign-in funnel** — Funnel from `user_signed_in` → `project_viewed` → `task_added`. Reveals how many users progress from login through active project engagement.
   [Create funnel insight](https://us.posthog.com/project/2/insights/new#funnel)

2. **Daily active users (sign-ins over time)** — Trend of `user_signed_in` events. Your primary engagement pulse metric.
   [Create trend insight](https://us.posthog.com/project/2/insights/new#trend)

3. **Project creation rate** — Trend of `project_created` vs `project_deleted`. Shows net project growth over time.
   [Create trend insight](https://us.posthog.com/project/2/insights/new#trend)

4. **Task completion funnel** — Funnel from `task_added` → `task_status_updated` (where `new_status = done`). Tracks how often tasks that are created actually get completed.
   [Create funnel insight](https://us.posthog.com/project/2/insights/new#funnel)

5. **Churn signal — data resets** — Trend of `data_reset`. A spike here may indicate user frustration or onboarding confusion.
   [Create trend insight](https://us.posthog.com/project/2/insights/new#trend)

[Open PostHog project](https://us.posthog.com/project/2)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_web/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
