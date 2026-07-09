<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this TrackFlow vanilla JavaScript Vite app with PostHog. It installed the `posthog-js` SDK, initialized PostHog from Vite environment variables, identified authenticated users on login and returning sessions, reset identity on logout, and added targeted product analytics plus exception capture around the main workflow actions for projects, tasks, and settings.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures successful sign-in for an authenticated team member. | `src/pages/login.js` |
| `user_logged_out` | Captures when an authenticated team member signs out. | `src/components/shell.js` |
| `project_created` | Captures creation of a new project from the projects list. | `src/pages/projects.js` |
| `project_deleted` | Captures deletion of an existing project. | `src/pages/projects.js` |
| `task_created` | Captures addition of a new task within a project board. | `src/pages/project-detail.js` |
| `task_status_changed` | Captures movement of a task between workflow states. | `src/pages/project-detail.js` |
| `task_assigned` | Captures assignment or unassignment of a task to a team member. | `src/pages/project-detail.js` |
| `task_deleted` | Captures deletion of a task from a project board. | `src/pages/project-detail.js` |
| `settings_updated` | Captures preference changes made from the settings screen. | `src/pages/settings.js` |
| `workspace_reset` | Captures resetting demo workspace data back to defaults. | `src/pages/settings.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825354
- Insight: Logins over time (wizard) — https://us.posthog.com/project/483112/insights/vsKr0St6
- Insight: Project creation to first task funnel (wizard) — https://us.posthog.com/project/483112/insights/YYVfG2ts
- Insight: Task status changes by destination (wizard) — https://us.posthog.com/project/483112/insights/NsvpBzRj
- Insight: Task assignments over time (wizard) — https://us.posthog.com/project/483112/insights/55g5o5yq
- Insight: Settings changes by preference (wizard) — https://us.posthog.com/project/483112/insights/HWpc4sCn

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
