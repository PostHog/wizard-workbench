<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Laravel 12 SaaS application. The PHP SDK (`posthog/posthog-php ^4.1`) has been added to `composer.json`. A dedicated `PostHogService` class centralises all tracking calls, PostHog is initialised in `AppServiceProvider`, and a `config/posthog.php` file reads all settings from environment variables. Eight business-critical events are now tracked across authentication, subscription, and top-of-funnel marketing flows, with `identify` calls on every login and registration to build rich user profiles.

| Event | Description | File |
|---|---|---|
| `user_registered` | New user completes email/password registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User authenticates with email and password | `resources/views/livewire/pages/auth/login.blade.php` |
| `social_user_registered` | New account created via social OAuth (first-time) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `social_login_completed` | User authenticates via social OAuth provider | `app/Http/Controllers/Auth/SocialiteController.php` |
| `subscription_checkout_started` | User initiates checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | User swaps to a different subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `user_logged_out` | Authenticated user logs out | `routes/auth.php` |
| `pricing_page_viewed` | Pricing page viewed — top of conversion funnel | `routes/web.php` |

## Next steps

### Complete the Composer installation

Run `composer install` (or `composer update`) to install `posthog/posthog-php` once the pre-existing dependency conflict in your project is resolved. The conflict is: `larabug/larabug` → `nesbot/carbon` → `symfony/clock v8.0.0` requires PHP ≥ 8.4, but the environment currently has PHP 8.3. Upgrading to PHP 8.4 or pinning `nesbot/carbon` to a compatible version will unblock the install.

### Build the "Analytics basics" dashboard

Create the following dashboard and insights in PostHog to monitor user behavior based on the events just instrumented:

**Dashboard:** [Create in PostHog](https://us.posthog.com/project/238460/dashboard/new)
Name it **"Analytics basics"**.

**Suggested insights to add:**

1. **Signup conversion funnel** (Funnel insight)
   Steps: `pricing_page_viewed` → `user_registered`
   Shows what fraction of pricing page visitors convert to registered users.

2. **Registration & login trend** (Trends insight)
   Events: `user_registered`, `user_logged_in`, `social_login_completed`
   Shows daily new signups and returning logins over time.

3. **Subscription checkout starts** (Trends insight)
   Event: `subscription_checkout_started`
   Broken down by `plan_name` property — shows which plans drive the most checkout intent.

4. **Subscription funnel** (Funnel insight)
   Steps: `user_registered` → `subscription_checkout_started` → `subscription_plan_swapped`
   Tracks the full SaaS conversion funnel from signup to paid.

5. **Churn signal — logouts vs logins** (Trends insight)
   Events: `user_logged_in`, `user_logged_out`
   A rising logout-to-login ratio can signal churn risk or UX friction.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
