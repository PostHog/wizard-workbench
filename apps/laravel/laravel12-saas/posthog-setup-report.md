<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS project. The integration covers server-side event tracking for all critical user lifecycle and billing events, plus a client-side PostHog JS snippet for automatic pageview and session tracking with user identification.

**New files created:**
- `config/posthog.php` — PostHog configuration (api_key, host, disabled flag via env vars)
- `app/Services/PostHogService.php` — Centralised service class wrapping `PostHog::capture` and `PostHog::identify`

**Files modified:**
- `app/Providers/AppServiceProvider.php` — Initialises PostHog SDK with `PostHog::init()` in `boot()`
- `resources/views/layouts/app.blade.php` — Adds PostHog JS snippet with per-request `posthog.identify()` for authenticated users
- `resources/views/livewire/pages/auth/register.blade.php` — Captures `user_signed_up` and identifies user after successful registration
- `app/Livewire/Forms/LoginForm.php` — Captures `user_logged_in` and identifies user after successful authentication
- `app/Http/Controllers/Auth/SocialiteController.php` — Captures `social_signup_completed` or `social_login_completed` (with `provider` property) after OAuth callback
- `app/Http/Controllers/SubscriptionController.php` — Captures `checkout_started` (before redirect to Stripe) and `plan_swapped` (after successful plan change)
- `app/Livewire/Actions/Logout.php` — Captures `user_logged_out` before session invalidation
- `resources/views/livewire/profile/delete-user-form.blade.php` — Captures `account_deleted` before account deletion

**Environment variables added to `.env`:**
- `POSTHOG_PROJECT_TOKEN`
- `POSTHOG_HOST`
- `POSTHOG_DISABLED`

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user registered via email/password | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User authenticated with email/password | `app/Livewire/Forms/LoginForm.php` |
| `social_signup_completed` | New user registered via social OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `social_login_completed` | Existing user logged in via social OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `checkout_started` | User initiated a subscription checkout | `app/Http/Controllers/SubscriptionController.php` |
| `plan_swapped` | Subscribed user switched to a different plan | `app/Http/Controllers/SubscriptionController.php` |
| `user_logged_out` | User logged out of the application | `app/Livewire/Actions/Logout.php` |
| `account_deleted` | User permanently deleted their account | `resources/views/livewire/profile/delete-user-form.blade.php` |

## Next steps

We've suggested the following insights for your "Analytics basics" dashboard. Create them at https://us.posthog.com/project/2/insights/new:

- **Signup to Checkout Funnel** — Funnel: `user_signed_up` → `checkout_started` to track conversion from registration to billing
- **New Signups Over Time** — Trend: `user_signed_up` to monitor growth
- **Checkout Initiated** — Trend: `checkout_started` to monitor trial-to-paid conversion intent
- **Account Deletions (Churn)** — Trend: `account_deleted` to monitor churn signals
- **Social vs Email Signups** — Trend comparing `social_signup_completed` vs `user_signed_up` to understand acquisition channels

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
