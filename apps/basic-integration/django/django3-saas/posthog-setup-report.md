<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The following changes were made:

- **`requirements.txt`** — added `posthog` dependency.
- **`accounts/apps.py`** (created) — new `AccountsConfig` AppConfig that initializes the PostHog SDK in `ready()`, reading `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from Django settings.
- **`config/settings.py`** — added `accounts.apps.AccountsConfig` to `INSTALLED_APPS`, added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE`, and added `POSTHOG_PROJECT_TOKEN`/`POSTHOG_HOST` settings sourced from environment variables.
- **`accounts/views.py`** — added `user_signed_up` on registration, `user_logged_in` on login (with user identification and person properties), `user_logged_out` on logout, and `profile_updated` on settings save.
- **`billing/views.py`** — added `pricing_viewed` on pricing page load, `subscription_started` on demo-mode subscription creation, `plan_changed` on plan switch, `subscription_canceled` on cancellation, `checkout_completed` in the Stripe webhook handler, and `payment_failed` in the payment failure handler.
- **`dashboard/views.py`** — added `dashboard_viewed` on dashboard load, `project_created` on project creation, and `project_deleted` on project deletion.
- **`.env`** — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` written via wizard-tools (values never appear in source code).

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user completes registration successfully. | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully authenticates and logs in. | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out of the application. | `accounts/views.py` |
| `profile_updated` | Fired when a user saves changes to their profile settings. | `accounts/views.py` |
| `pricing_viewed` | Fired when a user views the pricing plans page. | `billing/views.py` |
| `subscription_started` | Fired when a user successfully subscribes to a plan. | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their active subscription. | `billing/views.py` |
| `plan_changed` | Fired when a user changes from one subscription plan to another. | `billing/views.py` |
| `checkout_completed` | Fired server-side when a Stripe checkout session completes successfully. | `billing/views.py` |
| `payment_failed` | Fired server-side when a Stripe invoice payment fails. | `billing/views.py` |
| `dashboard_viewed` | Fired when an authenticated user loads their main dashboard. | `dashboard/views.py` |
| `project_created` | Fired when a user successfully creates a new project. | `dashboard/views.py` |
| `project_deleted` | Fired when a user permanently deletes a project. | `dashboard/views.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/477969/dashboard/1736842)
  - Signup to subscription conversion funnel
  - Subscription cancellations over time
  - New signups over time
  - Payment failures over time
  - Active users (dashboard views)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any other environment bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
