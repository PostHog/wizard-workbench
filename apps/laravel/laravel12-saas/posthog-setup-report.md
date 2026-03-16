<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS project. The following changes were made:

- **Installed** `posthog/posthog-php` (v3.7.3) via Composer.
- **Created** `config/posthog.php` — PostHog configuration using environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`).
- **Updated** `app/Providers/AppServiceProvider.php` — Initializes the PostHog PHP SDK on application boot via `PostHog::init()`.
- **Created** `app/Services/PostHogService.php` — Centralized service with static `capture()` and `identify()` helpers that respect the `POSTHOG_DISABLED` flag.
- **Updated** registration, login, social auth, subscription checkout/swap, billing portal, and logout flows to capture events and identify users.

| Event | Description | File |
|---|---|---|
| `user_registered` | New user completes email registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User logs in with email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in_social` | User authenticates via social OAuth (e.g. Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `social_signup_completed` | Brand-new account created via social OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logs out | `routes/auth.php` |
| `subscription_checkout_started` | User initiates Stripe checkout for a plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | Subscription created in demo mode | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | User switches to a different subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User redirected to Stripe billing portal | `app/Actions/Billing/RedirectToBillingPortal.php` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Registration & Login funnel** — Funnel: `user_registered` → `subscription_checkout_started` → `subscription_created`
2. **Daily active registrations** — Trend: `user_registered` over time
3. **Login method breakdown** — `user_logged_in` vs `user_logged_in_social` (breakdown by `provider`)
4. **Subscription conversion rate** — Funnel: `user_registered` → `subscription_created`
5. **Churn signal** — Trend: `user_logged_out` without a `subscription_created` in session

Create your dashboard here: [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
