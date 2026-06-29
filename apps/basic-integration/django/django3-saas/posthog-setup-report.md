<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The following changes were made:

- **`requirements.txt`** — Added `posthog` dependency.
- **`config/settings.py`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings (read from environment variables), updated `INSTALLED_APPS` to reference `accounts.apps.AccountsConfig`, and appended `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE`.
- **`accounts/apps.py`** — Created new file: `AccountsConfig.ready()` initializes the PostHog SDK once at startup using settings from Django's config.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (covered by `.gitignore`).
- **`accounts/views.py`** — Added `user_registered` (with user identification), `user_logged_in` (with user identification, on `CustomLoginView.form_valid`), `user_logged_out` (on `CustomLogoutView.dispatch`), and `profile_updated` events.
- **`billing/views.py`** — Added `subscription_checkout_initiated`, `subscription_started`, `subscription_plan_changed`, `subscription_canceled`, `checkout_completed` (Stripe webhook), and `payment_failed` (Stripe webhook) events, plus `posthog.capture_exception()` on Stripe API errors.
- **`dashboard/views.py`** — Added `project_created` and `project_deleted` events.

## Events

| Event Name | Description | File |
|---|---|---|
| `user_registered` | A new user completed registration and was logged in. | `accounts/views.py` |
| `user_logged_in` | A user successfully authenticated via the login form. | `accounts/views.py` |
| `user_logged_out` | A user ended their session by logging out. | `accounts/views.py` |
| `profile_updated` | A user saved changes to their profile settings. | `accounts/views.py` |
| `subscription_checkout_initiated` | A user was redirected to Stripe Checkout to start a paid subscription. | `billing/views.py` |
| `subscription_started` | A user successfully subscribed to a plan (demo or Stripe). | `billing/views.py` |
| `subscription_plan_changed` | A user switched their active subscription to a different plan. | `billing/views.py` |
| `subscription_canceled` | A user canceled their active subscription. | `billing/views.py` |
| `checkout_completed` | Stripe webhook confirmed a successful checkout session and subscription was created. | `billing/views.py` |
| `payment_failed` | Stripe webhook reported a failed invoice payment for a subscription. | `billing/views.py` |
| `project_created` | A user created a new project in the dashboard. | `dashboard/views.py` |
| `project_deleted` | A user deleted an existing project from the dashboard. | `dashboard/views.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1775044)
- [Registration to Subscription Funnel](https://us.posthog.com/project/483112/insights/o5njE0og)
- [New Subscriptions Over Time](https://us.posthog.com/project/483112/insights/yHi4tZ8Y)
- [Subscription Cancellations and Payment Failures](https://us.posthog.com/project/483112/insights/fW6OcqE2)
- [Daily Active Users](https://us.posthog.com/project/483112/insights/X6uRP96W)
- [Checkout Conversion Funnel](https://us.posthog.com/project/483112/insights/8xae4d9E)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
