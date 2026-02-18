<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Laravel 12 SaaS application. The `posthog/posthog-php` SDK (v3.7.3) was installed via Composer and a singleton `PostHogService` wrapper class was created to handle initialisation, event capture, user identification, exception tracking, and feature flags — all driven by environment variables with a `POSTHOG_DISABLED` kill-switch for safe local development. The service is registered as a Laravel singleton in `AppServiceProvider` and is dependency-injected into every relevant controller, action, and Volt component.

Events are captured at the exact moment they occur in the request lifecycle, **before** any session destruction or redirect. User identity is established on every login and signup via `PostHog::identify()`, passing name, email, provider, and join date as person properties, so server-side events are automatically correlated with the correct user profile in PostHog.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | New user completes email/password registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User authenticates (password or OAuth), with `login_method` property | `resources/views/livewire/pages/auth/login.blade.php`, `app/Http/Controllers/Auth/SocialiteController.php` |
| `socialite_signup` | Brand-new user registers for the first time via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | Authenticated user logs out (captured before session destroy) | `routes/auth.php` |
| `email_verified` | User successfully verifies their email address | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `subscription_checkout_started` | User initiates a plan checkout, with `plan_name` and `plan_price` | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | Subscription successfully created (Stripe or demo mode) | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | User changes from one plan to another | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User is redirected to the Stripe billing portal | `app/Actions/Billing/RedirectToBillingPortal.php` |
| `$exception` | Subscription plan-swap errors captured with full stack trace | `app/Http/Controllers/SubscriptionController.php` |

## Files changed

| File | Change |
|---|---|
| `composer.json` | Added `posthog/posthog-php: "*"` |
| `config/posthog.php` | New config file — reads `POSTHOG_API_KEY`, `POSTHOG_HOST`, `POSTHOG_DISABLED` from env |
| `app/Services/PostHogService.php` | New service — wraps SDK with `identify`, `capture`, `captureException`, `isFeatureEnabled`, `getFeatureFlagPayload` |
| `app/Providers/AppServiceProvider.php` | Registered `PostHogService` as a singleton |
| `app/Models/User.php` | Added `getPostHogProperties()` helper returning name, email, provider, date_joined |
| `resources/views/livewire/pages/auth/register.blade.php` | Identify + `user_signed_up` on registration |
| `resources/views/livewire/pages/auth/login.blade.php` | Identify + `user_logged_in` on password login |
| `app/Http/Controllers/Auth/SocialiteController.php` | Identify + `user_logged_in` + `socialite_signup` on OAuth callback |
| `routes/auth.php` | `user_logged_out` on logout |
| `app/Http/Controllers/Auth/VerifyEmailController.php` | `email_verified` on verification |
| `app/Http/Controllers/SubscriptionController.php` | `subscription_checkout_started`, `subscription_created`, `subscription_plan_swapped`, `$exception` |
| `app/Actions/Billing/RedirectToBillingPortal.php` | `billing_portal_accessed` |
| `.env` | Added `POSTHOG_API_KEY`, `POSTHOG_HOST`, `POSTHOG_DISABLED` |

## Next steps

Once your PostHog API key has `dashboard:write` and `insight:write` scopes, create an **"Analytics basics"** dashboard with these 5 recommended insights:

1. **User Signups Over Time** — Trend on `user_signed_up` (last 30 days)
2. **Logins by Method** — Trend on `user_logged_in` broken down by `login_method` property
3. **Subscription Conversion Funnel** — Funnel: `user_signed_up` → `subscription_checkout_started` → `subscription_created`
4. **Plan Swap Activity** — Trend on `subscription_plan_swapped` (last 30 days)
5. **Email Verification Rate** — Trend on `email_verified` vs `user_signed_up` (last 30 days)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
