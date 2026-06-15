<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TrackFlow SaaS dashboard — a vanilla JavaScript SPA using hash-based routing and Vite as the bundler.

A new `src/posthog.js` module initialises the PostHog client once using environment variables (`VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`). Every other file imports this singleton, so the SDK is guaranteed to be initialised before any `capture` or `identify` call is made.

User identification happens in two places: on explicit login (`src/pages/login.js`) and on page-refresh when a session is already stored in localStorage (`src/main.js`). `posthog.reset()` is called immediately before the browser navigates away from logout, so future anonymous events are not attributed to the previous user.

Exception capture (`posthog.captureException`) was added to every critical `try/catch` block across the instrumented files.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticates via the login form | `src/pages/login.js` |
| `project_created` | User creates a new project from the Projects page modal | `src/pages/projects.js` |
| `project_deleted` | User deletes a project from the Projects list | `src/pages/projects.js` |
| `project_viewed` | User opens a project detail page (top of task management funnel) | `src/pages/project-detail.js` |
| `task_created` | User adds a new task to a project | `src/pages/project-detail.js` |
| `task_status_updated` | User moves a task to a different status column | `src/pages/project-detail.js` |
| `task_deleted` | User deletes a task from a project board | `src/pages/project-detail.js` |
| `task_assigned` | User assigns (or re-assigns) a task to a team member | `src/pages/project-detail.js` |
| `settings_theme_changed` | User switches the UI theme (light / dark) | `src/pages/settings.js` |
| `settings_notifications_updated` | User toggles email notifications or weekly digest preferences | `src/pages/settings.js` |
| `data_reset` | User resets all application data via the Danger Zone button | `src/pages/settings.js` |
| `user_signed_out` | User clicks Sign Out in the top navigation bar | `src/components/shell.js` |

## Next steps

Dashboard creation was not possible in this run because the PostHog MCP API key is missing the required `dashboard:write`, `insight:write`, and `query:read` scopes. Once the key is updated, create a dashboard named **"Analytics basics (wizard)"** and add the following insights:

1. **Sign-in trend** — Trends: `user_signed_in` over time (daily). Tracks active-user growth.
2. **Project lifecycle funnel** — Funnel: `project_created` → `project_viewed` → `task_created` → `task_status_updated` (new_status = done). Measures end-to-end project engagement.
3. **Task completion rate** — Trends: `task_status_updated` filtered to `new_status = done` vs total `task_status_updated`. Captures team productivity.
4. **Churn signal** — Trends: `user_signed_out` and `data_reset` over time. High spikes may signal dissatisfaction.
5. **Settings engagement** — Trends: `settings_theme_changed` + `settings_notifications_updated` stacked. Shows configuration engagement depth.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production Vite bundle stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the wizard added this in `src/main.js` on page load, but verify that any future authentication flows (e.g. OAuth callbacks) also call `posthog.identify()`.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_web/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
