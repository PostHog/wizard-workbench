<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into **TrackFlow**, a client-side SPA built with Vite. The `posthog-js` SDK was installed and initialised via a dedicated `src/posthog.js` module (imported once in `src/main.js`). User identification is performed on login using the user's internal ID and role. All key user actions — from signing in to managing projects and tasks — now emit PostHog capture calls with contextual properties. Error-autocapture is enabled via the `enableExceptionAutocapture` option, and `posthog.reset()` is called on sign-out to clear the anonymous/identified session.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in with their email. | `src/pages/login.js` |
| `login_failed` | A login attempt failed due to invalid credentials. | `src/pages/login.js` |
| `user_signed_out` | User clicks the Sign Out button to end their session. | `src/components/shell.js` |
| `project_created` | User creates a new project with a name and description. | `src/pages/projects.js` |
| `project_deleted` | User deletes a project and all its tasks. | `src/pages/projects.js` |
| `task_created` | User adds a new task to a project with a title and priority. | `src/pages/project-detail.js` |
| `task_status_updated` | User moves a task to a different status column on the board. | `src/pages/project-detail.js` |
| `task_deleted` | User deletes a task from a project. | `src/pages/project-detail.js` |
| `task_assigned` | User assigns or unassigns a task to a team member. | `src/pages/project-detail.js` |
| `settings_updated` | User changes a preference such as theme or notification settings. | `src/pages/settings.js` |
| `data_reset` | User resets all application data back to defaults. | `src/pages/settings.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behaviour, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1761162)
- [User sign-ins over time](https://us.posthog.com/project/483112/insights/9RXSWbZm)
- [Login failures](https://us.posthog.com/project/483112/insights/40Qeb4ZY)
- [Project creation vs deletion](https://us.posthog.com/project/483112/insights/NiyI5pUO)
- [Task lifecycle funnel](https://us.posthog.com/project/483112/insights/8JaTdrDm)
- [Settings changes over time](https://us.posthog.com/project/483112/insights/1maf1mBD)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
