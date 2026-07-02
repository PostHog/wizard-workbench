# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrackFlow, a client-side SPA built with Vite and vanilla JavaScript. A new `src/posthog.js` module initialises the `posthog-js` SDK using environment variables; `src/main.js` imports it to guarantee early initialisation. `posthog.identify()` is called at login to associate future events with the authenticated user. Ten business-critical events are now captured across five page modules, plus automatic exception capture where operations can fail.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully logs in to TrackFlow. | `src/pages/login.js` |
| `project_created` | Fired when a user creates a new project. | `src/pages/projects.js` |
| `project_deleted` | Fired when a user deletes a project and all its tasks. | `src/pages/projects.js` |
| `task_created` | Fired when a user adds a new task to a project. | `src/pages/project-detail.js` |
| `task_status_updated` | Fired when a user moves a task to a different status column. | `src/pages/project-detail.js` |
| `task_completed` | Fired when a task is moved to the done status, indicating completion. | `src/pages/project-detail.js` |
| `task_assigned` | Fired when a task is assigned to (or unassigned from) a team member. | `src/pages/project-detail.js` |
| `task_deleted` | Fired when a user deletes a task from a project. | `src/pages/project-detail.js` |
| `settings_updated` | Fired when a user changes any app setting such as theme or notification preferences. | `src/pages/settings.js` |
| `data_reset` | Fired when a user resets all application data to defaults. | `src/pages/settings.js` |

## Next steps

The PostHog management API requires a Personal API Key, which was not available during this run. To create a dashboard with insights based on the events above, visit your PostHog project and create a new dashboard named **"Analytics basics (wizard)"** with these suggested insights:

1. **Sign-in volume** — Trend of `user_signed_in` over time.
2. **Project creation funnel** — Conversion from `user_signed_in` → `project_created` → `task_created`.
3. **Task completion rate** — `task_completed` ÷ `task_created` as a ratio insight.
4. **Data reset churn signal** — Trend of `data_reset` — spikes indicate user frustration.
5. **Settings engagement** — Breakdown of `settings_updated` by the `setting` property.

[DASHBOARD_URL] https://us.i.posthog.com/project/483112/dashboards

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST`) to `.env.example` with their actual values (or confirm the placeholder values are updated).
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
