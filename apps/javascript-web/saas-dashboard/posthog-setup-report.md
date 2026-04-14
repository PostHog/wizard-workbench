<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TrackFlow SaaS dashboard — a client-side Vite SPA. The `posthog-js` SDK was installed and a shared initialization module (`src/posthog.js`) was created. PostHog is initialized on app load with the project key and host from environment variables. Users are identified by their unique ID (with email, name, and role as person properties) on every login and on every page load if they are already authenticated. `posthog.reset()` is called on sign-out to unlink future events. Ten business-critical events are captured across five files, and `captureException` is wired into all relevant error paths.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully authenticated and logged in | `src/pages/login.js` |
| `user_sign_in_failed` | Login attempt failed due to invalid credentials | `src/pages/login.js` |
| `user_signed_out` | User explicitly signed out of the application | `src/components/shell.js` |
| `project_created` | A new project was created | `src/pages/projects.js` |
| `project_deleted` | A project and all its tasks were deleted | `src/pages/projects.js` |
| `task_created` | A new task was added to a project | `src/pages/project-detail.js` |
| `task_status_updated` | A task was moved to a new status column | `src/pages/project-detail.js` |
| `task_deleted` | A task was deleted from a project | `src/pages/project-detail.js` |
| `task_assigned` | A task was assigned to a team member | `src/pages/project-detail.js` |
| `settings_updated` | User changed one of their application settings | `src/pages/settings.js` |

## Next steps

We've outlined an **Analytics basics** dashboard with five key insights to build in PostHog. Use the links below to create each insight:

1. **Sign-in conversion funnel** — Login attempts → successful sign-ins
   https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_sign_in_failed","name":"user_sign_in_failed","type":"events"},{"id":"user_signed_in","name":"user_signed_in","type":"events"}]}

2. **Daily active users (sign-ins over time)**
   https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_in","name":"user_signed_in","type":"events"}]}

3. **Project creation trend**
   https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"project_created","name":"project_created","type":"events"}]}

4. **Task lifecycle funnel** — task created → task assigned → task completed
   https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"task_created","name":"task_created","type":"events"},{"id":"task_assigned","name":"task_assigned","type":"events"},{"id":"task_status_updated","name":"task_status_updated","type":"events","properties":[{"key":"new_status","value":"done","operator":"exact"}]}]}

5. **Project churn (deletions over time)**
   https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"project_deleted","name":"project_deleted","type":"events"}]}

Start your dashboard here: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
