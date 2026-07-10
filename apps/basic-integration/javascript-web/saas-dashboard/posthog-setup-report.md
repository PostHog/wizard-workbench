<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was installed for this Vite-powered vanilla JavaScript SPA, initialized from environment variables in a dedicated helper, and wired into the app startup so analytics is ready before any captures occur. The integration also adds user identification on login and refresh, resets identity on logout, captures key business actions across authentication, project management, task workflow, and settings, and enables browser-side exception capture for important failure paths.

| Event name | Description | File |
| --- | --- | --- |
| user_signed_in | Captures successful sign-ins after demo credentials are validated. | src/pages/login.js |
| login_failed | Captures failed sign-in attempts when submitted credentials are rejected. | src/pages/login.js |
| project_created | Captures creation of a new project from the projects workspace. | src/pages/projects.js |
| project_deleted | Captures deletion of a project from the projects workspace. | src/pages/projects.js |
| task_created | Captures creation of a new task within a project board. | src/pages/project-detail.js |
| task_status_changed | Captures workflow status changes when a task moves between columns. | src/pages/project-detail.js |
| task_assigned | Captures assignment changes for tasks on the project board. | src/pages/project-detail.js |
| task_deleted | Captures deletion of tasks from a project board. | src/pages/project-detail.js |
| settings_updated | Captures preference updates made from the settings screen. | src/pages/settings.js |
| workspace_reset | Captures full workspace resets triggered from the danger zone. | src/pages/settings.js |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831044)
- [Project creation trend (wizard)](https://us.posthog.com/project/483112/insights/gXIy877n)
- [Task status changes by destination (wizard)](https://us.posthog.com/project/483112/insights/rTNMAm2B)
- [Settings updates by preference (wizard)](https://us.posthog.com/project/483112/insights/DLLJM4HA)
- [Sign-in to project creation funnel (wizard)](https://us.posthog.com/project/483112/insights/wYUjQ1uL)
- [Task deletion trend (wizard)](https://us.posthog.com/project/483112/insights/bOXl3vNf)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
