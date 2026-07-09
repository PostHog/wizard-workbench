<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrackFlow, a vanilla JavaScript SaaS project management dashboard. `posthog-js` was installed via npm and initialized in `src/main.js` using Vite environment variables (`VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`). On every page load, if a user is already logged in (stored in localStorage), `posthog.identify()` is called immediately to re-link their session. On login, the user is identified with their ID, email, name, and role. On logout, `posthog.reset()` is called to unlink the session. Error tracking via `posthog.captureException()` was added to login failure and project creation failure paths.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticated and logged into the application. | `src/pages/login.js` |
| `sign_in_failed` | User attempted to sign in but credentials were invalid. | `src/pages/login.js` |
| `project_created` | User created a new project via the New Project modal. | `src/pages/projects.js` |
| `project_deleted` | User deleted an existing project and all its tasks. | `src/pages/projects.js` |
| `task_added` | User added a new task to a project from the project detail board. | `src/pages/project-detail.js` |
| `task_status_updated` | User moved a task to a different status column (todo, in_progress, or done). | `src/pages/project-detail.js` |
| `task_assigned` | User assigned or unassigned a task to a team member. | `src/pages/project-detail.js` |
| `task_deleted` | User deleted a task from a project. | `src/pages/project-detail.js` |
| `settings_updated` | User changed a preference setting such as theme or notification options. | `src/pages/settings.js` |
| `data_reset` | User triggered a full data reset from the danger zone in settings. | `src/pages/settings.js` |
| `user_signed_out` | User clicked the Sign Out button and was logged out of the application. | `src/components/shell.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1824514)
- [Daily sign-ins](https://us.posthog.com/project/483112/insights/VG7Shf7J)
- [Sign-in vs sign-out (churn signal)](https://us.posthog.com/project/483112/insights/XkAlQcU3)
- [Project creation funnel](https://us.posthog.com/project/483112/insights/QUivtnzQ)
- [Task activity breakdown](https://us.posthog.com/project/483112/insights/MLQPz2Xj)
- [Task status updated by new status](https://us.posthog.com/project/483112/insights/YXGNqeCH)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_web/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
