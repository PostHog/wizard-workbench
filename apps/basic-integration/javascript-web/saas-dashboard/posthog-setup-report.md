<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrackFlow, a client-side Vite SPA. PostHog is initialized in a dedicated `src/posthog.js` module and imported throughout the app. Users are identified on login and on page load when already authenticated. Logout calls `posthog.reset()` to unlink future events. Eleven key business events are tracked across five files, covering the full user lifecycle from sign-in through project and task management to settings changes.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully logs in with their email | `src/pages/login.js` |
| `login_failed` | User attempted to log in but authentication failed | `src/pages/login.js` |
| `user_signed_out` | User clicks Sign Out and is logged out | `src/components/shell.js` |
| `project_created` | User creates a new project with a name and description | `src/pages/projects.js` |
| `project_deleted` | User deletes a project and all its associated tasks | `src/pages/projects.js` |
| `task_added` | User adds a new task to a project with a title and priority | `src/pages/project-detail.js` |
| `task_status_updated` | User moves a task to a different status (todo, in_progress, or done) | `src/pages/project-detail.js` |
| `task_assigned` | User assigns a task to a team member or unassigns it | `src/pages/project-detail.js` |
| `task_deleted` | User deletes a task from a project | `src/pages/project-detail.js` |
| `settings_updated` | User changes a preference setting (theme, notifications) | `src/pages/settings.js` |
| `data_reset` | User resets all application data to defaults | `src/pages/settings.js` |

## Next steps

We've prepared an "Analytics basics (wizard)" dashboard for you. Create it at the link below and add these five insights to monitor user behavior:

1. **Sign-in trend** — `user_signed_in` over time (Trends insight) to track daily active logins
2. **Login failures** — `login_failed` over time to monitor authentication issues
3. **Project activity** — `project_created` vs `project_deleted` as a stacked trend to track net project growth
4. **Task lifecycle funnel** — `task_added` → `task_status_updated` (done) funnel to measure task completion rate
5. **Settings changes breakdown** — `settings_updated` broken down by `setting` property to see which preferences users change most

- [Dashboard (create here)](https://us.posthog.com/project/2/dashboard)
- [All Insights](https://us.posthog.com/project/2/insights)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on fresh login AND on page load if a user is already logged in (via `store.state.currentUser` in `main.js`), which covers both paths.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
