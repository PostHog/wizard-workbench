<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Django SaaS project. PostHog server-side analytics are now active across all major user-facing and billing flows.

**What was added:**

- `posthog` added to `requirements.txt` and installed.
- `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` written to `.env` and referenced in `config/settings.py`.
- `posthog.integrations.django.PosthogContextMiddleware` added to `MIDDLEWARE` in `config/settings.py` — this automatically extracts tracing headers and wraps every request in a PostHog context.
- `accounts/apps.py` created with `AccountsConfig.ready()` to initialize PostHog once at Django startup, using token and host from Django settings.
- `INSTALLED_APPS` updated to reference `accounts.apps.AccountsConfig` so the initialization runs.
- `accounts/views.py` — `CustomLoginView`, `CustomLogoutView`, `register`, and `settings` views instrumented with user identification and event capture.
- `billing/views.py` — `subscribe`, `change_plan`, `cancel`, `billing_portal`, `_handle_checkout_completed`, and `_handle_payment_failed` instrumented with key subscription lifecycle events. `posthog.capture_exception()` added to Stripe error handlers.
- `dashboard/views.py` — `create_project` and `delete_project` instrumented.
- `marketing/views.py` — `home` view instrumented as top-of-funnel entry event.

| Event | Description | File |
|---|---|---|
| `user_registered` | New user completes registration | `accounts/views.py` |
| `user_logged_in` | User successfully authenticates | `accounts/views.py` |
| `user_logged_out` | User logs out | `accounts/views.py` |
| `profile_updated` | User saves profile/account settings | `accounts/views.py` |
| `subscription_started` | User subscribes to a paid plan | `billing/views.py` |
| `subscription_canceled` | User cancels their subscription | `billing/views.py` |
| `plan_changed` | User upgrades or downgrades plan | `billing/views.py` |
| `checkout_completed` | Stripe webhook confirms successful checkout | `billing/views.py` |
| `payment_failed` | Stripe webhook reports a failed payment | `billing/views.py` |
| `project_created` | User creates a new project | `dashboard/views.py` |
| `project_deleted` | User deletes a project | `dashboard/views.py` |
| `marketing_home_viewed` | Visitor views the marketing landing page | `marketing/views.py` |

## Next steps

The MCP API key does not currently have `dashboard:write` or `query:read` scopes, so the dashboard could not be created automatically. To set it up manually, go to [Dashboards](/dashboard) in PostHog and create a new dashboard called **"Analytics basics"** with these five insights:

1. **Signup funnel** — Funnel from `marketing_home_viewed` → `user_registered` → `project_created` (tracks full activation flow)
2. **Subscription conversions** — Trend of `subscription_started` over time, broken down by `plan_slug`
3. **Churn signal** — Trend of `subscription_canceled` over time
4. **Payment failures** — Trend of `payment_failed` over time (revenue at-risk indicator)
5. **New registrations** — Trend of `user_registered` over time (growth metric)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
