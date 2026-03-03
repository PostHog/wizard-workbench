<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into **TrackFlow**, a client-side SPA built with Vite. The integration uses the `posthog-node/edge` SDK (browser-compatible, no Node.js-specific APIs) with `flushAt: 1` and `flushInterval: 0` for immediate event delivery.

A shared PostHog client is initialised once in `src/posthog.js` and imported wherever events are needed. User identification is performed on login, and exception capture is added to error paths.

## Changes made

| File | Change |
|------|--------|
| `src/posthog.js` *(new)* | PostHog client singleton using `posthog-node/edge`, reads key and host from `VITE_POSTHOG_KEY` / `VITE_POSTHOG_HOST` |
| `.env` | `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` written |
| `src/pages/login.js` | `identify()` + `user_signed_in` capture on successful login; `captureException()` on auth failure |
| `src/components/shell.js` | `user_signed_out` capture before the session is cleared |
| `src/pages/projects.js` | `project_created` capture (with project id/name); `project_deleted` capture; `captureException()` on create failure |
| `src/pages/project-detail.js` | `task_created`, `task_status_updated`, `task_deleted`, `task_assigned` captures with contextual properties |
| `src/pages/settings.js` | `settings_updated` (per setting key + value); `data_reset` capture |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully authenticates. Also fires `identify()` to link future events to the known user. | `src/pages/login.js` |
| `user_signed_out` | User clicks Sign Out and the session is cleared. | `src/components/shell.js` |
| `project_created` | A new project is created. Top of the project conversion funnel. | `src/pages/projects.js` |
| `project_deleted` | A project (and all its tasks) is permanently deleted. Potential churn signal. | `src/pages/projects.js` |
| `task_created` | A task is added to a project, including priority. | `src/pages/project-detail.js` |
| `task_status_updated` | A task moves between columns (todo → in_progress → done). | `src/pages/project-detail.js` |
| `task_deleted` | A task is removed from a project. | `src/pages/project-detail.js` |
| `task_assigned` | A task is assigned to or unassigned from a team member. | `src/pages/project-detail.js` |
| `settings_updated` | A preference setting is changed (theme, email notifications, weekly digest). | `src/pages/settings.js` |
| `data_reset` | All app data is reset via the Danger Zone button. Strong frustration/churn signal. | `src/pages/settings.js` |

## Next steps

We've designed the following insights for an **"Analytics basics"** dashboard in PostHog. Create them at https://us.i.posthog.com/project/2/dashboards:

1. **User sign-ins over time** — Trend of `user_signed_in` events, broken down by `role` property. Monitors active user engagement.

2. **Project creation funnel** — Funnel: `project_created` → `task_created` → `task_status_updated` (filtered to `to_status = done`). Shows how many created projects result in completed work.

3. **Task completion rate** — Trend comparing `task_status_updated` (where `to_status = done`) vs total `task_created`. Tracks team productivity over time.

4. **Churn signals** — Trend of `project_deleted` + `data_reset` events. Elevated counts indicate user frustration.

5. **Settings adoption** — Breakdown of `settings_updated` by `setting` property (theme, email_notifications, weekly_digest). Shows which preferences users actively configure.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
