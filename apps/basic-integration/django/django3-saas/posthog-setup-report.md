# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Django SaaS application. PostHog's Python SDK is initialized in `accounts/apps.py` via `AppConfig.ready()`, and `PosthogContextMiddleware` is registered in `config/settings.py` to automatically attach session/user context to every request. Twelve business-critical events are now captured across accounts, billing, and project flows.

| Event name | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user successfully completes registration. | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs in. | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out. | `accounts/views.py` |
| `profile_updated` | Fired when a user saves updated profile settings. | `accounts/views.py` |
| `subscription_started` | Fired when a user successfully subscribes to a plan (demo or Stripe redirect). | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their active subscription. | `billing/views.py` |
| `plan_changed` | Fired when a user switches from one plan to another. | `billing/views.py` |
| `checkout_completed` | Fired server-side in the Stripe webhook when a checkout session completes successfully. | `billing/views.py` |
| `payment_failed` | Fired server-side in the Stripe webhook when an invoice payment fails. | `billing/views.py` |
| `project_created` | Fired when a user creates a new project. | `dashboard/views.py` |
| `project_updated` | Fired when a user edits and saves an existing project. | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project. | `dashboard/views.py` |

## Next steps

Visit your PostHog project to create dashboards and insights based on the events above:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard)
- [Create new insight](https://us.posthog.com/project/2/insights/new)

Recommended insights to build:
- **Registrations over time** — trend of `user_registered`
- **Signup-to-subscription funnel** — funnel: `user_registered` → `subscription_started`
- **Churn** — trend of `subscription_canceled` and `payment_failed`
- **Project activity** — trend of `project_created` and `project_deleted`
- **Daily active users** — trend of `user_logged_in`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. The middleware handles `X-POSTHOG-DISTINCT-ID` headers automatically; ensure your frontend sends them.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
