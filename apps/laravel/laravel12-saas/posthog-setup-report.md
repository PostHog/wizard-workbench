<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The integration covers the full user lifecycle: registration, login (email + Google OAuth), logout, subscription checkout, and plan swaps — all tracked server-side via a dedicated `PostHogService` class.

## What was set up

- **`posthog/posthog-php ^4.0`** installed via Composer
- **`config/posthog.php`** — PostHog configuration file reading from environment variables
- **`app/Services/PostHogService.php`** — Service wrapper with `identify()`, `capture()`, and `captureException()` methods; initialized once via `AppServiceProvider`
- **`.env`** — `POSTHOG_API_KEY`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` written securely

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | New user completes email/password registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User logs in with email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_signed_up_with_social` | New user registers via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in_with_social` | Existing user signs in via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logs out | `app/Livewire/Actions/Logout.php` |
| `subscription_checkout_started` | User initiates a subscription checkout | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | User successfully swaps subscription plan | `app/Http/Controllers/SubscriptionController.php` |

`identify()` is called on every login and registration event (email, Google OAuth) so user behavior is tied to a consistent identity across sessions.

Error tracking via `captureException()` is added to the subscription plan swap error path.

## Next steps

To visualize these events, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Registrations & Logins (Daily)** — Trend: `user_registered` + `user_logged_in` + `user_signed_up_with_social` + `user_logged_in_with_social`
2. **Signup to Checkout Funnel** — Funnel: `user_registered` → `subscription_checkout_started` → `subscription_plan_swapped`
3. **Subscription Checkout Started (Weekly)** — Trend: `subscription_checkout_started`
4. **Plan Swaps (Weekly)** — Trend: `subscription_plan_swapped`
5. **User Logout Rate** — Trend: `user_logged_out` vs `user_logged_in` to gauge session engagement

Visit [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) to create the dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
