<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The integration covers user identification, event tracking across authentication and billing flows, request context propagation, and error tracking.

**Changes made:**

- **`composer.json`** — Added `posthog/posthog-php` dependency.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` environment variables.
- **`config/posthog.php`** *(new)* — PostHog configuration file reading from environment variables.
- **`app/Services/PostHogService.php`** *(new)* — Wrapper service with `identify()`, `capture()`, and `captureException()` methods. All methods check `posthog.disabled` before acting.
- **`app/Http/Middleware/PostHogRequestContext.php`** *(new)* — Reads `X-PostHog-Distinct-Id` and `X-PostHog-Session-Id` tracing headers, enriches context with URL, method, IP, and user agent for backend/frontend correlation.
- **`app/Providers/AppServiceProvider.php`** — Initializes PostHog once on boot using the configured API key and host.
- **`bootstrap/app.php`** — Registers `PostHogRequestContext` middleware on the web stack; adds a global exception reporter that calls `PostHog::captureException()` for every unhandled Laravel exception.
- **`app/Models/User.php`** — Added `getPostHogProperties()` returning `email`, `name`, and `date_joined` for consistent person profile updates.
- **`resources/views/livewire/pages/auth/register.blade.php`** — Identifies user and captures `user_registered` after successful signup.
- **`resources/views/livewire/pages/auth/login.blade.php`** — Identifies user and captures `user_logged_in` after successful password login.
- **`app/Http/Controllers/Auth/SocialiteController.php`** — Identifies user and captures `user_signed_up_with_google` (new accounts) or `user_logged_in_with_google` (returning users) after OAuth callback.
- **`app/Livewire/Actions/Logout.php`** — Captures `user_logged_out` before invalidating the session.
- **`app/Http/Controllers/SubscriptionController.php`** — Captures `subscription_checkout_started`, `subscription_plan_changed`, and `billing_portal_accessed` at each billing action.

## Events

| Event | Description | File |
|---|---|---|
| `user_registered` | New user completes email/password registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Existing user logs in with email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in_with_google` | Existing user logs in via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_signed_up_with_google` | New user account created via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logs out of the application | `app/Livewire/Actions/Logout.php` |
| `subscription_checkout_started` | User initiates a subscription checkout for a plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | User swaps from one subscription plan to another | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User is redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |

## Next steps

Head to your PostHog project to build insights from the events now being tracked:

- [View events as they arrive](/activity/explore)
- [Create a trends insight for signups and logins](/insights/new)
- [Build a signup-to-subscription conversion funnel](/insights/new)
- [View all persons and their event history](/persons)

Suggested insights to create:

1. **Signup trend** — Trends for `user_registered` + `user_signed_up_with_google` over time.
2. **Login trend** — Trends for `user_logged_in` + `user_logged_in_with_google` over time.
3. **Signup → Checkout funnel** — Funnel from `user_registered` → `subscription_checkout_started`.
4. **Subscription conversion** — Trends for `subscription_checkout_started` vs `subscription_plan_changed`.
5. **Churn signal** — Trends for `user_logged_out` and `billing_portal_accessed`.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
