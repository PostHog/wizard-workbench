<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TrackFlow SaaS dashboard. The integration uses `posthog-js` (browser SDK), initialised once in a dedicated `src/posthog.js` singleton and imported wherever analytics calls are needed. User identity is established on login via `posthog.identify()` and cleared on logout via `posthog.reset()`. Exception autocapture is enabled globally, and explicit `posthog.captureException()` calls are placed in every critical catch block. All sensitive values are stored in `.env` and referenced via Vite's `import.meta.env`.

| Event | Description | File |
|---|---|---|
| `user logged in` | User successfully signs in; also triggers `posthog.identify()` with name, email, role | `src/pages/login.js` |
| `user logged out` | User clicks Sign Out; triggers `posthog.reset()` to clear identity | `src/components/shell.js` |
| `project created` | User creates a new project (includes project_id, name, description) | `src/pages/projects.js` |
| `project deleted` | User deletes a project — potential churn signal | `src/pages/projects.js` |
| `task created` | User adds a task to a project (includes task_id, title, priority, project context) | `src/pages/project-detail.js` |
| `task status updated` | Task moved to any new status (todo → in_progress → done) | `src/pages/project-detail.js` |
| `task completed` | Task specifically moved to "done" — core engagement metric | `src/pages/project-detail.js` |
| `task deleted` | Task removed from a project | `src/pages/project-detail.js` |
| `task assigned` | Task assigned to a team member | `src/pages/project-detail.js` |
| `settings updated` | User changes a preference — theme, email notifications, or weekly digest | `src/pages/settings.js` |
| `data reset` | User resets all application data — strong frustration/churn signal | `src/pages/settings.js` |

## Next steps

To see your analytics, log in to PostHog and build insights using the events above. Recommended insights to create:

1. **Login → Project Created funnel** — Funnel with steps: `user logged in` → `project created`. Measures onboarding conversion.
2. **Task completion rate over time** — Trend of `task completed` events per week. Core engagement metric.
3. **Project deletions (churn signal)** — Trend of `project deleted` events. Monitor for spikes.
4. **Settings changes breakdown** — `settings updated` broken down by the `setting` property. See which preferences users change most.
5. **Data resets** — Trend of `data reset` events. A spike here indicates user frustration.

You can build these at: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
