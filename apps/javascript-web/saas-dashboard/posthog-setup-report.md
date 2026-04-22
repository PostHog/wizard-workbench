<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrackFlow, a client-side SPA project management dashboard built with Vite and vanilla JavaScript.

**What was added:**

- `src/posthog.js` — new PostHog client module that initializes `posthog-js` with environment variables and enables automatic exception capture.
- `src/main.js` — imports the PostHog module at startup to initialize analytics before any routes render.
- `src/pages/login.js` — identifies users on successful sign-in (name, email, role) and captures the `user signed in` event. Calls `posthog.captureException()` on login failure.
- `src/pages/projects.js` — captures `project created` and `project deleted` events with relevant properties. Exception tracking on load errors and create errors.
- `src/pages/project-detail.js` — captures `task created`, `task status updated`, `task assigned`, and `task deleted` with contextual properties (project ID, task ID, priority, status). Exception tracking on load and create errors.
- `src/pages/settings.js` — captures `settings updated` (with which setting changed and its new value) and `data reset`. Exception tracking on load errors.
- `src/components/shell.js` — captures `user signed out` before logout and calls `posthog.reset()` to clear the identified user session.

**Environment variables** were written to `.env`:
- `VITE_PUBLIC_POSTHOG_KEY` — PostHog project token (referenced via `import.meta.env`)
- `VITE_PUBLIC_POSTHOG_HOST` — PostHog host URL

| Event | Description | File |
|---|---|---|
| `user signed in` | User successfully authenticated and logged in to TrackFlow | `src/pages/login.js` |
| `user signed out` | User clicked Sign Out from the app shell | `src/components/shell.js` |
| `project created` | User created a new project | `src/pages/projects.js` |
| `project deleted` | User deleted a project and all its tasks | `src/pages/projects.js` |
| `task created` | User added a new task to a project | `src/pages/project-detail.js` |
| `task status updated` | User moved a task to a different status column | `src/pages/project-detail.js` |
| `task deleted` | User deleted a task from a project | `src/pages/project-detail.js` |
| `task assigned` | User assigned or unassigned a task to a team member | `src/pages/project-detail.js` |
| `settings updated` | User changed a preference setting (theme or notifications) | `src/pages/settings.js` |
| `data reset` | User reset all application data to defaults | `src/pages/settings.js` |

## Next steps

Here are some recommended insights to build in your PostHog dashboard:

1. **Login → Project Created funnel** — Track conversion from `user signed in` → `project created` to understand how many new sessions lead to project creation.
2. **Task completion funnel** — Track `task created` → `task status updated` (where `new_status = done`) to measure task completion rates.
3. **Daily active users trend** — Count unique users on `user signed in` over time to track engagement.
4. **Settings adoption** — Break down `settings updated` by `setting` property to see which preferences users change most.
5. **Churn signal: data reset** — Monitor `data reset` events as a potential frustration indicator.

Log in to your PostHog instance at https://us.i.posthog.com and navigate to **Insights** to build these using the event names above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
