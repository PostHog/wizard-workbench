# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Laravel 12 SaaS application. The following changes were made:

- **Installed** `posthog/posthog-php` (v3.7.3) via Composer
- **Created** `config/posthog.php` — config file reading from environment variables
- **Created** `app/Services/PostHogService.php` — dedicated service wrapper with `identify()`, `capture()`, `captureException()`, and `isFeatureEnabled()` methods
- **Modified** `app/Models/User.php` — added `getPostHogProperties()` helper to return standard user properties for PostHog identify calls
- **Modified** `app/Providers/AppServiceProvider.php` — initializes PostHog once at boot via `PostHog::init()`
- **Modified** `resources/views/livewire/pages/auth/register.blade.php` — tracks `user_signed_up` on successful registration
- **Modified** `resources/views/livewire/pages/auth/login.blade.php` — tracks `user_logged_in` on successful password login
- **Modified** `app/Http/Controllers/Auth/SocialiteController.php` — tracks `user_signed_up` or `user_logged_in` on OAuth callback
- **Modified** `app/Http/Controllers/SubscriptionController.php` — tracks `subscription_checkout_initiated`, `subscription_created`, and `subscription_swapped`
- **Modified** `routes/auth.php` — tracks `user_logged_out` before session destruction
- **Modified** `.env` — added `POSTHOG_API_KEY`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` environment variables

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully registered a new account via the registration form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User successfully authenticated via the login form (password) | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in` | User successfully authenticated via Google OAuth (Socialite) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_signed_up` | User registered a new account via Google OAuth (Socialite) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logged out of the application | `routes/auth.php` |
| `subscription_checkout_initiated` | User initiated a subscription checkout for a plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | Subscription was successfully created (including demo/stub subscriptions) | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_swapped` | User successfully swapped their existing subscription to a new plan | `app/Http/Controllers/SubscriptionController.php` |

## Next steps

We've prepared the following insights you can build on PostHog to monitor your key business metrics. You can create these as a new "Analytics basics" dashboard in [PostHog](https://us.posthog.com/project/2):

**Suggested insights:**

1. **User Acquisition Trend** — Trend chart for `user_signed_up` over time, broken down by `signup_method` (`form` vs `google`). Shows where users are coming from.

2. **Signup → Subscription Conversion Funnel** — Funnel insight: `user_signed_up` → `subscription_checkout_initiated` → `subscription_created`. Reveals drop-off in your conversion path.

3. **Active Users (DAU/WAU)** — Trend chart counting unique users who fired `user_logged_in`, giving you a daily/weekly active user view.

4. **Subscription Activity** — Trend chart showing `subscription_created` and `subscription_swapped` events over time. Tracks growth and plan changes.

5. **Churn Signal** — Retention or stickiness insight comparing `user_signed_up` against `user_logged_out` volume, or a funnel from `subscription_checkout_initiated` where users did NOT reach `subscription_created`.

To create the dashboard, navigate to [Dashboards](https://us.posthog.com/project/2/dashboards) in PostHog and add each insight above.

> **Note:** Dashboard creation via the API requires a Personal API Key (not the project API key). You can generate one in [PostHog Account Settings](https://us.posthog.com/settings/user-api-keys).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
