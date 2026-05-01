<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. Here's a summary of every change made:

**`accounts/apps.py`** (new file) — An `AccountsConfig` AppConfig was created to initialize the PostHog Python SDK when Django starts. It reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from Django settings and registers `posthog.shutdown` with `atexit` to ensure all events are flushed on process exit.

**`config/settings.py`** — Three changes: (1) `accounts` entry in `INSTALLED_APPS` updated to `accounts.apps.AccountsConfig` to wire in the new AppConfig, (2) `posthog.integrations.django.PosthogContextMiddleware` added to `MIDDLEWARE` to auto-extract session/tracing headers and capture exceptions, (3) `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings added, reading from environment variables.

**`accounts/views.py`** — PostHog event tracking added to four flows: `CustomLoginView.form_valid` captures `user_logged_in` and identifies the user; `CustomLogoutView.dispatch` captures `user_logged_out` before the session ends; `register()` captures `user_registered` and identifies the new user; `settings()` captures `profile_updated`.

**`billing/views.py`** — PostHog event tracking added to five billing flows: `subscribe()` captures `checkout_initiated` (when Stripe checkout starts) or `subscription_started` (demo mode); `_handle_checkout_completed()` captures `subscription_started` after a successful Stripe webhook; `change_plan()` captures `plan_changed` with old/new plan info; `cancel()` captures `subscription_canceled`; `_handle_payment_failed()` captures `payment_failed`.

**`dashboard/views.py`** — PostHog event tracking added to three project management flows: `create_project()` captures `project_created`; `edit_project()` captures `project_updated`; `delete_project()` captures `project_deleted`.

**`requirements.txt`** — `posthog` added as a dependency.

**`.env`** — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` set with the correct values.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | A new user completes registration and is logged in | `accounts/views.py` |
| `user_logged_in` | An existing user logs in successfully | `accounts/views.py` |
| `user_logged_out` | An authenticated user logs out | `accounts/views.py` |
| `profile_updated` | A user saves changes to their profile settings | `accounts/views.py` |
| `checkout_initiated` | A user starts a Stripe checkout session for a plan | `billing/views.py` |
| `subscription_started` | A subscription is created (demo mode or after Stripe checkout) | `billing/views.py` |
| `plan_changed` | A user changes their active subscription plan | `billing/views.py` |
| `subscription_canceled` | A user cancels their active subscription | `billing/views.py` |
| `payment_failed` | A subscription payment fails (Stripe webhook) | `billing/views.py` |
| `project_created` | A user creates a new project | `dashboard/views.py` |
| `project_updated` | A user updates an existing project | `dashboard/views.py` |
| `project_deleted` | A user deletes a project | `dashboard/views.py` |

## Next steps

We've set up the events — here's how to build the recommended insights into a dashboard to keep an eye on user behavior:

**Create the "Analytics basics" dashboard** in PostHog and add these five insights:

1. **Signup trend** — Trends insight for `user_registered` over time. Shows daily/weekly new user growth.
   → https://us.posthog.com/project/2/insights/new?insight=TRENDS

2. **Signup → first project funnel** — Funnel insight: `user_registered` → `project_created`. Measures activation rate.
   → https://us.posthog.com/project/2/insights/new?insight=FUNNELS

3. **Subscription conversions** — Trends insight for `subscription_started` (and optionally `checkout_initiated`). Shows revenue conversion.
   → https://us.posthog.com/project/2/insights/new?insight=TRENDS

4. **Churn / cancellations** — Trends insight for `subscription_canceled` and `payment_failed`. Watch for spikes.
   → https://us.posthog.com/project/2/insights/new?insight=TRENDS

5. **Project activity** — Trends insight for `project_created`, `project_updated`, `project_deleted` on a single graph. Shows engagement depth.
   → https://us.posthog.com/project/2/insights/new?insight=TRENDS

**View all dashboards:** https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
