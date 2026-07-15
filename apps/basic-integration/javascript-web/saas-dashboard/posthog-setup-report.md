# PostHog post-wizard report

PostHog analytics has been integrated into the TrackFlow Vite JavaScript application. The browser SDK is initialized at startup using Vite environment variables, authenticated users are identified on login and returning sessions, and logout resets the PostHog identity. Key project, task, settings, and authentication actions now emit analytics events. Relevant caught login and project/task errors are sent to PostHog exception tracking.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | A user successfully signs in to the application. | `src/pages/login.js` |
| `user_logged_out` | A user signs out of the application. | `src/components/shell.js` |
| `project_created` | A user successfully creates a project. | `src/pages/projects.js` |
| `project_deleted` | A user confirms deletion of a project. | `src/pages/projects.js` |
| `task_created` | A user successfully adds a task to a project. | `src/pages/project-detail.js` |
| `task_status_updated` | A user moves a task to a different workflow status. | `src/pages/project-detail.js` |
| `task_assigned` | A user assigns or unassigns a task. | `src/pages/project-detail.js` |
| `task_deleted` | A user deletes a task from a project. | `src/pages/project-detail.js` |
| `settings_updated` | A user changes an application preference. | `src/pages/settings.js` |

## Next steps

No PostHog dashboard or notebook was created because the PostHog MCP server was unavailable during this run. The local report is the available setup record.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` to `.env.example` and any collaborator bootstrap documentation.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler's upload step) into CI for production stack traces.
- [ ] Confirm the returning-visitor path identifies an already logged-in user.

### Agent skill

The installed agent skill folder contains the integration references used for this setup.
