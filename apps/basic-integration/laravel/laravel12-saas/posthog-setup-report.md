<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. Here's what was done:

- **Installed** `posthog/posthog-php` SDK via Composer.
- **Created** `config/posthog.php` — reads `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`, and `APP_DEBUG` from environment variables.
- **Created** `app/Services/PostHogService.php` — a singleton-style wrapper around the PHP SDK with `identify()`, `capture()`, `captureException()`, `isFeatureEnabled()`, and `getFeatureFlagPayload()` methods. All methods check `config('posthog.disabled')` before executing.
- **Added** `getPostHogProperties()` to `app/Models/User.php` returning `email`, `name`, `provider`, and `date_joined`.
- **Set** `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` in `.env`.
- **Instrumented** 10 events across 7 files covering the full user lifecycle and subscription funnel.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | New user completed email/password registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User authenticated via email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_out` | User logged out | `routes/auth.php` |
| `socialite_login` | User authenticated/registered via OAuth (Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `dashboard_viewed` | Logged-in user viewed the main dashboard | `app/Livewire/Dashboard.php` |
| `pricing_viewed` | Visitor viewed the public pricing page | `routes/web.php` |
| `profile_viewed` | Logged-in user viewed their profile/settings | `routes/web.php` |
| `subscription_checkout_started` | User initiated a plan checkout | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | User swapped to a different subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User was redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |

## Next steps

We've recommended the following insights for a dashboard. Create them at [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) by clicking **New dashboard** → **Analytics basics (wizard)**:

**Suggested insights:**

1. **Signup → Dashboard conversion funnel** — `user_signed_up` → `dashboard_viewed`: measures onboarding drop-off immediately after registration.
2. **Pricing → Checkout funnel** — `pricing_viewed` → `subscription_checkout_started`: measures how many visitors who viewed pricing started a checkout.
3. **Subscription conversions over time** — trend of `subscription_checkout_started` and `subscription_plan_swapped`: tracks revenue-critical events.
4. **Daily active users (login trend)** — trend of `user_logged_in` + `socialite_login`: measures daily engagement.
5. **Churn signal: logout rate** — trend of `user_logged_out` relative to `user_logged_in`: an early indicator of disengagement.

[Create a new dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
