# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Django SaaS application. The posthog Python SDK (v7.x) was installed and configured via `accounts/apps.py` using the `AppConfig.ready()` pattern, which initializes PostHog once at Django startup. The `PosthogContextMiddleware` was added to `config/settings.py` to automatically extract session/user context, request metadata, and capture exceptions on every request. Thirteen events were instrumented across four view files covering the full user lifecycle: registration, authentication, profile management, billing/subscriptions, and project CRUD operations. All events use the `new_context()` + `identify_context()` pattern to link server-side events to users. PII is passed only via `tag()` (person properties), never in `capture()` event properties.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_registered` | A new user successfully completed registration and was logged in. | `accounts/views.py` |
| `user_logged_in` | A user successfully authenticated and logged into the application. | `accounts/views.py` |
| `user_logged_out` | A user logged out of the application. | `accounts/views.py` |
| `profile_updated` | A user saved changes to their profile settings. | `accounts/views.py` |
| `checkout_initiated` | A user initiated a Stripe checkout session for a plan. | `billing/views.py` |
| `subscription_started` | A user successfully subscribed to a plan (demo or Stripe). | `billing/views.py` |
| `plan_changed` | A user changed their active subscription plan. | `billing/views.py` |
| `subscription_canceled` | A user canceled their active subscription. | `billing/views.py` |
| `checkout_completed` | A Stripe checkout.session.completed webhook confirmed a successful payment. | `billing/views.py` |
| `payment_failed` | A Stripe invoice.payment_failed webhook indicated a payment failure. | `billing/views.py` |
| `project_created` | A user created a new project in the dashboard. | `dashboard/views.py` |
| `project_updated` | A user saved updates to an existing project. | `dashboard/views.py` |
| `project_deleted` | A user permanently deleted a project. | `dashboard/views.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818064)
- [User signups over time](https://us.posthog.com/project/483112/insights/1dWmvgXR)
- [Subscription conversion funnel](https://us.posthog.com/project/483112/insights/0uyWrTkr)
- [Subscription events over time](https://us.posthog.com/project/483112/insights/YNYETMmG)
- [Project activity](https://us.posthog.com/project/483112/insights/hYVjA2ja)
- [Daily active users](https://us.posthog.com/project/483112/insights/pY3K0DQg)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
