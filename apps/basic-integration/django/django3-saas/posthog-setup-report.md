# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The following changes were made:

- **`accounts/apps.py`** (new file): `AccountsConfig.ready()` initializes the PostHog SDK on Django startup using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables.
- **`accounts/__init__.py`**: Set `default_app_config` to wire up `AccountsConfig`.
- **`config/settings.py`**: Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings read from env vars; added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE` for automatic request context, tracing header extraction, and exception capture.
- **`accounts/views.py`**: Added `user_signed_up` on registration, `user_logged_in` on login (with username/date_joined person tags), `user_logged_out` on logout, and `profile_updated` on settings save.
- **`billing/views.py`**: Added `pricing_page_viewed` on pricing page load, `checkout_initiated` when Stripe checkout begins, `subscription_started` in demo mode, `checkout_completed` in the Stripe webhook handler, `subscription_plan_changed` on plan change, `subscription_canceled` on cancellation, and `payment_failed` in the invoice webhook handler. Exception capture added around all Stripe API calls.
- **`dashboard/views.py`**: Added `project_created`, `project_updated`, and `project_deleted` events.
- **`requirements.txt`**: Added `posthog` dependency.
- **`.env`**: Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user completes registration and their account is created. | `accounts/views.py` |
| `user_logged_in` | A user successfully authenticates and logs into the application. | `accounts/views.py` |
| `user_logged_out` | A user logs out of their session. | `accounts/views.py` |
| `profile_updated` | A user saves changes to their profile or account settings. | `accounts/views.py` |
| `pricing_page_viewed` | A visitor views the pricing plans page, marking the top of the conversion funnel. | `billing/views.py` |
| `checkout_initiated` | A user begins the Stripe checkout flow for a subscription plan. | `billing/views.py` |
| `subscription_started` | A user subscribes to a plan directly in demo mode without Stripe. | `billing/views.py` |
| `checkout_completed` | A Stripe webhook confirms a checkout session completed and a subscription was created. | `billing/views.py` |
| `subscription_plan_changed` | A user changes their active subscription to a different plan. | `billing/views.py` |
| `subscription_canceled` | A user cancels their active subscription. | `billing/views.py` |
| `payment_failed` | A Stripe webhook reports a failed invoice payment for a subscription. | `billing/views.py` |
| `project_created` | A user creates a new project in their dashboard. | `dashboard/views.py` |
| `project_updated` | A user edits and saves changes to an existing project. | `dashboard/views.py` |
| `project_deleted` | A user permanently deletes a project from their account. | `dashboard/views.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1812943)
- [New signups over time](https://us.posthog.com/project/483112/insights/q426cKxK)
- [Subscription conversion funnel](https://us.posthog.com/project/483112/insights/D6v9n6QW)
- [Subscription cancellations over time](https://us.posthog.com/project/483112/insights/FFz253sQ)
- [Project activity](https://us.posthog.com/project/483112/insights/QpUoVNr5)
- [Daily active users](https://us.posthog.com/project/483112/insights/Q0u1Kdse)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
