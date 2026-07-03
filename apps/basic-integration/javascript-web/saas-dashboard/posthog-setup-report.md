# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrackFlow, a Vite-based vanilla JavaScript SPA. PostHog is initialised once in `src/posthog.js` using environment variables and imported across the app. Users are identified on login (and on page refresh if already authenticated) via `posthog.identify()`, and `posthog.reset()` is called on logout to unlink sessions. Thirteen business events are captured across five files, covering authentication, project management, task management, settings, and error paths. `posthog.captureException()` is wired around key async error boundaries.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticated and logged into the app. | `src/pages/login.js` |
| `user_sign_in_failed` | User attempted to sign in but authentication failed. | `src/pages/login.js` |
| `user_signed_out` | User clicked Sign Out and was logged out of the app. | `src/components/shell.js` |
| `project_created` | User successfully created a new project. | `src/pages/projects.js` |
| `project_deleted` | User confirmed deletion of a project and all its tasks. | `src/pages/projects.js` |
| `project_viewed` | User opened a project detail page to view its task board. | `src/pages/project-detail.js` |
| `task_created` | User added a new task to a project. | `src/pages/project-detail.js` |
| `task_completed` | User moved a task to the done column. | `src/pages/project-detail.js` |
| `task_status_changed` | User moved a task to a non-done status (todo or in_progress). | `src/pages/project-detail.js` |
| `task_deleted` | User deleted a task from a project. | `src/pages/project-detail.js` |
| `task_assigned` | User assigned or unassigned a team member to a task. | `src/pages/project-detail.js` |
| `settings_updated` | User changed a setting such as theme, email notifications, or weekly digest. | `src/pages/settings.js` |
| `data_reset` | User confirmed resetting all app data to defaults. | `src/pages/settings.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793479)
- [Sign-ins over time](https://us.posthog.com/project/483112/insights/dpcnDmaN)
- [Project creation funnel](https://us.posthog.com/project/483112/insights/wHtc4htg)
- [Task completions over time](https://us.posthog.com/project/483112/insights/EjSwpU5G)
- [Daily active users](https://us.posthog.com/project/483112/insights/lruGkBSB)
- [Data reset events — churn signal](https://us.posthog.com/project/483112/insights/AimYZXUA)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` to `.env.example` (they are already there from the template) and any CI/monorepo bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production Vite-minified stack traces de-minify in PostHog error tracking.
- [ ] Confirm the returning-visitor path also calls `identify` — the wizard added this to `src/main.js` on startup, but verify it works correctly when a user refreshes the page while already authenticated.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
