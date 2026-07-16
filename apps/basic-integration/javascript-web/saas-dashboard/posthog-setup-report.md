# PostHog post-wizard report

PostHog has been integrated into the TrackFlow Vite SPA with the `posthog-js` SDK. The browser SDK initializes from `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`, preserves the SDK defaults for autocapture and session recording, and uses history-based pageview capture for the hash-routed application.

Authenticated users are identified with their stable member ID and person properties on login and on each authenticated shell render. Sign-out resets PostHog identity. Product actions now capture privacy-safe identifiers and categorical metadata only.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | A user successfully signs in. | `src/pages/login.js` |
| `project_created` | A user creates a project. | `src/pages/projects.js` |
| `project_deleted` | A user deletes a project. | `src/pages/projects.js` |
| `task_created` | A user adds a task to a project. | `src/pages/project-detail.js` |
| `task_status_updated` | A user moves a task to a new status. | `src/pages/project-detail.js` |
| `task_assigned` | A user assigns or unassigns a task. | `src/pages/project-detail.js` |

## Next steps

The local integration is complete and `npm run build` passed. The PostHog dashboard and in-app notebook could not be created because the configured PostHog MCP service refused connections at its local endpoint. Reconnect the PostHog MCP service and create an `Analytics basics (wizard)` dashboard using the events above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

An agent skill folder remains in the project for future PostHog-related development.
