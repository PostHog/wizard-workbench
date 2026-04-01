<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrackFlow, a client-side Vite SPA project management application. The `posthog-node` SDK (v5) was installed and a shared `src/posthog.js` singleton was created. Event tracking, user identification, and exception capture were added across six files covering all critical user flows: authentication, project management, task lifecycle, and settings changes.

## Changes made

### New files
- **`src/posthog.js`** — PostHog singleton initialized from `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables with `enableExceptionAutocapture: true`.
- **`.env`** — `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` written (gitignore coverage ensured).

### Modified files
- **`src/pages/login.js`** — `posthog.identify()` on successful login; `user logged in` capture; `captureException` on auth failure.
- **`src/components/shell.js`** — `user logged out` capture before navigating away.
- **`src/pages/projects.js`** — `project created` and `project deleted` captures; `captureException` on load/create errors.
- **`src/pages/project-detail.js`** — `task created`, `task status updated`, `task deleted`, `task assigned` captures; `captureException` on load/create errors.
- **`src/pages/settings.js`** — `settings updated` (per setting) and `data reset` captures; `captureException` on load errors.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user logged in` | User successfully authenticates; triggers `identify()` with name, email, role | `src/pages/login.js` |
| `user logged out` | User signs out of the application | `src/components/shell.js` |
| `project created` | A new project is created; includes name, id, description | `src/pages/projects.js` |
| `project deleted` | A project is deleted; includes project id and name | `src/pages/projects.js` |
| `task created` | A task is added to a project; includes title, priority, project | `src/pages/project-detail.js` |
| `task status updated` | A task is moved between columns; includes previous/new status | `src/pages/project-detail.js` |
| `task deleted` | A task is removed from a project | `src/pages/project-detail.js` |
| `task assigned` | A task is assigned to a team member | `src/pages/project-detail.js` |
| `settings updated` | A user preference is changed; includes setting name and new value | `src/pages/settings.js` |
| `data reset` | All application data is reset to defaults (high-signal churn indicator) | `src/pages/settings.js` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Login conversion funnel** — Funnel: `user logged in` → `project created` → `task created` → `task status updated` (status = done). Tracks full onboarding-to-value path.
2. **Daily active users** — Unique users who triggered `user logged in` over time.
3. **Task completion rate** — `task status updated` filtered to `new_status = done`, grouped over time. Core product engagement metric.
4. **Churn signals** — `data reset` event count over time. High frequency is an early warning sign.
5. **Top settings changes** — `settings updated` breakdown by `setting` property. Reveals which preferences users care about most.

To create this dashboard, visit your PostHog project and navigate to **Dashboards → New dashboard → "Analytics basics"**, then add each insight using the event names above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
