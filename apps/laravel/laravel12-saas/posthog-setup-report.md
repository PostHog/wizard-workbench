# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Laravel 12 SaaS application. PostHog has been configured with server-side event tracking using the PHP SDK, capturing all critical user lifecycle events including authentication, subscription management, and profile updates.

## Summary of changes

### New files created

| File | Description |
|------|-------------|
| `config/posthog.php` | PostHog configuration file with API key, host, and disabled/debug flags |
| `app/Services/PostHogService.php` | Service wrapper for PostHog with identify, capture, and feature flag methods |

### Modified files

| File | Changes |
|------|---------|
| `app/Models/User.php` | Added `getPostHogProperties()` method for consistent person properties |
| `app/Livewire/Forms/LoginForm.php` | Added user identification and `user_logged_in` event capture |
| `app/Livewire/Actions/Logout.php` | Added `user_logged_out` event capture |
| `app/Http/Controllers/Auth/SocialiteController.php` | Added `user_logged_in_social` event capture with provider info |
| `app/Http/Controllers/Auth/VerifyEmailController.php` | Added `email_verified` event capture |
| `app/Http/Controllers/SubscriptionController.php` | Added subscription events: `subscription_checkout_started`, `subscription_plan_swapped`, `billing_portal_opened` |
| `resources/views/livewire/pages/auth/register.blade.php` | Added `user_signed_up` event capture |
| `resources/views/livewire/pages/auth/forgot-password.blade.php` | Added `password_reset_requested` event capture |
| `resources/views/livewire/pages/auth/reset-password.blade.php` | Added `password_reset_completed` event capture |
| `resources/views/livewire/profile/update-profile-information-form.blade.php` | Added `profile_updated` event capture |
| `resources/views/livewire/profile/update-password-form.blade.php` | Added `password_changed` event capture |
| `resources/views/livewire/profile/delete-user-form.blade.php` | Added `account_deleted` churn event capture |

### Environment variables

| Variable | Description |
|----------|-------------|
| `POSTHOG_API_KEY` | Your PostHog project API key |
| `POSTHOG_HOST` | PostHog instance URL (https://us.i.posthog.com) |
| `POSTHOG_DISABLED` | Set to `true` to disable PostHog tracking |

## Events implemented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User completed registration via email/password form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User successfully logged in via email/password | `app/Livewire/Forms/LoginForm.php` |
| `user_logged_in_social` | User logged in or signed up via social OAuth provider | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logged out of the application | `app/Livewire/Actions/Logout.php` |
| `password_reset_requested` | User requested a password reset link | `resources/views/livewire/pages/auth/forgot-password.blade.php` |
| `password_reset_completed` | User successfully reset their password | `resources/views/livewire/pages/auth/reset-password.blade.php` |
| `email_verified` | User verified their email address | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `subscription_checkout_started` | User initiated checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | Subscription created (demo mode) | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | User upgraded or downgraded their subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_opened` | User accessed the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |
| `profile_updated` | User updated their profile information (name/email) | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `password_changed` | User changed their account password from settings | `resources/views/livewire/profile/update-password-form.blade.php` |
| `account_deleted` | User deleted their account (churn event) | `resources/views/livewire/profile/delete-user-form.blade.php` |

## Next steps

We recommend creating insights and a dashboard in PostHog to keep an eye on user behavior, based on the events we just instrumented. Here are some suggested insights:

### Recommended insights to create

1. **User Signups Over Time** - Track `user_signed_up` events to monitor growth
2. **Signup to Subscription Funnel** - Create a funnel from `user_signed_up` → `email_verified` → `subscription_checkout_started`
3. **Daily Active Users** - Track unique users with `user_logged_in` events
4. **Churn Analysis** - Monitor `account_deleted` events over time
5. **Subscription Conversion Rate** - Ratio of `subscription_checkout_started` to successful subscriptions

### PostHog Dashboard

Create a dashboard in PostHog called "Analytics basics" and add the insights above to monitor your key metrics.

Visit your PostHog project: https://us.i.posthog.com

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Dependencies added

- `posthog/posthog-php: ^3.0` - PostHog PHP SDK for server-side analytics
