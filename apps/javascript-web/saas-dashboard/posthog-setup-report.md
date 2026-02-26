<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into **TrackFlow**, a SaaS project management dashboard. A new `src/posthog.js` helper module was created to initialise the `posthog-node` client from environment variables and expose three clean wrappers (`trackEvent`, `identifyUser`, `captureException`). Six existing source files were updated with targeted additions — no existing logic was altered.

**What was added:**
- **`src/posthog.js`** — PostHog client singleton with `initializePosthog()`, `trackEvent()`, `identifyUser()`, and `captureException()` helpers. The client reads `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` from the environment and gracefully skips tracking if the key is absent.
- **User identification** — `identifyUser()` is called on successful login, associating the user's email, name, and role with their PostHog person record.
- **Exception capture** — `captureException()` is added to all `catch` blocks in login, project creation, project loading, and settings loading flows.
- **12 events** tracked across 5 files covering the full user lifecycle: auth, project management, task management, and settings.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticates with their email — top of retention funnel | `src/pages/login.js` |
| `user_signed_out` | User clicks Sign Out in the app shell header | `src/components/shell.js` |
| `project_created` | User creates a new project via the New Project modal | `src/pages/projects.js` |
| `project_deleted` | User confirms deletion of an existing project and all its tasks | `src/pages/projects.js` |
| `project_viewed` | User opens a project detail page — top of task-management funnel | `src/pages/project-detail.js` |
| `task_created` | User adds a new task to a project via the Add Task modal | `src/pages/project-detail.js` |
| `task_status_updated` | User moves a task to a different status column (todo → in_progress) | `src/pages/project-detail.js` |
| `task_completed` | User moves a task specifically to 'done' status — key completion metric | `src/pages/project-detail.js` |
| `task_assigned` | User assigns (or unassigns) a task to a team member | `src/pages/project-detail.js` |
| `task_deleted` | User deletes a task from a project | `src/pages/project-detail.js` |
| `settings_updated` | User changes a preference (theme, email notifications, or weekly digest) | `src/pages/settings.js` |
| `data_reset` | User resets all app data to defaults — churn risk signal | `src/pages/settings.js` |

## Next steps

We recommend building the following insights in your [PostHog project](https://us.posthog.com/project/238460) to monitor user behavior:

1. **Daily Active Users** — Trends on `user_signed_in` (unique users per day) — baseline engagement metric
2. **Project → Task Funnel** — Funnel `project_viewed` → `task_created` — measures how well project views convert to productive work
3. **Task Completion Rate** — Trends comparing `task_created` vs `task_completed` over time — core product health signal
4. **Project & Task Activity** — Trends on `project_created`, `task_created`, `task_deleted` together — overall platform activity
5. **Churn Risk Monitor** — Trends on `data_reset` — early warning for at-risk users

To create these, visit: **[https://us.posthog.com/project/238460/insights/new](https://us.posthog.com/project/238460/insights/new)**

Then collect them into a new dashboard: **[https://us.posthog.com/project/238460/dashboard/new](https://us.posthog.com/project/238460/dashboard/new)**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
