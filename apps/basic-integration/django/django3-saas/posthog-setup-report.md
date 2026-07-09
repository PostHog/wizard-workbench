<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. Here is a summary of all changes made:

- **`requirements.txt`** — Added `posthog` as a dependency.
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- **`config/settings.py`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings read from environment variables. Added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE` for automatic request context tracking. Updated `accounts` in `INSTALLED_APPS` to `accounts.apps.AccountsConfig`.
- **`accounts/apps.py`** — Created `AccountsConfig` with a `ready()` method that initializes the PostHog SDK using `posthog.api_key` and `posthog.host` from Django settings, enables debug mode in development, and registers `posthog.shutdown` with `atexit`.
- **`accounts/views.py`** — Added `user_registered` (on successful registration), `user_logged_in` (on successful login via `CustomLoginView`), `user_logged_out` (on logout via `CustomLogoutView`), and `profile_updated` (on profile save) events. All events use `new_context()` + `identify_context()` to link events to the authenticated user.
- **`billing/views.py`** — Added `checkout_initiated` (when Stripe Checkout is created), `subscription_started` (demo-mode subscription creation), `checkout_completed` (in the Stripe webhook handler after successful payment), `subscription_plan_changed` (on plan upgrade/downgrade in both Stripe and demo mode), and `subscription_canceled` events.
- **`dashboard/views.py`** — Added `project_created`, `project_updated`, and `project_deleted` events when users manage their projects.

| Event name | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user successfully completes registration and is logged in. | `accounts/views.py` |
| `user_logged_in` | Fired when an existing user successfully logs in. | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out of the application. | `accounts/views.py` |
| `profile_updated` | Fired when a user successfully updates their profile settings. | `accounts/views.py` |
| `subscription_started` | Fired when a user subscribes to a plan in demo mode. | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their active subscription. | `billing/views.py` |
| `subscription_plan_changed` | Fired when a user changes their subscription plan. | `billing/views.py` |
| `checkout_initiated` | Fired when a user is redirected to Stripe Checkout to start a subscription. | `billing/views.py` |
| `checkout_completed` | Fired server-side when a Stripe checkout.session.completed webhook is received. | `billing/views.py` |
| `project_created` | Fired when a user successfully creates a new project. | `dashboard/views.py` |
| `project_updated` | Fired when a user successfully updates an existing project. | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project. | `dashboard/views.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824452)
- **Registration to subscription funnel**: [https://us.posthog.com/project/483112/insights/MUm8HLMA](https://us.posthog.com/project/483112/insights/MUm8HLMA)
- **New user registrations over time**: [https://us.posthog.com/project/483112/insights/XcReh5lJ](https://us.posthog.com/project/483112/insights/XcReh5lJ)
- **Subscription cancellations vs new subscriptions**: [https://us.posthog.com/project/483112/insights/kBJyfuvJ](https://us.posthog.com/project/483112/insights/kBJyfuvJ)
- **Project creation activity**: [https://us.posthog.com/project/483112/insights/PvCOx6T2](https://us.posthog.com/project/483112/insights/PvCOx6T2)
- **Plan change funnel**: [https://us.posthog.com/project/483112/insights/WkvHfUML](https://us.posthog.com/project/483112/insights/WkvHfUML)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the `PosthogContextMiddleware` identifies users on every authenticated request via the request user ID, but verify this covers all access patterns in your app.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
