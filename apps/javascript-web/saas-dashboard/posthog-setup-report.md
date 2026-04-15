<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrackFlow, a SaaS project management dashboard built with Vite and vanilla JavaScript.

A shared PostHog client (`src/posthog.js`) was created using the `posthog-node` SDK and initialized with environment variables. Event tracking was added across four files covering all key user actions: authentication (login and logout), project lifecycle (create and delete), task management (add, update status, delete, and assign), and settings changes. User identification is performed on login using `posthog.identify()` so that all subsequent events are linked to a named person profile. Exception autocapture is enabled globally via the `enableExceptionAutocapture: true` option.

| Event name | Description | File |
|---|---|---|
| `user logged in` | Fired when a user successfully authenticates via the login form | `src/pages/login.js` |
| `user logged out` | Fired when a user clicks the Sign Out button | `src/components/shell.js` |
| `project created` | Fired when a new project is successfully created via the New Project modal | `src/api.js` |
| `project deleted` | Fired when a project is deleted by the user | `src/api.js` |
| `task added` | Fired when a task is added to a project | `src/api.js` |
| `task status updated` | Fired when a task is moved between statuses (todo, in_progress, done) | `src/api.js` |
| `task deleted` | Fired when a task is deleted from a project | `src/api.js` |
| `task assigned` | Fired when a task is assigned or unassigned to a team member | `src/api.js` |
| `settings updated` | Fired when the user changes their preferences (theme, notifications) | `src/api.js` |
| `data reset` | Fired when the user resets all application data from the Danger Zone | `src/pages/settings.js` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with the following suggested insights:

- **Login funnel**: `user logged in` → `project created` → `task added` — shows how many users who log in go on to create projects and tasks
- **Active users trend**: trend of `user logged in` over time — shows daily/weekly active user count
- **Project churn**: count of `project deleted` events — watch for spikes that suggest frustration
- **Task completion rate**: `task status updated` filtered to `new_status = done` — measures how productive users are
- **Settings engagement**: `settings updated` broken down by property — shows which preferences users change most

You can build these at: https://us.i.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
