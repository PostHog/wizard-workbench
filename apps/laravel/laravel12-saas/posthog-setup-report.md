<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The following changes were made:

- **Installed** `posthog/posthog-php` SDK via Composer
- **Created** `config/posthog.php` for centralized PostHog configuration using environment variables
- **Created** `app/Services/PostHogService.php` — a dedicated service class that wraps `PostHog::capture` and `PostHog::identify`, respecting the `POSTHOG_DISABLED` flag
- **Updated** `app/Providers/AppServiceProvider.php` to initialize the PostHog SDK on boot
- **Added environment variables** `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to `.env`
- **Instrumented 10 events** across 6 files covering the full user lifecycle: registration, authentication, email verification, and the billing/subscription funnel
- **Identify calls** are made on registration, email/password login, and social login to link server-side events to person profiles

| Event | Description | File |
|---|---|---|
| `user_registered` | New user completed email/password registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User authenticated with email and password | `app/Livewire/Forms/LoginForm.php` |
| `user_signed_up_with_google` | New account created via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in_with_google` | Existing user logged in via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logged out of the application | `app/Livewire/Actions/Logout.php` |
| `email_verified` | User successfully verified their email address | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `subscription_checkout_started` | User initiated Stripe checkout for a plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Subscribed user switched to a different plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_swap_failed` | Plan swap attempt failed with an error | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User redirected to Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

- **Signup funnel**: `user_registered` → `email_verified` → `subscription_checkout_started` → `subscription_plan_swapped`
- **Daily signups**: Trend of `user_registered` + `user_signed_up_with_google` over time
- **Login method breakdown**: `user_logged_in` vs `user_logged_in_with_google`
- **Subscription conversion**: Users who did `subscription_checkout_started` but never `subscription_plan_swapped`
- **Churn signal**: Trend of `user_logged_out` events relative to active users

Create your dashboard here: [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
