<wizard-report>
# PostHog post-wizard report

The wizard has completed a PostHog analytics integration for the TrackFlow SPA. The `posthog-js` browser SDK was installed and initialized via a shared singleton (`src/posthog.js`), with credentials read from Vite environment variables. Event tracking and user identification were added to five source files covering login, logout, project management, task management, and settings.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully logs in with their email | `src/pages/login.js` |
| `user_signed_out` | User clicks Sign Out from the app shell | `src/components/shell.js` |
| `project_created` | User creates a new project via the New Project modal | `src/pages/projects.js` |
| `project_deleted` | User deletes a project from the projects list | `src/pages/projects.js` |
| `task_created` | User adds a new task to a project via the Add Task modal | `src/pages/project-detail.js` |
| `task_status_updated` | User moves a task to a different status column on the board | `src/pages/project-detail.js` |
| `task_deleted` | User deletes a task from the project board | `src/pages/project-detail.js` |
| `task_assigned` | User assigns or unassigns a task to a team member | `src/pages/project-detail.js` |
| `settings_updated` | User changes a preference (theme, notifications, weekly digest) | `src/pages/settings.js` |
| `data_reset` | User resets all application data from the Danger Zone | `src/pages/settings.js` |

## Next steps

Create a dashboard named **"Analytics basics (wizard)"** in PostHog with the following suggested insights:

- **Sign-in → project created funnel** — Conversion from `user_signed_in` → `project_created` to measure activation.
- **Task completion rate** — Trend of `task_status_updated` where `new_status = done` over time.
- **Task creation trend** — Daily `task_created` events, broken down by `task_priority`.
- **Project churn** — Trend of `project_deleted` events to monitor project abandonment.
- **Settings engagement** — Trend of `settings_updated` broken down by `setting`.

[Create a dashboard in PostHog](https://us.posthog.com/project/2/dashboards)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` to `.env.example` and any CI/CD secrets so collaborators know what to set. *(`.env.example` already has the correct names — ensure CI populates real values.)*
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login. Consider re-identifying on app load when a user session is already stored in `localStorage`.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
