<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. PostHog is initialized via `accounts/apps.py` using the `AccountsConfig.ready()` method, ensuring the SDK is configured once when Django starts. The `PosthogContextMiddleware` is active for all requests, automatically extracting session IDs, user IDs, and request metadata. Thirteen events are now tracked across the accounts, billing, and dashboard apps, covering the full user lifecycle from registration through subscription management and project activity.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user completes registration and is logged in | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully authenticates via the login form | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out of their session | `accounts/views.py` |
| `profile_updated` | Fired when a user saves changes to their profile settings | `accounts/views.py` |
| `pricing_viewed` | Fired when a user views the pricing/plans page — top of billing funnel | `billing/views.py` |
| `subscription_started` | Fired when a user initiates a checkout session or creates a demo subscription | `billing/views.py` |
| `subscription_completed` | Fired in the Stripe webhook handler when `checkout.session.completed` is received | `billing/views.py` |
| `plan_changed` | Fired when an existing subscriber changes their subscription plan | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their active subscription | `billing/views.py` |
| `payment_failed` | Fired in the Stripe webhook handler when `invoice.payment_failed` is received | `billing/views.py` |
| `project_created` | Fired when a user successfully creates a new project | `dashboard/views.py` |
| `project_updated` | Fired when a user saves changes to an existing project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |

## Files changed

- **`requirements.txt`** — added `posthog` dependency
- **`.env`** — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`
- **`config/settings.py`** — added `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST` settings; registered `AccountsConfig`; added `PosthogContextMiddleware` to `MIDDLEWARE`
- **`accounts/apps.py`** *(new)* — `AccountsConfig.ready()` initializes PostHog SDK with token and host from settings
- **`accounts/views.py`** — added `user_registered`, `user_logged_in`, `user_logged_out`, `profile_updated` events with user identification
- **`billing/views.py`** — added `pricing_viewed`, `subscription_started`, `subscription_completed`, `plan_changed`, `subscription_canceled`, `payment_failed` events
- **`dashboard/views.py`** — added `project_created`, `project_updated`, `project_deleted` events

## Next steps

To build insights in PostHog, visit your [PostHog project](https://us.posthog.com) and create an **"Analytics basics"** dashboard with the following recommended insights:

1. **Signup funnel** — `pricing_viewed` → `subscription_started` → `subscription_completed` (Funnel insight)
2. **Registrations over time** — Trend for `user_registered` (Trends insight)
3. **Subscription cancellations** — Trend for `subscription_canceled` (Trends insight)
4. **Project activity** — Trends showing `project_created`, `project_updated`, `project_deleted` together (Trends insight)
5. **Payment failures** — Trend for `payment_failed` (Trends insight)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
