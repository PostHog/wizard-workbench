# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TrackFlow SaaS dashboard. The integration uses `posthog-js` installed via npm and initialized through a dedicated `src/posthog.js` module. PostHog is initialized with environment variables (`VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`) read from Vite's `import.meta.env`, with a dev-mode console error if the key is missing. User identification is called on login and on page refresh for returning sessions, and `posthog.reset()` is called on logout. Exception capture (`posthog.captureException`) is wired into error handlers across key user flows.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fires when a user successfully signs in via the login form. | `src/pages/login.js` |
| `project_created` | Fires when a user creates a new project via the New Project modal. | `src/pages/projects.js` |
| `project_deleted` | Fires when a user confirms deletion of a project. | `src/pages/projects.js` |
| `project_viewed` | Fires when a user opens the detail view for a specific project. | `src/pages/project-detail.js` |
| `task_added` | Fires when a user adds a new task to a project via the Add Task modal. | `src/pages/project-detail.js` |
| `task_status_updated` | Fires when a user moves a task to a different status column on the board. | `src/pages/project-detail.js` |
| `task_assigned` | Fires when a user assigns or reassigns a task to a team member. | `src/pages/project-detail.js` |
| `task_deleted` | Fires when a user deletes a task from a project. | `src/pages/project-detail.js` |
| `settings_updated` | Fires when a user changes a preference (theme, notifications, weekly digest) in Settings. | `src/pages/settings.js` |
| `data_reset` | Fires when a user confirms resetting all app data to defaults. | `src/pages/settings.js` |
| `user_signed_out` | Fires when a user clicks Sign Out to end their session. | `src/components/shell.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1897338)
- [User logins (wizard)](https://us.posthog.com/project/483112/insights/Z8UjJOnl)
- [Project to task funnel (wizard)](https://us.posthog.com/project/483112/insights/t6Ro2Qdk)
- [Task status updates (wizard)](https://us.posthog.com/project/483112/insights/ySwPurmC)
- [Project activity (wizard)](https://us.posthog.com/project/483112/insights/Mp6y4pRp)
- [Settings changes (wizard)](https://us.posthog.com/project/483112/insights/5CbOMprt)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
