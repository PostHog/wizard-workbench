# PostHog post-wizard report

The wizard has completed a full PostHog integration for **TrackFlow**, a SaaS project-management dashboard built with Vite + vanilla JavaScript. `posthog-js` was installed and initialized in `src/main.js` using `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` environment variables. PostHog identifies the current user on every page load (via the `loaded` callback) and re-identifies on login, so returning sessions are always linked to a known person. `posthog.reset()` is called on logout to start a fresh anonymous session. Exception capture was added to the login flow and project/task operations. Twelve custom events were instrumented across five files covering the full user lifecycle: authentication, project management, task operations, and settings.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully signs in to TrackFlow. | `src/pages/login.js` |
| `user_signed_out` | Fired when a user signs out from the app shell. | `src/components/shell.js` |
| `project_created` | Fired when a user creates a new project. | `src/pages/projects.js` |
| `project_deleted` | Fired when a user deletes an existing project. | `src/pages/projects.js` |
| `project_viewed` | Fired when a user views a project detail page, representing the top of the project engagement funnel. | `src/pages/project-detail.js` |
| `task_created` | Fired when a user adds a new task to a project. | `src/pages/project-detail.js` |
| `task_completed` | Fired when a task is moved to the 'done' status. | `src/pages/project-detail.js` |
| `task_status_changed` | Fired when a task is moved to a non-done status (todo or in_progress). | `src/pages/project-detail.js` |
| `task_assigned` | Fired when a task is assigned to a team member. | `src/pages/project-detail.js` |
| `task_deleted` | Fired when a task is deleted from a project. | `src/pages/project-detail.js` |
| `settings_updated` | Fired when a user changes their preferences in the settings page. | `src/pages/settings.js` |
| `data_reset` | Fired when a user resets all application data from the Danger Zone. | `src/pages/settings.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1807666)
- [Daily Active Users (wizard)](https://us.posthog.com/project/483112/insights/D4U2iGJo)
- [Project Engagement Funnel (wizard)](https://us.posthog.com/project/483112/insights/XoJzzyrA)
- [Task Activity Over Time (wizard)](https://us.posthog.com/project/483112/insights/zNhgLvGt)
- [Project Lifecycle (wizard)](https://us.posthog.com/project/483112/insights/O9crTSVV)
- [Churn Signals (wizard)](https://us.posthog.com/project/483112/insights/N0431rDT)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
