<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrackFlow, a client-side Vite SPA for project management. PostHog is initialized in `src/main.js` using `posthog-js` with environment variables for the API key and host. User identification is performed on successful login in `src/pages/login.js`. Ten business-critical events are captured across the login, project, task, and settings flows, with exception capture added wherever API calls can throw.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully signs in to the application. | src/pages/login.js |
| `login_failed` | Fired when a login attempt fails due to invalid credentials. | src/pages/login.js |
| `project_created` | Fired when a user creates a new project. | src/pages/projects.js |
| `project_deleted` | Fired when a user deletes a project and all its tasks. | src/pages/projects.js |
| `task_created` | Fired when a user adds a new task to a project. | src/pages/project-detail.js |
| `task_status_updated` | Fired when a task is moved to a different status column on the board. | src/pages/project-detail.js |
| `task_deleted` | Fired when a user deletes a task from a project. | src/pages/project-detail.js |
| `task_assigned` | Fired when a task is assigned or reassigned to a team member. | src/pages/project-detail.js |
| `settings_saved` | Fired when a user updates their preferences in the settings page. | src/pages/settings.js |
| `data_reset` | Fired when a user resets all application data to defaults. | src/pages/settings.js |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/2/dashboard/80002)
- [User Login Trend](https://us.posthog.com/project/2/insights/30053Sfi)
- [Login Failure Rate](https://us.posthog.com/project/2/insights/ZP6HfDAG)
- [Project Lifecycle Funnel](https://us.posthog.com/project/2/insights/LJ2nvgto)
- [Task Creation Trend](https://us.posthog.com/project/2/insights/8vXQrhe8)
- [Task Completion Rate](https://us.posthog.com/project/2/insights/mVdO2dMv)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` to `.env.example` (already present) and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login, so returning sessions that skip the login page will use anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
