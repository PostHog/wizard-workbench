<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Laravel 12 SaaS application. Here's a summary of everything that was added:

- **`posthog/posthog-php` SDK** installed via Composer and initialized in `AppServiceProvider`
- **`config/posthog.php`** created to manage API key, host, and disabled flag via environment variables
- **`app/Services/PostHogService.php`** created as a dedicated service class with `capture()` and `identify()` methods
- **PostHog JS snippet** added to both `layouts/app.blade.php` (authenticated) and `layouts/guest.blade.php` (unauthenticated) for client-side tracking, with `posthog.identify()` called on every authenticated page load
- **10 server-side events** instrumented across 6 files covering the full user lifecycle: registration, login, social auth, email verification, subscription funnel, billing portal, and logout

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | New user completes email/password registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Existing user authenticates with email/password | `app/Livewire/Forms/LoginForm.php` |
| `user_registered_via_social` | New user registers via OAuth provider (first time) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in_via_social` | Existing user logs in via OAuth provider | `app/Http/Controllers/Auth/SocialiteController.php` |
| `email_verified` | User verifies their email address | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `subscription_plans_viewed` | User views the subscription plans page | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_checkout_started` | User initiates checkout for a plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | User swaps to a different subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User is redirected to Stripe billing portal | `app/Actions/Billing/RedirectToBillingPortal.php` |
| `user_logged_out` | User logs out of the application | `app/Livewire/Actions/Logout.php` |

## Next steps

We recommend building the following insights on an **"Analytics basics"** dashboard in PostHog to monitor key user behavior:

1. **Subscription Conversion Funnel** — Funnel: `subscription_plans_viewed` → `subscription_checkout_started` → `subscription_plan_changed`. Shows where users drop off in your billing flow.

2. **New User Signups Over Time** — Trends: `user_registered` + `user_registered_via_social`. Track signup growth and which registration method is most popular.

3. **Login Activity** — Trends: `user_logged_in` + `user_logged_in_via_social`. Monitor active user engagement and social vs. email auth usage.

4. **Billing Actions** — Trends: `subscription_checkout_started`, `subscription_plan_changed`, `billing_portal_accessed`. See how engaged users are with your billing flows.

5. **User Churn Indicator** — Trends: `user_logged_out`. Spikes can indicate dissatisfaction or friction in the product.

You can create these at: https://us.posthog.com/project/2/insights/new

Or navigate to your dashboards at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
