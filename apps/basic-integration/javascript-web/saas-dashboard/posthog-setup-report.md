<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for TrackFlow, a Vite-based client-side SPA. PostHog is initialized via a dedicated `src/posthog.js` module using environment variables, with `capture_pageview: false` so that each hash-based route change is captured manually. Identify is called on login with the user's ID, name, email, and role; `posthog.reset()` is called on logout. Exception capture is wired into all critical async error paths. Thirteen events are tracked across six files covering authentication, project lifecycle, task management, and settings changes.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully submits the login form and is authenticated. | `src/pages/login.js` |
| `user_signed_out` | User clicks the Sign Out button in the app shell. | `src/components/shell.js` |
| `project_created` | User creates a new project via the New Project modal. | `src/pages/projects.js` |
| `project_deleted` | User deletes a project after confirming the deletion dialog. | `src/pages/projects.js` |
| `project_viewed` | User opens a project detail page (top of task management funnel). | `src/pages/project-detail.js` |
| `task_created` | User adds a new task to a project via the Add Task modal. | `src/pages/project-detail.js` |
| `task_status_changed` | User moves a task to a non-done status column on the Kanban board. | `src/pages/project-detail.js` |
| `task_completed` | Task is moved to the done status (key productivity conversion). | `src/pages/project-detail.js` |
| `task_assigned` | User assigns a task to a team member. | `src/pages/project-detail.js` |
| `task_deleted` | User deletes a task from a project. | `src/pages/project-detail.js` |
| `settings_theme_changed` | User switches between light and dark theme. | `src/pages/settings.js` |
| `settings_notifications_changed` | User toggles email notifications or weekly digest. | `src/pages/settings.js` |
| `data_reset` | User resets all application data from the Danger Zone. | `src/pages/settings.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1777418)
- [User sign-ins over time](https://us.posthog.com/project/483112/insights/OgbRXJYA)
- [Projects created vs deleted](https://us.posthog.com/project/483112/insights/01mgqd3J)
- [Task completion funnel](https://us.posthog.com/project/483112/insights/V8BMXmn4)
- [Task actions breakdown](https://us.posthog.com/project/483112/insights/2QtM73ep)
- [Sign-outs over time (churn signal)](https://us.posthog.com/project/483112/insights/HA64E8J6)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login, so users who refresh the page while already logged in will start an anonymous session until they log in again. Add an `identify` call in `src/main.js` when `store.state.currentUser` is already set on app load.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
