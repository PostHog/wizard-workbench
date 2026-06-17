# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Django SaaS application. Here is a summary of changes made:

- **`accounts/apps.py`** (new): Created `AccountsConfig` with a `ready()` method that initialises the PostHog SDK using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables.
- **`config/settings.py`**: Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings read from environment variables, and added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE`. Updated `INSTALLED_APPS` to reference the new `AccountsConfig`.
- **`accounts/views.py`**: Added event capture for user registration, login, logout, and settings updates. User identification is performed on login and registration using `identify_context()`.
- **`billing/views.py`**: Added event capture for subscription checkout initiation, subscription creation (demo mode), plan changes, cancellation, checkout completion (from Stripe webhook), and payment failure. Exception capture added around Stripe API calls.
- **`dashboard/views.py`**: Added event capture for project creation, editing, and deletion with user identification.
- **`requirements.txt`**: Added `posthog` package.
- **`.env`**: Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user completes registration | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs in | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out | `accounts/views.py` |
| `settings_updated` | Fired when a user saves updated profile/account settings | `accounts/views.py` |
| `subscription_checkout_initiated` | Fired when a user initiates checkout for a plan (Stripe redirect) | `billing/views.py` |
| `subscription_started` | Fired when a subscription is created in demo mode | `billing/views.py` |
| `checkout_completed` | Server-side event fired when Stripe checkout.session.completed webhook is received | `billing/views.py` |
| `subscription_plan_changed` | Fired when a user upgrades or downgrades their subscription plan | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their subscription (churn event) | `billing/views.py` |
| `payment_failed` | Server-side event fired when Stripe invoice.payment_failed webhook is received | `billing/views.py` |
| `project_created` | Fired when a user creates a new project (key activation metric) | `dashboard/views.py` |
| `project_updated` | Fired when a user edits an existing project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |

## Next steps

To create the **Analytics basics (wizard)** dashboard in PostHog, visit your [PostHog dashboards page](https://us.posthog.com/project/2/dashboard) and create a new dashboard with the following insights:

1. **Registration → Subscription conversion funnel** — Funnel with steps: `user_registered` → `subscription_started` (or `checkout_completed`). Shows how many new users convert to paid subscribers.
2. **Subscription cancellations over time** — Trend of `subscription_canceled` events. Key churn signal.
3. **Active users (logins over time)** — Trend of `user_logged_in` events. Core engagement metric.
4. **Project creation rate** — Trend of `project_created` events. Activation metric — users who create a project are much more likely to retain.
5. **Payment failures over time** — Trend of `payment_failed` events. Churn risk signal.

[New insight](https://us.posthog.com/project/2/insights/new) | [All dashboards](https://us.posthog.com/project/2/dashboard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the PostHog environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current `CustomLoginView.form_valid()` override handles login, but confirm that any other authentication paths (e.g. social auth, token-based login) also call `identify_context()` so returning sessions are not left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
