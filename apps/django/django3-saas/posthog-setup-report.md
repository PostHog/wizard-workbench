# PostHog Integration Setup Report

## Summary

PostHog analytics has been integrated into this Django SaaS application. The integration uses the Python SDK with Django middleware for automatic request context and captures 12 custom events across the user, billing, and project workflows.

## Files Modified

| File | Change |
|------|--------|
| `requirements.txt` | Added `posthog` dependency |
| `config/settings.py` | Added middleware, `POSTHOG_API_KEY`, `POSTHOG_HOST`, `POSTHOG_DISABLED` config |
| `accounts/apps.py` | **Created** — initializes PostHog SDK in `AppConfig.ready()` |
| `accounts/views.py` | Added event capture for login, logout, register, profile update |
| `billing/views.py` | Added event capture for checkout and subscription lifecycle |
| `dashboard/views.py` | Added event capture for project CRUD |
| `.env` | Added `POSTHOG_API_KEY` and `POSTHOG_HOST` |

## Events Tracked

| Event | File | Trigger |
|-------|------|---------|
| `user_registered` | `accounts/views.py` | Successful registration form save |
| `user_logged_in` | `accounts/views.py` | Successful login (form_valid) |
| `user_logged_out` | `accounts/views.py` | Logout dispatch |
| `profile_updated` | `accounts/views.py` | Successful settings form save |
| `checkout_initiated` | `billing/views.py` | Stripe checkout session created |
| `subscription_started` | `billing/views.py` | Demo mode subscription created |
| `subscription_changed` | `billing/views.py` | Plan change (Stripe + demo) |
| `subscription_canceled` | `billing/views.py` | Subscription cancellation |
| `checkout_completed` | `billing/views.py` | Stripe webhook: `checkout.session.completed` |
| `project_created` | `dashboard/views.py` | New project saved |
| `project_updated` | `dashboard/views.py` | Project edit saved |
| `project_deleted` | `dashboard/views.py` | Project deleted |

## PostHog Dashboard

**Dashboard:** [Analytics basics](https://us.posthog.com/project/2/dashboard/1346340)

### Insights

| Insight | Type | Events |
|---------|------|--------|
| [Signup to Paid Conversion Funnel](https://us.posthog.com/project/2/insights/YpKWr8CW) | Funnel | `user_signed_up` → `checkout_initiated` → `checkout_completed` |
| [New Signups & Daily Active Users](https://us.posthog.com/project/2/insights/gSx6tbeo) | Trend | `user_signed_up`, `user_signed_in` |
| [Churn Signals: Account Deletions & Cancellations](https://us.posthog.com/project/2/insights/qmhtoiwP) | Trend | `account_deleted`, `subscription_cancelled` |
| [Revenue: New Subscriptions & Activations](https://us.posthog.com/project/2/insights/i1Il3Pil) | Trend | `checkout_completed`, `subscription_updated` |
| [Team Growth: Invitations & Removals](https://us.posthog.com/project/2/insights/F8xFXViT) | Trend | `team_member_invited`, `team_member_removed` |

## Configuration

Environment variables (set in `.env`, referenced in `config/settings.py`):

```
POSTHOG_API_KEY=<your-project-api-key>
POSTHOG_HOST=https://us.i.posthog.com
POSTHOG_DISABLED=False   # set to True to disable tracking (e.g. in tests)
```

## SDK Initialization

PostHog is initialized once when Django starts via `accounts/apps.py`:

```python
class AccountsConfig(AppConfig):
    def ready(self):
        import posthog
        posthog.api_key = settings.POSTHOG_API_KEY
        posthog.host = settings.POSTHOG_HOST
        atexit.register(posthog.shutdown)  # flushes queue on exit
```

`PosthogContextMiddleware` is added to `MIDDLEWARE` in `config/settings.py` to automatically wrap each request with a PostHog context.
