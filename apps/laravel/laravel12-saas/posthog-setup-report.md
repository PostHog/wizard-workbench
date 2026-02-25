<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Laravel 12 SaaS application. The integration uses the PostHog PHP SDK (`posthog/posthog-php`) with a dedicated `PostHogService` class, registered as a singleton in Laravel's service container. All API keys and configuration are stored exclusively in environment variables — never hardcoded.

## What was added

- **`config/posthog.php`** — PostHog configuration file reading from environment variables (`POSTHOG_API_KEY`, `POSTHOG_HOST`, `POSTHOG_DISABLED`)
- **`app/Services/PostHogService.php`** — Wrapper service with `identify()`, `capture()`, `captureException()`, `isFeatureEnabled()`, and `getFeatureFlagPayload()` methods
- **`app/Providers/AppServiceProvider.php`** — PostHogService registered as a singleton
- **`app/Models/User.php`** — Added `getPostHogProperties()` helper method returning user analytics properties
- **`.env`** — PostHog environment variables set (`POSTHOG_API_KEY`, `POSTHOG_HOST`, `POSTHOG_DISABLED`)

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | New user registers via email form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_signed_up` | New user registers via OAuth (Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in` | User successfully logs in with email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in_social` | User logs in via OAuth (e.g. Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logs out | `routes/auth.php` |
| `subscription_checkout_started` | User initiates a plan checkout | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | Subscription successfully created | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | User swaps to a different plan | `app/Http/Controllers/SubscriptionController.php` |
| `dashboard_viewed` | Authenticated user views the dashboard | `app/Livewire/Dashboard.php` |
| `profile_updated` | User updates their profile information | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `password_changed` | User successfully changes their password | `resources/views/livewire/profile/update-password-form.blade.php` |
| `account_deleted` | User deletes their account (churn event) | `resources/views/livewire/profile/delete-user-form.blade.php` |

## Next steps

We recommend building a dashboard to keep an eye on user behavior based on the events just instrumented. Visit your PostHog project to create an **"Analytics basics"** dashboard with these suggested insights:

- **[New dashboard](https://us.posthog.com/project/238460/dashboard)** — Create "Analytics basics" at https://us.posthog.com/project/238460/dashboard

Suggested insights to add:

1. **Signup to Subscription Funnel** — Funnel: `user_signed_up` → `subscription_checkout_started` → `subscription_created`
2. **Daily Active Users** — Trend: unique users performing `user_logged_in` over the last 30 days
3. **Churn Events** — Trend: `account_deleted` events over time
4. **Subscription Conversions** — Trend: `subscription_created` and `subscription_plan_changed` combined
5. **Auth Methods Breakdown** — Trend: `user_logged_in` vs `user_logged_in_social` side-by-side

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
