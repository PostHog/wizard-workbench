<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The following changes were made:

- **`accounts/apps.py`** (new file): `AccountsConfig.ready()` initializes the PostHog SDK on startup, reading `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables.
- **`config/settings.py`**: Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings, switched `accounts` to `accounts.apps.AccountsConfig` to activate the AppConfig, and appended `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE` for automatic request context and exception capture.
- **`requirements.txt`**: Added `posthog` dependency.
- **`accounts/views.py`**: Instrumented user registration, login, logout, and profile update flows with PostHog event capture and user identification via `identify_context()`.
- **`billing/views.py`**: Instrumented Stripe checkout initiation, demo subscription creation, plan changes, cancellations, and the Stripe webhook handlers for checkout completion and failed payments.
- **`dashboard/views.py`**: Instrumented project creation, editing, and deletion.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user completes registration | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs in | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out | `accounts/views.py` |
| `profile_updated` | Fired when a user saves profile settings | `accounts/views.py` |
| `checkout_initiated` | Fired when a Stripe checkout session is created | `billing/views.py` |
| `subscription_created` | Fired when a subscription is created (demo or Stripe webhook) | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their subscription | `billing/views.py` |
| `plan_changed` | Fired when a user switches subscription plan | `billing/views.py` |
| `payment_failed` | Fired via Stripe webhook when an invoice payment fails | `billing/views.py` |
| `project_created` | Fired when a user creates a project | `dashboard/views.py` |
| `project_edited` | Fired when a user edits a project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |

## Next steps

Create a dashboard named **"Analytics basics (wizard)"** in PostHog with these recommended insights:

1. **Signup → Subscription conversion funnel** — Funnel: `user_signed_up` → `subscription_created`
2. **New signups over time** — Trends: `user_signed_up` (daily/weekly)
3. **Churn signals** — Trends: `subscription_canceled` + `payment_failed` (combined)
4. **Plan changes** — Trends: `plan_changed` (by `new_plan_name` breakdown)
5. **Project engagement** — Trends: `project_created` over time

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
