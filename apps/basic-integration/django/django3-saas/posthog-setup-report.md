<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. PostHog is initialized in `accounts/apps.py` via `AppConfig.ready()`, the `PosthogContextMiddleware` is added to `MIDDLEWARE` to auto-extract session and user context on every request, and environment variables `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are wired through `config/settings.py`. Events covering the full user lifecycle — signup, login, logout, subscription billing, and project management — are captured with `new_context()` / `identify_context()` / `capture()` in the relevant views.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user completes registration. | `accounts/views.py` |
| `user_logged_in` | Fired when an existing user successfully logs in. | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out of their session. | `accounts/views.py` |
| `subscription_started` | Fired when a user successfully subscribes to a plan. | `billing/views.py` |
| `checkout_initiated` | Fired when a user is redirected to Stripe Checkout to start a subscription. | `billing/views.py` |
| `subscription_plan_changed` | Fired when a user upgrades or downgrades their subscription plan. | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their active subscription. | `billing/views.py` |
| `project_created` | Fired when a user creates a new project in the dashboard. | `dashboard/views.py` |
| `project_deleted` | Fired when a user permanently deletes a project. | `dashboard/views.py` |
| `payment_failed` | Fired via Stripe webhook when a subscription payment fails. | `billing/views.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1787324)
- [Signup → Subscription Conversion Funnel](https://us.i.posthog.com/project/483112/insights/9742894)
- [Subscription Cancellations Over Time](https://us.i.posthog.com/project/483112/insights/9742902)
- [New Subscriptions Over Time](https://us.i.posthog.com/project/483112/insights/9742905)
- [Active Users Trend](https://us.i.posthog.com/project/483112/insights/9742908)
- [Project Creation Trend](https://us.i.posthog.com/project/483112/insights/9742916)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
