# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS project. The following changes were made:

- **Installed** `posthog/posthog-php` (v3.7.3) via Composer
- **Created** `config/posthog.php` — configuration file reading from environment variables
- **Created** `app/Services/PostHogService.php` — a dedicated service class wrapping the PostHog PHP SDK with `capture`, `identify`, `captureException`, `isFeatureEnabled`, and `getFeatureFlagPayload` methods
- **Modified** `app/Providers/AppServiceProvider.php` — initialises PostHog SDK on application boot
- **Modified** `app/Livewire/Forms/LoginForm.php` — identifies user and tracks `user_logged_in`
- **Modified** `resources/views/livewire/pages/auth/register.blade.php` — identifies user and tracks `user_registered`
- **Modified** `app/Http/Controllers/Auth/SocialiteController.php` — identifies user and tracks `user_logged_in_via_social`
- **Modified** `app/Livewire/Actions/Logout.php` — tracks `user_logged_out` (Livewire nav)
- **Modified** `routes/auth.php` — tracks `user_logged_out` (standard auth route)
- **Modified** `app/Http/Controllers/SubscriptionController.php` — tracks `pricing_page_viewed`, `subscription_checkout_started`, `subscription_created`, `subscription_plan_swapped`, `billing_portal_accessed`, and exception events
- **Modified** `app/Http/Controllers/Auth/VerifyEmailController.php` — tracks `email_verified`

## Events

| Event name | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user successfully registers an account | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Fired when a user successfully logs in (email/password) | `app/Livewire/Forms/LoginForm.php` |
| `user_logged_in_via_social` | Fired when a user logs in or registers via OAuth provider (e.g., GitHub) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | Fired when a user logs out | `app/Livewire/Actions/Logout.php`, `routes/auth.php` |
| `pricing_page_viewed` | Fired when a user views the pricing page — top of subscription conversion funnel | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_checkout_started` | Fired when a user initiates checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | Fired when a subscription is successfully created (including stub for demo mode) | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Fired when a user upgrades or downgrades their subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | Fired when a user is redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |
| `password_reset_requested` | Fired when a user submits a password reset request | `resources/views/livewire/pages/auth/forgot-password.blade.php` |
| `email_verified` | Fired when a user verifies their email address | `app/Http/Controllers/Auth/VerifyEmailController.php` |

## Next steps

We've instrumented the key user flows in your application. Use the links below to explore the data in PostHog and build insights:

- [Activity feed — see live events as they come in](https://us.posthog.com/project/2/activity)
- [Create a new dashboard — "Analytics basics"](https://us.posthog.com/project/2/dashboard/new)
- [Build a subscription conversion funnel](https://us.posthog.com/project/2/insights/new?insight=FUNNELS) — recommended steps: `pricing_page_viewed` → `subscription_checkout_started` → `subscription_created`
- [Track user registrations over time](https://us.posthog.com/project/2/insights/new?insight=TRENDS) — filter by `user_registered`
- [Monitor churn signals](https://us.posthog.com/project/2/insights/new?insight=TRENDS) — track `user_logged_out` and `billing_portal_accessed` as early churn indicators
- [User paths analysis](https://us.posthog.com/project/2/insights/new?insight=PATHS) — see what paths users take after `pricing_page_viewed`
- [PostHog project overview](https://us.posthog.com/project/2)

### Recommended dashboard insights

To build an "Analytics basics" dashboard, create the following five insights:

1. **Subscription conversion funnel** — Funnel: `pricing_page_viewed` → `subscription_checkout_started` → `subscription_created`
2. **New user registrations** — Trend: `user_registered` (daily count)
3. **Active logins by method** — Trend: `user_logged_in` + `user_logged_in_via_social` (breakdown by login_method property)
4. **Churn signals** — Trend: `billing_portal_accessed` (users accessing billing portal as churn indicator)
5. **Plan changes** — Trend: `subscription_plan_swapped` (with breakdown by new_plan_name property)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
