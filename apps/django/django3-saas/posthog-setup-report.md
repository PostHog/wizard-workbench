<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The following changes were made:

- **`requirements.txt`**: Added `posthog` dependency.
- **`.env`**: Added `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables (never hardcoded in source code).
- **`config/settings.py`**: Added `POSTHOG_API_KEY` and `POSTHOG_HOST` settings read from environment variables; registered `posthog.integrations.django.PosthogContextMiddleware` in `MIDDLEWARE`; updated `INSTALLED_APPS` to use `accounts.apps.AccountsConfig` so PostHog initializes on startup.
- **`accounts/apps.py`** *(new file)*: Created `AccountsConfig` with a `ready()` method that initializes the PostHog SDK from Django settings and registers `posthog.shutdown` with `atexit` to flush events on exit.
- **`accounts/views.py`**: Added `user_registered` event on successful registration (with user identification); added `user_logged_in` event by overriding `form_valid` on `CustomLoginView`; added `user_settings_updated` event on profile save. All events use `new_context()` + `identify_context()` to associate events with the correct user.
- **`billing/views.py`**: Added `subscription_started` event in demo-mode subscribe; added `plan_changed` event in both Stripe and demo `change_plan` flows; added `subscription_canceled` event in `cancel` view; added `checkout_completed` + `subscription_started` events in the Stripe webhook `_handle_checkout_completed` helper (server-side, critical for reliable tracking). Also added `posthog.capture_exception(e)` in the plan change error handler.
- **`dashboard/views.py`**: Added `project_created`, `project_updated`, and `project_deleted` events, each with meaningful metadata properties.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user successfully registers an account | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs in | `accounts/views.py` |
| `user_settings_updated` | Fired when a user updates their profile/settings | `accounts/views.py` |
| `subscription_started` | Fired when a user starts a new subscription (Stripe or demo) | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their subscription | `billing/views.py` |
| `plan_changed` | Fired when a user changes their subscription plan | `billing/views.py` |
| `checkout_completed` | Fired server-side when a Stripe checkout webhook is received | `billing/views.py` |
| `project_created` | Fired when a user creates a new project | `dashboard/views.py` |
| `project_updated` | Fired when a user updates an existing project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |

## Next steps

To explore your data in PostHog, consider building these insights in your [PostHog project](https://us.posthog.com/project/238460):

- **Registration → Subscription funnel**: `user_registered` → `subscription_started` — track how many new users convert to paid subscribers
- **Churn insight**: trend of `subscription_canceled` over time, segmented by `plan_name`
- **Plan change flow**: `plan_changed` broken down by `old_plan` and `new_plan` to see upgrade/downgrade patterns
- **Project engagement**: `project_created` per user, showing which users are most active
- **Login retention**: `user_logged_in` trends over time as a proxy for DAU/MAU

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
