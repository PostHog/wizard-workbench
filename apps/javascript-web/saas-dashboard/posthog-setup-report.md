<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TrackFlow SaaS dashboard. The `posthog-js` SDK was installed and initialized with autocapture and exception tracking enabled. A central `src/posthog.js` utility file was created for consistent SDK access. Users are identified on login using `posthog.identify()` with their profile properties (email, name, role). Ten custom events covering the full user journey—from sign-in to project and task management—were instrumented across five files. Exception capture (`posthog.captureException`) was added to all critical error boundaries.

| Event | Description | File |
|---|---|---|
| `user signed in` | Triggered when a user successfully logs in. Includes `email` and `role` properties. Also calls `posthog.identify()` to link the user's profile. | `src/pages/login.js` |
| `project created` | Triggered when a user creates a new project. Includes `project_id` and `project_name`. | `src/pages/projects.js` |
| `project deleted` | Triggered when a user deletes a project. Includes `project_id` and `project_name`. Important churn signal. | `src/pages/projects.js` |
| `task created` | Triggered when a user adds a new task to a project. Includes `project_id`, `project_name`, `task_id`, `task_title`, and `priority`. | `src/pages/project-detail.js` |
| `task completed` | Triggered when a task is moved to "done" status. Includes `project_id`, `project_name`, `task_id`, and `task_title`. | `src/pages/project-detail.js` |
| `task status updated` | Triggered when a task is moved to any non-done status. Includes `project_id`, `project_name`, `task_id`, `task_title`, and `new_status`. | `src/pages/project-detail.js` |
| `task deleted` | Triggered when a user deletes a task. Includes `project_id`, `project_name`, `task_id`, and `task_title`. | `src/pages/project-detail.js` |
| `task assigned` | Triggered when a user assigns or unassigns a task. Includes `project_id`, `project_name`, `task_id`, `assignee_id`, and `assignee_name`. | `src/pages/project-detail.js` |
| `settings updated` | Triggered when a user changes a preference. Includes `setting` (theme, email_notifications, or weekly_digest) and `value`. | `src/pages/settings.js` |
| `data reset` | Triggered when a user resets all app data to defaults. Strong frustration/churn signal. | `src/pages/settings.js` |

## Next steps

Here are some recommended insights to build in PostHog based on the events we just instrumented:

- **Sign-in trend** — Trends query on `user signed in` to track daily active users over time.
- **Project creation funnel** — Funnel from `user signed in` → `project created` → `task created` to measure onboarding conversion.
- **Task completion rate** — Trends query comparing `task created` vs `task completed` to track productivity.
- **Churn signals** — Trends query on `data reset` and `project deleted` to monitor frustration events.
- **Task activity breakdown** — Breakdown of `task created`, `task completed`, `task status updated`, and `task deleted` to understand task lifecycle.

You can create these insights in your PostHog dashboard here: [https://us.posthog.com/project/238460/insights/new](https://us.posthog.com/project/238460/insights/new)

And manage your dashboards here: [https://us.posthog.com/project/238460/dashboard](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
