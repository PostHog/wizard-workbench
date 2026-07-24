# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrackFlow, a vanilla JavaScript SPA project-management dashboard. The integration covers authentication, project management, task tracking, settings changes, and user identification.

**Key changes made:**

- Created `src/posthog.js` — initializes PostHog using Vite env vars (`VITE_PUBLIC_POSTHOG_KEY`, `VITE_PUBLIC_POSTHOG_HOST`). Guards against missing config: silent no-op in production, loud `console.error` in dev.
- Updated `src/main.js` — imports PostHog, identifies the current user on page refresh (for returning sessions), and captures `$pageview` on every hash-based route change.
- Updated `src/pages/login.js` — calls `posthog.identify()` with the user's stable ID plus person properties on successful login, then captures `user_signed_in`.
- Updated `src/components/shell.js` — captures `user_signed_out` and calls `posthog.reset()` on logout.
- Updated `src/pages/projects.js` — captures `project_created` and `project_deleted`.
- Updated `src/pages/project-detail.js` — captures `project_viewed` (with project metadata), `task_added`, `task_completed`, `task_status_updated`, `task_assigned`, and `task_deleted`. Also captures exceptions on API failures.
- Updated `src/pages/settings.js` — captures `settings_theme_changed`, `settings_notifications_updated`, `settings_weekly_digest_updated`, and `settings_data_reset`.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in with their email. | `src/pages/login.js` |
| `user_signed_out` | User clicked the Sign Out button and was logged out. | `src/components/shell.js` |
| `project_viewed` | User opened the detail page of a project (top of task-management funnel). | `src/pages/project-detail.js` |
| `project_created` | User created a new project via the New Project form. | `src/pages/projects.js` |
| `project_deleted` | User deleted an existing project and all its tasks. | `src/pages/projects.js` |
| `task_added` | User added a new task to a project. | `src/pages/project-detail.js` |
| `task_completed` | User moved a task to the done status (key completion conversion). | `src/pages/project-detail.js` |
| `task_status_updated` | User moved a task to a new status other than done. | `src/pages/project-detail.js` |
| `task_deleted` | User deleted a task from a project. | `src/pages/project-detail.js` |
| `task_assigned` | User assigned or unassigned a task to a team member. | `src/pages/project-detail.js` |
| `settings_theme_changed` | User changed the app theme (light or dark). | `src/pages/settings.js` |
| `settings_notifications_updated` | User toggled the email notifications preference. | `src/pages/settings.js` |
| `settings_weekly_digest_updated` | User toggled the weekly digest preference. | `src/pages/settings.js` |
| `settings_data_reset` | User reset all application data to defaults (strong churn signal). | `src/pages/settings.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1902654)
- [Daily sign-ins (wizard)](https://us.posthog.com/project/483112/insights/CuPXIZ1x)
- [Sign-in to task completion funnel (wizard)](https://us.posthog.com/project/483112/insights/TZKU0CWA)
- [Task activity (wizard)](https://us.posthog.com/project/483112/insights/dPsAnoNH)
- [Project activity (wizard)](https://us.posthog.com/project/483112/insights/78r3oMV1)
- [Data reset events — churn signal (wizard)](https://us.posthog.com/project/483112/insights/WEp4NR6o)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
