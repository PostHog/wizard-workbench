<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for **TrackFlow**, a Vite-based client-side SPA. `posthog-js` was installed and a new `src/posthog.js` init module was created. Event tracking was added across six files covering all major user actions: authentication, project management, task lifecycle, and settings. Users are identified on login and on page load (for returning sessions), and `posthog.reset()` is called on logout to unlink the session.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully logs in with their email. | `src/pages/login.js` |
| `user_signed_out` | Fired when a user clicks the Sign Out button. | `src/components/shell.js` |
| `project_created` | Fired when a user creates a new project. | `src/pages/projects.js` |
| `project_deleted` | Fired when a user deletes a project. | `src/pages/projects.js` |
| `project_viewed` | Fired when a user opens a project's detail page. | `src/pages/project-detail.js` |
| `task_created` | Fired when a user adds a new task to a project. | `src/pages/project-detail.js` |
| `task_completed` | Fired when a user moves a task to the done status. | `src/pages/project-detail.js` |
| `task_status_updated` | Fired when a user moves a task to a non-done status column. | `src/pages/project-detail.js` |
| `task_deleted` | Fired when a user deletes a task from a project. | `src/pages/project-detail.js` |
| `task_assigned` | Fired when a user assigns or reassigns a task to a team member. | `src/pages/project-detail.js` |
| `settings_updated` | Fired when a user changes a preference in the Settings page. | `src/pages/settings.js` |
| `data_reset` | Fired when a user resets all application data to defaults. | `src/pages/settings.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818136)
- [User sign-ins over time (wizard)](https://us.posthog.com/project/483112/insights/rCeCQvmw)
- [Task completion funnel (wizard)](https://us.posthog.com/project/483112/insights/tfhvSd4X)
- [Project activity (wizard)](https://us.posthog.com/project/483112/insights/PA1Q6RLm)
- [Task creation and completion (wizard)](https://us.posthog.com/project/483112/insights/rIq1xw6h)
- [Churn signals (wizard)](https://us.posthog.com/project/483112/insights/1nUft1X8)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the wizard added an identify call in `src/main.js` for users already logged in via localStorage, so verify this works correctly after a hard page refresh.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
