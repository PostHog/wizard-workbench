<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Laravel 12 SaaS application. The integration covers server-side event tracking for all critical user and billing actions, user identification on login and registration, and a dedicated `PostHogService` class to keep analytics concerns centralized.

**Files created:**
- `config/posthog.php` — PostHog configuration reading from environment variables
- `app/Services/PostHogService.php` — Centralized service for `capture()` and `identify()` calls

**Files modified:**
- `app/Providers/AppServiceProvider.php` — Initializes `PostHog::init()` on boot
- `resources/views/livewire/pages/auth/register.blade.php` — `user_registered` + identify on signup
- `app/Livewire/Forms/LoginForm.php` — `user_logged_in` + identify on email/password login
- `app/Http/Controllers/Auth/SocialiteController.php` — `user_logged_in_social` + identify on OAuth
- `app/Http/Controllers/SubscriptionController.php` — Subscription checkout, creation, plan swap, and billing portal events

**Package installed:** `posthog/posthog-php` v3.7.3

**Environment variables set** (via `.env`):
- `POSTHOG_PROJECT_TOKEN`
- `POSTHOG_HOST`
- `POSTHOG_DISABLED`

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | New user completes registration via Volt form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User authenticates with email/password | `app/Livewire/Forms/LoginForm.php` |
| `user_logged_in_social` | User logs in or registers via social provider (Google, etc.) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `subscription_checkout_started` | User initiates a Stripe checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | Demo/stub subscription created (Stripe not configured) | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | User successfully swaps their active subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | Authenticated user is redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with insights like:

1. **Signup funnel** — Funnel from `user_registered` → `subscription_checkout_started` → `subscription_created`
2. **Daily signups** — Trend of `user_registered` over time
3. **Login methods** — Breakdown of `user_logged_in` vs `user_logged_in_social` by `provider` property
4. **Subscription conversion** — Trend of `subscription_checkout_started` vs `subscription_created`
5. **Plan changes** — Trend of `subscription_plan_swapped` with breakdown by `plan_name`

You can create these at: [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
