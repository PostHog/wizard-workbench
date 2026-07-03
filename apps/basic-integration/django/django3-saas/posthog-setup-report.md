# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The Python SDK is initialized in `accounts/apps.py` via `AppConfig.ready()`, and the `PosthogContextMiddleware` is registered in `config/settings.py` to automatically attach session, user, and request metadata to every event. Event capture uses the context API (`new_context()` / `identify_context()`) pattern throughout, ensuring all server-side events are linked to authenticated users via their database primary key.

| Event name | Description | File |
|---|---|---|
| `user_registered` | A new user completed the registration form and created an account. | `accounts/views.py` |
| `user_logged_in` | An existing user successfully authenticated and logged in. | `accounts/views.py` |
| `user_logged_out` | A user ended their session by logging out. | `accounts/views.py` |
| `profile_updated` | A user saved changes to their account profile settings. | `accounts/views.py` |
| `pricing_viewed` | A visitor viewed the pricing page, the top of the subscription funnel. | `billing/views.py` |
| `checkout_initiated` | A user submitted the subscribe form and was redirected to Stripe Checkout. | `billing/views.py` |
| `subscription_started` | A user successfully subscribed to a plan (demo or Stripe checkout). | `billing/views.py` |
| `subscription_plan_changed` | A user switched their active subscription to a different plan. | `billing/views.py` |
| `subscription_canceled` | A user canceled their active subscription. | `billing/views.py` |
| `payment_completed` | A Stripe checkout.session.completed webhook confirmed payment and provisioned a subscription. | `billing/views.py` |
| `payment_failed` | A Stripe invoice.payment_failed webhook reported a failed payment attempt. | `billing/views.py` |
| `project_created` | A user created a new project in their dashboard. | `dashboard/views.py` |
| `project_updated` | A user edited and saved changes to an existing project. | `dashboard/views.py` |
| `project_deleted` | A user permanently deleted a project from their dashboard. | `dashboard/views.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793452)
- [New User Registrations (wizard)](https://us.posthog.com/project/483112/insights/DYbzZrDA)
- [Subscription Conversion Funnel (wizard)](https://us.posthog.com/project/483112/insights/R3TXjpHD)
- [Signups vs Subscriptions (wizard)](https://us.posthog.com/project/483112/insights/BPhBzl8c)
- [Subscription Cancellations (wizard)](https://us.posthog.com/project/483112/insights/ts4a07bh)
- [Project Activity (wizard)](https://us.posthog.com/project/483112/insights/PlmZyWgh)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
