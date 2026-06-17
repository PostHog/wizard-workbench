<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The Python SDK is initialized in `accounts/apps.py` via `AppConfig.ready()`, which runs once on Django startup. `PosthogContextMiddleware` is registered in `config/settings.py` to automatically extract session and user context from incoming request headers. Event tracking and user identification have been added to all key SaaS flows: authentication, billing/subscriptions, and project management.

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user successfully registers | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs in | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out | `accounts/views.py` |
| `settings_updated` | Fired when a user updates their profile settings | `accounts/views.py` |
| `pricing_viewed` | Fired when any visitor views the pricing page | `billing/views.py` |
| `subscription_started` | Fired when a user subscribes to a plan (Stripe or demo) | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their subscription | `billing/views.py` |
| `plan_changed` | Fired when a user changes their subscription plan | `billing/views.py` |
| `checkout_completed` | Fired via Stripe webhook when checkout.session.completed | `billing/views.py` |
| `payment_failed` | Fired via Stripe webhook when invoice.payment_failed | `billing/views.py` |
| `project_created` | Fired when a user creates a new project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |

## Next steps

The PostHog MCP API key did not have the `dashboard:write` / `insight:write` scopes needed to create insights automatically. Use the link below to manually create a dashboard named **"Analytics basics (wizard)"** with the recommended insights:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard)

Recommended insights for the dashboard:

1. **Signup → Subscription conversion funnel** — Funnel from `user_registered` → `pricing_viewed` → `subscription_started`
2. **Subscription cancellations over time** — Trend of `subscription_canceled` events per week
3. **New registrations over time** — Trend of `user_registered` events per day
4. **Checkout completed vs payment failed** — Side-by-side trend of `checkout_completed` and `payment_failed`
5. **Project creation activity** — Trend of `project_created` events per user over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — `CustomLoginView.form_valid` identifies on login, but returning users who skip login (session still active) will only be identified when they next log in or perform a tracked action.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
