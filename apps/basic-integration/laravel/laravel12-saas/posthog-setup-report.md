<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS starter. The integration uses the `posthog/posthog-php` SDK via a dedicated `PostHogService` class that is initialized once on application boot. Events are tracked across the full user lifecycle — from signup and login (including Google OAuth) through subscription checkout and plan changes — giving you a clear picture of your conversion funnel and key business metrics.

## Files changed

| File | Change |
|------|--------|
| `composer.json` | Added `posthog/posthog-php` dependency |
| `config/posthog.php` | New PostHog config file (api_key, host, disabled, debug) |
| `app/Services/PostHogService.php` | New service class wrapping the SDK (identify, capture, captureException, isFeatureEnabled, getFeatureFlagPayload) |
| `app/Providers/AppServiceProvider.php` | Boots PostHogService on startup to initialize the SDK once |
| `.env` | Added POSTHOG_PROJECT_TOKEN, POSTHOG_HOST, POSTHOG_DISABLED |
| `resources/views/livewire/pages/auth/register.blade.php` | Added identify + user_signed_up capture after registration |
| `resources/views/livewire/pages/auth/login.blade.php` | Added identify + user_logged_in capture after password login |
| `app/Http/Controllers/Auth/SocialiteController.php` | Added identify + user_signed_up or user_logged_in capture for OAuth flow |
| `app/Livewire/Actions/Logout.php` | Added user_logged_out capture before logout |
| `app/Http/Controllers/SubscriptionController.php` | Added subscription_checkout_started, subscription_created, subscription_plan_changed captures and exception capture on swap error |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user completes registration via the signup form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_signed_up` | Fired when a new user registers via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in` | Fired on successful email/password login | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in` | Fired on successful Google OAuth login | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | Fired when a user logs out | `app/Livewire/Actions/Logout.php` |
| `subscription_checkout_started` | Fired when a user clicks Subscribe on a plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | Fired when a subscription is successfully created | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | Fired when a subscriber upgrades or downgrades their plan | `app/Http/Controllers/SubscriptionController.php` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these insights:

1. **Signup trend** — Trends chart for `user_signed_up` over time, broken down by `signup_method` (form vs. google)
2. **Login trend** — Trends chart for `user_logged_in` over time, broken down by `login_method`
3. **Signup → Subscription funnel** — Funnel with steps: `user_signed_up` → `subscription_checkout_started` → `subscription_created`
4. **Plan changes** — Trends chart for `subscription_plan_changed` over time
5. **Active users** — Retention chart from `user_signed_up` returning to `user_logged_in`

Visit [PostHog Dashboards](/dashboard) to create these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
