<wizard-report>
# PostHog post-wizard report

The wizard has completed a PostHog analytics integration for the TrackFlow SPA. The `posthog-js` package was installed, a dedicated initialization module was created (`src/posthog.js`), and PostHog is imported first in `src/main.js` to ensure it initializes before any routing occurs. Users are identified on login with their ID, email, name, and role as person properties, re-identified on page refresh if their session persists in localStorage, and `posthog.reset()` is called on logout to cleanly unlink future events. Ten business-critical events are now captured across five files.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully completes the login form and is authenticated. | `src/pages/login.js` |
| `user_signed_out` | Fired when a user clicks the Sign Out button from the app shell. | `src/components/shell.js` |
| `project_created` | Fired when a user submits the new project form and the project is successfully created. | `src/pages/projects.js` |
| `project_deleted` | Fired when a user confirms deletion of a project. | `src/pages/projects.js` |
| `task_added` | Fired when a user submits the add task form and a new task is created within a project. | `src/pages/project-detail.js` |
| `task_status_changed` | Fired when a user moves a task to a different status column on the board. | `src/pages/project-detail.js` |
| `task_deleted` | Fired when a user deletes a task from a project board. | `src/pages/project-detail.js` |
| `task_assigned` | Fired when a user assigns or reassigns a task to a team member. | `src/pages/project-detail.js` |
| `settings_updated` | Fired when a user changes a preference setting such as theme or notification toggles. | `src/pages/settings.js` |
| `data_reset` | Fired when a user confirms resetting all application data to defaults. | `src/pages/settings.js` |

## Next steps

We've set up a dashboard and insights for you to keep an eye on user behavior. The PostHog API key used during setup was missing the `dashboard:write` scope, so the dashboard could not be created automatically — create it manually at:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard)
- [New Insight](https://us.posthog.com/project/2/insights/new)

Suggested insights to add to an **"Analytics basics (wizard)"** dashboard:

1. **Logins over time** — Trends: `user_signed_in` count per day
2. **Projects created vs deleted** — Trends: `project_created` and `project_deleted` counts
3. **Task activity** — Trends: `task_added`, `task_status_changed`, `task_deleted` counts
4. **Task completion funnel** — Funnel: `task_added` → `task_status_changed` (status = done)
5. **Settings engagement** — Trends: `settings_updated` breakdown by `setting` property

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the wizard added re-identification in `main.js` on page load when a session exists in localStorage, but verify this covers all re-entry scenarios in your deployment.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
