# PostHog post-wizard report

The wizard has completed a PostHog browser integration for TrackFlow. The `posthog-js` SDK is initialized at application startup using `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`. Existing signed-in users are identified on application load; successful logins identify the user with person properties, and logout captures the action before resetting identity. Autocapture and session recording remain enabled by default.

Product events cover project and task lifecycle actions plus preference changes. Event properties use stable internal IDs and categorical values only; user names and email addresses are kept exclusively in PostHog person properties. Caught login and project/task creation failures are sent to PostHog exception tracking.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | A user successfully signs in to the workspace. | `src/pages/login.js` |
| `project_created` | A user creates a project. | `src/pages/projects.js` |
| `project_deleted` | A user deletes a project. | `src/pages/projects.js` |
| `task_created` | A user adds a task to a project. | `src/pages/project-detail.js` |
| `task_status_updated` | A user changes a task status. | `src/pages/project-detail.js` |
| `task_assignee_updated` | A user changes a task assignee. | `src/pages/project-detail.js` |
| `task_deleted` | A user deletes a task. | `src/pages/project-detail.js` |
| `settings_updated` | A user changes an application preference. | `src/pages/settings.js` |
| `user_logged_out` | A user signs out of the workspace. | `src/components/shell.js` |

## Next steps

The PostHog MCP service was unavailable during this run, so the requested dashboard, insights, and mirrored notebook could not be created. Once the service is available, create **Analytics basics (wizard)** and add views for `user_logged_in`, `project_created`, `task_created`, `task_status_updated`, and `user_logged_out`.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
