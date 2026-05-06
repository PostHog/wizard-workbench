<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. Here's a summary of all changes made:

**New files created:**
- `config/posthog.php` — PostHog configuration using environment variables
- `app/Services/PostHogService.php` — Centralized service class with `capture()` and `identify()` static methods
- `.env` — Updated with `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED`

**Modified files:**
- `app/Providers/AppServiceProvider.php` — Initializes PostHog SDK on boot via `PostHog::init()`
- `resources/views/livewire/pages/auth/register.blade.php` — Captures `user_registered` and calls `identify()` after signup
- `resources/views/livewire/pages/auth/login.blade.php` — Captures `user_logged_in` and calls `identify()` after login
- `app/Http/Controllers/Auth/SocialiteController.php` — Captures `social_login_completed` and calls `identify()` after OAuth callback
- `app/Http/Controllers/SubscriptionController.php` — Captures `subscription_checkout_started` on checkout and `subscription_plan_swapped` on plan change
- `resources/views/livewire/profile/delete-user-form.blade.php` — Captures `account_deleted` before account removal
- `resources/views/livewire/profile/update-profile-information-form.blade.php` — Captures `profile_updated` after profile save
- `app/Livewire/Actions/Logout.php` — Captures `user_logged_out` before session invalidation

The PHP SDK (`posthog/posthog-php`) is installed via Composer and initialized once in `AppServiceProvider::boot()`. All events route through `PostHogService` which respects the `POSTHOG_DISABLED` flag. Users are identified by their database ID as `distinctId`.

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | Fired when a new user completes registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Fired when an existing user logs in with email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `social_login_completed` | Fired when a user authenticates via social provider (e.g. Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `subscription_checkout_started` | Fired when a user initiates a plan subscription checkout | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Fired when a subscribed user changes their plan | `app/Http/Controllers/SubscriptionController.php` |
| `account_deleted` | Fired when a user permanently deletes their account | `resources/views/livewire/profile/delete-user-form.blade.php` |
| `profile_updated` | Fired when a user updates their profile information | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `user_logged_out` | Fired when a user logs out of the application | `app/Livewire/Actions/Logout.php` |

## Next steps

We've suggested insights for an "Analytics basics" dashboard to track key user behavior. Create the dashboard and add these insights in PostHog:

1. **Signup-to-subscription funnel** — Funnel insight: `user_registered` → `subscription_checkout_started`
   [Create insight](https://us.posthog.com/project/2/insights/new)

2. **New registrations over time** — Trend insight: `user_registered` count by day
   [Create insight](https://us.posthog.com/project/2/insights/new)

3. **Subscription checkouts over time** — Trend insight: `subscription_checkout_started` count by day
   [Create insight](https://us.posthog.com/project/2/insights/new)

4. **Plan swaps over time** — Trend insight: `subscription_plan_swapped` with breakdown by `plan_name`
   [Create insight](https://us.posthog.com/project/2/insights/new)

5. **Account churn** — Trend insight: `account_deleted` count over time
   [Create insight](https://us.posthog.com/project/2/insights/new)

[Open PostHog dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
