<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for **TrackFlow**, a vanilla JavaScript SPA built with Vite. The `posthog-js` SDK was installed and initialized in a dedicated `src/posthog.js` module. Event capture was added across five source files covering every meaningful user action: authentication, project management, task management, and settings. Users are identified by their stable ID (e.g. `alice`) with name and role as person properties on login and on page refresh if already signed in. `posthog.reset()` is called on logout to unlink the session. `posthog.captureException()` is wired into the login and project-create error paths.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully logs in via the login form. | `src/pages/login.js` |
| `user_signed_out` | Fired when a user clicks the Sign Out button. | `src/components/shell.js` |
| `project_created` | Fired when a user successfully creates a new project. | `src/pages/projects.js` |
| `project_deleted` | Fired when a user confirms deletion of a project. | `src/pages/projects.js` |
| `task_added` | Fired when a user adds a new task to a project. | `src/pages/project-detail.js` |
| `task_status_updated` | Fired when a user moves a task to a different status column. | `src/pages/project-detail.js` |
| `task_completed` | Fired specifically when a task is moved to the done status. | `src/pages/project-detail.js` |
| `task_deleted` | Fired when a user deletes a task from a project. | `src/pages/project-detail.js` |
| `task_assigned` | Fired when a user assigns or reassigns a task to a team member. | `src/pages/project-detail.js` |
| `settings_updated` | Fired when a user saves changes to their preferences. | `src/pages/settings.js` |
| `data_reset` | Fired when a user confirms resetting all application data to defaults. | `src/pages/settings.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1812994)
- [Daily Sign-ins](https://us.posthog.com/project/483112/insights/xYgIxs39) — sign-in volume over 30 days
- [Project Activity](https://us.posthog.com/project/483112/insights/HCoY3Zrw) — projects created vs deleted
- [Task Completions Over Time](https://us.posthog.com/project/483112/insights/EGJfOrVw) — task completion trend
- [Sign-in to Task Completion Funnel](https://us.posthog.com/project/483112/insights/RACf4f6o) — conversion funnel from sign-in → project → task → done
- [Task Actions Breakdown](https://us.posthog.com/project/483112/insights/8brepwHL) — task added / deleted / assigned stacked over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` to `.env.example` and any CI/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the wizard added an `identify` call in `src/main.js` on page load when a user is already in the store, but verify it fires correctly in your staging environment across a browser refresh.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
