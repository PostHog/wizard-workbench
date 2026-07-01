<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Vite-based JavaScript SPA (TrackFlow). PostHog is initialized in `src/posthog.js` using Vite environment variables and imported wherever analytics are needed. Users are identified on login and on page load when already authenticated; the session is reset on logout. Twelve events covering the full user lifecycle — authentication, project management, task operations, and settings changes — have been instrumented across six source files. Exception capture is wired into every error-handling catch block that corresponds to a user-facing action.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in via the login form. | `src/pages/login.js` |
| `login_failed` | User attempted to sign in but provided invalid credentials. | `src/pages/login.js` |
| `user_signed_out` | User clicks the Sign Out button from any page. | `src/components/shell.js` |
| `project_created` | User creates a new project via the New Project modal. | `src/pages/projects.js` |
| `project_deleted` | User deletes a project and all its tasks. | `src/pages/projects.js` |
| `task_created` | User adds a new task to a project. | `src/pages/project-detail.js` |
| `task_status_updated` | User moves a task to a different status column on the board. | `src/pages/project-detail.js` |
| `task_deleted` | User deletes a task from a project. | `src/pages/project-detail.js` |
| `task_assigned` | User assigns or reassigns a task to a team member. | `src/pages/project-detail.js` |
| `settings_theme_changed` | User changes the app theme between light and dark. | `src/pages/settings.js` |
| `settings_notifications_changed` | User toggles email notifications or weekly digest preference. | `src/pages/settings.js` |
| `settings_data_reset` | User resets all app data to defaults from the Danger Zone. | `src/pages/settings.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1787375)
- [User Sign-ins trend](https://us.i.posthog.com/project/483112/insights/XqOSRRdl)
- [Project Lifecycle (created vs deleted)](https://us.i.posthog.com/project/483112/insights/Mwm0PhC0)
- [Task Creation vs Completion](https://us.i.posthog.com/project/483112/insights/zAsMIvD3)
- [User Conversion Funnel (sign-in → project → task)](https://us.i.posthog.com/project/483112/insights/u3A809RH)
- [Failed Logins trend](https://us.i.posthog.com/project/483112/insights/CtlWCbz4)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
