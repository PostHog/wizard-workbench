# PostHog post-wizard report

The wizard integrated the PostHog JavaScript SDK into this Vite application, initialized it from environment variables, preserved default autocapture and session recording, enabled exception autocapture, identified authenticated users on login and returning visits, reset identity on logout, and instrumented the key project-management workflows. The production build completed successfully.

| Event | Description | File |
| --- | --- | --- |
| `user_logged_in` | A team member successfully signed in. | `src/pages/login.js` |
| `project_created` | A team member created a new project. | `src/pages/projects.js` |
| `project_deleted` | A team member deleted a project. | `src/pages/projects.js` |
| `task_created` | A team member added a task to a project. | `src/pages/project-detail.js` |
| `task_status_changed` | A team member moved a task to a different workflow status. | `src/pages/project-detail.js` |
| `task_assigned` | A team member changed a task assignment. | `src/pages/project-detail.js` |
| `task_deleted` | A team member deleted a task from a project. | `src/pages/project-detail.js` |
| `settings_updated` | A team member changed an application preference. | `src/pages/settings.js` |
| `data_reset` | A team member reset application data to defaults. | `src/pages/settings.js` |
| `user_logged_out` | A team member signed out. | `src/components/shell.js` |

## Next steps

The PostHog dashboard and notebook could not be created because the PostHog MCP server was unavailable during setup. Once connectivity is restored, create **Analytics basics (wizard)** with views for login-to-project creation conversion, task creation-to-completion conversion, project and task deletion trends, task status changes, and settings updates.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` to any monorepo or bootstrap scripts used to provision collaborator environments.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the Vite upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path calls `identify` with the authenticated user after persisted state loads.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
