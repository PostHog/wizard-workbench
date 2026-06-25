<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for **TrackFlow**, a vanilla JavaScript SPA built with Vite. A new `src/posthog.js` singleton initialises `posthog-js` from environment variables, and event capture calls have been added to every key user flow. Users are identified on login with `posthog.identify()` and the session is cleared with `posthog.reset()` on logout. `posthog.captureException()` has been added to the main error handlers in the projects, project-detail, and dashboard pages so unexpected failures surface automatically in PostHog's error tracking.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully signs in with their email. | `src/pages/login.js` |
| `user_logged_out` | Fired when a user clicks the logout button. | `src/components/shell.js` |
| `project_created` | Fired when a user creates a new project. | `src/pages/projects.js` |
| `project_deleted` | Fired when a user deletes a project. | `src/pages/projects.js` |
| `task_created` | Fired when a user adds a new task to a project. | `src/pages/project-detail.js` |
| `task_status_updated` | Fired when a user moves a task to a different status column. | `src/pages/project-detail.js` |
| `task_deleted` | Fired when a user deletes a task from a project. | `src/pages/project-detail.js` |
| `task_assigned` | Fired when a user assigns or unassigns a task to a team member. | `src/pages/project-detail.js` |
| `settings_theme_changed` | Fired when a user changes the application theme. | `src/pages/settings.js` |
| `settings_notifications_updated` | Fired when a user toggles email notifications or weekly digest settings. | `src/pages/settings.js` |
| `data_reset` | Fired when a user resets all application data to defaults. | `src/pages/settings.js` |

## Next steps

We've built some insights and added them to your PostHog dashboard:

- [Dashboard — Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1751155)
- [User sign-ins over time](https://us.posthog.com/project/483112/insights/8fXLAotV)
- [Project creation vs deletion](https://us.posthog.com/project/483112/insights/bmFqvXXX)
- [Task actions breakdown](https://us.posthog.com/project/483112/insights/elz16mN7)
- [Project to task completion funnel](https://us.posthog.com/project/483112/insights/iraiMXNr)
- [Login to project action funnel](https://us.posthog.com/project/483112/insights/2PNKS8d2)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set. (Both keys are already present in `.env.example` in this project.)
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
