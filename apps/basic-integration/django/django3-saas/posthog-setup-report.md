<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The following changes were made:

- **`requirements.txt`** — Added the `posthog` Python SDK package.
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (values sourced from the wizard configuration).
- **`config/settings.py`** — Added `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` settings read from environment variables. Added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE` (auto-extracts session/user tracing headers for all requests). Updated `INSTALLED_APPS` to use `accounts.apps.AccountsConfig`.
- **`accounts/apps.py`** *(new)* — `AccountsConfig.ready()` initializes the PostHog SDK once at startup from Django settings.
- **`accounts/views.py`** — Added `user_logged_in`, `user_logged_out`, `user_registered`, `password_reset_requested`, and `profile_settings_updated` event captures. Login and registration calls include `identify_context()` with user ID and `tag()` for person properties.
- **`billing/views.py`** — Added `pricing_page_viewed`, `subscription_started`, `checkout_completed`, `subscription_plan_changed`, and `subscription_canceled` event captures. Stripe error paths use `posthog.capture_exception()`.
- **`dashboard/views.py`** — Added `project_created`, `project_updated`, and `project_deleted` event captures.

| Event name | Description | File |
|---|---|---|
| `user_registered` | A new user completed registration and was logged in. | `accounts/views.py` |
| `user_logged_in` | An existing user successfully logged in. | `accounts/views.py` |
| `user_logged_out` | A user logged out of their account. | `accounts/views.py` |
| `password_reset_requested` | A user submitted the password reset form. | `accounts/views.py` |
| `profile_settings_updated` | A user saved changes to their profile settings. | `accounts/views.py` |
| `pricing_page_viewed` | A visitor viewed the pricing page, the top of the subscription funnel. | `billing/views.py` |
| `subscription_started` | A user initiated a new subscription to a plan. | `billing/views.py` |
| `checkout_completed` | A Stripe checkout session completed and a subscription was created. | `billing/views.py` |
| `subscription_plan_changed` | A user changed their active subscription plan. | `billing/views.py` |
| `subscription_canceled` | A user canceled their active subscription. | `billing/views.py` |
| `project_created` | A user created a new project. | `dashboard/views.py` |
| `project_updated` | A user edited an existing project. | `dashboard/views.py` |
| `project_deleted` | A user permanently deleted a project. | `dashboard/views.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1777425)
- [Subscription conversion funnel](https://us.i.posthog.com/project/483112/insights/zeF0iHcJ)
- [New user registrations](https://us.i.posthog.com/project/483112/insights/pe3bzv9G)
- [Subscription churn events](https://us.i.posthog.com/project/483112/insights/0ZwcxV2i)
- [Project activity](https://us.i.posthog.com/project/483112/insights/s7YPk7MS)
- [User logins and registrations](https://us.i.posthog.com/project/483112/insights/Ix2CK5HL)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
