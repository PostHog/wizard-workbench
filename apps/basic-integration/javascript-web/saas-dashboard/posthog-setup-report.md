<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrackFlow, a Vite-based SaaS project management SPA. A new `src/posthog.js` module initialises the `posthog-js` browser SDK using `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` environment variables. `posthog.identify()` is called on successful login to link all subsequent events to the authenticated user, and `posthog.reset()` is called on logout to start a clean anonymous session. Eleven events covering the full user lifecycle — from sign-in through project and task management to settings changes — have been added across five source files.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | A user successfully authenticated and was redirected to the dashboard. | `src/pages/login.js` |
| `user_signed_out` | A user clicked Sign Out from the app shell. | `src/components/shell.js` |
| `project_created` | A new project was created via the New Project modal. | `src/pages/projects.js` |
| `project_deleted` | A project and all its tasks were deleted from the projects list. | `src/pages/projects.js` |
| `task_added` | A new task was added to a project via the Add Task modal. | `src/pages/project-detail.js` |
| `task_status_updated` | A task was moved to a different status column on the board. | `src/pages/project-detail.js` |
| `task_assigned` | A task was assigned to or unassigned from a team member. | `src/pages/project-detail.js` |
| `task_deleted` | A task was removed from a project board. | `src/pages/project-detail.js` |
| `theme_changed` | The user switched the UI theme between light and dark mode. | `src/pages/settings.js` |
| `notification_settings_updated` | The user toggled email notifications or weekly digest preferences. | `src/pages/settings.js` |
| `data_reset` | The user confirmed resetting all app data back to defaults. | `src/pages/settings.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/2/dashboard/1720023)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
