<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for TrackFlow, a Vite-based vanilla JS SPA. A new `src/posthog.js` singleton initialises `posthog-js` using environment variables, and that singleton is imported into every page/component that captures events. Users are identified by their internal ID (name, role as person properties) immediately on login and re-identified on every page load when a session is already active. `posthog.reset()` is called on logout to unlink the device from the outgoing user. Error tracking via `captureException` was added to all critical async paths.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticates with their email address. | `src/pages/login.js` |
| `user_signed_out` | User clicks the Sign Out button to end their session. | `src/components/shell.js` |
| `project_created` | User creates a new project with a name and description. | `src/pages/projects.js` |
| `project_deleted` | User deletes a project and all its associated tasks. | `src/pages/projects.js` |
| `project_viewed` | User opens a project detail page to view its kanban board. | `src/pages/project-detail.js` |
| `task_created` | User adds a new task to a project with a title and priority. | `src/pages/project-detail.js` |
| `task_status_changed` | User moves a task to a different status column on the board. | `src/pages/project-detail.js` |
| `task_completed` | User marks a task as done, representing a key completion event. | `src/pages/project-detail.js` |
| `task_deleted` | User removes a task from a project. | `src/pages/project-detail.js` |
| `task_assigned` | User assigns a task to a team member. | `src/pages/project-detail.js` |
| `settings_updated` | User changes a preference such as theme or notification settings. | `src/pages/settings.js` |
| `data_reset` | User resets all application data back to the default state. | `src/pages/settings.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818141)
- [Daily sign-ins](https://us.posthog.com/project/483112/insights/nQf1VUDD) — Line chart of sign-ins over the last 30 days
- [Project created vs deleted](https://us.posthog.com/project/483112/insights/0fwf32ni) — Weekly bar chart comparing project creation and deletion
- [Task created → completed funnel](https://us.posthog.com/project/483112/insights/QDTd4Iwn) — Conversion funnel from task creation to completion
- [Task completions over time](https://us.posthog.com/project/483112/insights/49kV3nC5) — Area chart of daily task completions
- [Settings changes by type](https://us.posthog.com/project/483112/insights/wPrpfS4p) — Bar chart of settings_updated events broken down by setting name

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` to `.env.example` and any CI/CD environment variable configuration so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the wizard added a re-identify block in `src/main.js` that fires on every page load when a session is active, but verify it behaves correctly in your staging environment.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
