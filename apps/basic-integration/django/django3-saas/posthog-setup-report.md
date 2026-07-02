<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The following changes were made:

- **`requirements.txt`**: Added `posthog` dependency.
- **`config/settings.py`**: Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings (read from environment variables), updated `INSTALLED_APPS` to reference `accounts.apps.AccountsConfig`, and appended `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE`.
- **`accounts/apps.py`** *(new file)*: Initializes the PostHog SDK in `AccountsConfig.ready()` using settings from `config/settings.py`.
- **`accounts/views.py`**: Added `user_logged_in` (with person properties), `user_logged_out`, `user_registered` (with person properties), and `profile_updated` event tracking. Users are identified via `identify_context()` on every event.
- **`billing/views.py`**: Added `pricing_viewed`, `subscription_started`, `checkout_completed`, `plan_changed`, and `subscription_canceled` event tracking. Stripe errors are captured with `posthog.capture_exception()`.
- **`dashboard/views.py`**: Added `dashboard_viewed`, `project_created`, and `project_deleted` event tracking.
- **`.env`**: Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | A new user completed registration and their account was created. | `accounts/views.py` |
| `user_logged_in` | An existing user successfully authenticated and logged in. | `accounts/views.py` |
| `user_logged_out` | A user ended their session by logging out. | `accounts/views.py` |
| `profile_updated` | A user saved changes to their account profile settings. | `accounts/views.py` |
| `pricing_viewed` | A visitor viewed the pricing plans page. | `billing/views.py` |
| `subscription_started` | A user initiated checkout for a subscription plan. | `billing/views.py` |
| `checkout_completed` | A Stripe checkout completed and a subscription was created. | `billing/views.py` |
| `plan_changed` | A user switched their active subscription to a different plan. | `billing/views.py` |
| `subscription_canceled` | A user canceled their active subscription. | `billing/views.py` |
| `dashboard_viewed` | A user viewed the main dashboard with their project metrics. | `dashboard/views.py` |
| `project_created` | A user created a new project. | `dashboard/views.py` |
| `project_deleted` | A user permanently deleted one of their projects. | `dashboard/views.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1792359)
- [Signup-to-subscription conversion funnel](https://us.posthog.com/project/483112/insights/f7uOqQjw)
- [Subscriptions started over time](https://us.posthog.com/project/483112/insights/W4Y0VTUK)
- [Subscription cancellations over time](https://us.posthog.com/project/483112/insights/DS5Ln8bX)
- [Active users (logins over time)](https://us.posthog.com/project/483112/insights/4Pmmx41B)
- [Project creation rate over time](https://us.posthog.com/project/483112/insights/Jzp2LA0n)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the `CustomLoginView.form_valid()` identifies on login, but users who arrive with an active session (e.g. "remember me") bypass this flow. Consider identifying in `dashboard/views.py` on `dashboard_viewed` (already done) to cover returning sessions.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
