<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The following changes were made:

- **`requirements.txt`** — Added `posthog` as a dependency.
- **`config/settings.py`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings sourced from environment variables; added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE`; updated `INSTALLED_APPS` to reference `accounts.apps.AccountsConfig`.
- **`accounts/apps.py`** *(new file)* — `AccountsConfig.ready()` initializes the PostHog SDK with the project token and host from settings.
- **`.env`** — Populated `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` via the wizard tools (values never written to source code).
- **`accounts/views.py`** — Added `user_logged_in` capture in `CustomLoginView.form_valid()`; `user_logged_out` in `CustomLogoutView.dispatch()`; `user_registered` (with `identify_context` + `tag`) in the `register` view; `profile_updated` in the `settings` view.
- **`billing/views.py`** — Added `checkout_initiated` when a Stripe checkout session is created; `subscription_started` in demo-mode subscribe; `checkout_completed` in the `_handle_checkout_completed` webhook handler; `subscription_changed` in `change_plan`; `subscription_canceled` in `cancel`; `payment_failed` in `_handle_payment_failed`.
- **`dashboard/views.py`** — Added `project_created`, `project_updated`, and `project_deleted` events in their respective views.

All events use `new_context()` + `identify_context(user_id)` to correlate events with known users. PII (username, `is_staff`, `date_joined`) is passed via `tag()` as person properties, never as event properties.

| Event name | Description | File |
|---|---|---|
| `user_registered` | A new user successfully completed registration and was logged in. | `accounts/views.py` |
| `user_logged_in` | An existing user authenticated and logged in. | `accounts/views.py` |
| `user_logged_out` | An authenticated user ended their session. | `accounts/views.py` |
| `profile_updated` | A user saved changes to their profile settings. | `accounts/views.py` |
| `checkout_initiated` | A user started a Stripe checkout session to subscribe to a plan. | `billing/views.py` |
| `subscription_started` | A user subscribed to a plan (demo mode). | `billing/views.py` |
| `checkout_completed` | Stripe webhook confirmed successful payment and subscription creation. | `billing/views.py` |
| `subscription_changed` | A user changed their active subscription to a different plan. | `billing/views.py` |
| `subscription_canceled` | A user canceled their active subscription. | `billing/views.py` |
| `payment_failed` | Stripe webhook indicated a billing failure. | `billing/views.py` |
| `project_created` | A user created a new project. | `dashboard/views.py` |
| `project_updated` | A user edited and saved an existing project. | `dashboard/views.py` |
| `project_deleted` | A user permanently deleted a project. | `dashboard/views.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.i.posthog.com/project/483112/dashboard/1761060)
- [Signup to subscription conversion funnel](https://us.i.posthog.com/project/483112/insights/9588352)
- [Daily active users](https://us.i.posthog.com/project/483112/insights/9588357)
- [Subscription lifecycle](https://us.i.posthog.com/project/483112/insights/9588359)
- [Payment failures](https://us.i.posthog.com/project/483112/insights/9588360)
- [Project activity](https://us.i.posthog.com/project/483112/insights/9588361)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — `CustomLoginView.form_valid()` identifies on login, but verify that already-logged-in sessions (e.g. via session cookies) are also correlated if you add server-side tracking for those flows.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
