<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Laravel 12 SaaS application. The integration covers the full user lifecycle — from first signup through authentication, subscription conversion, plan changes, and billing portal access — using a dedicated `PostHogService` class that wraps the PostHog PHP SDK. All API keys are stored in environment variables and never hardcoded. The `posthog/posthog-php` package was installed via Composer.

## New files created

| File | Purpose |
|------|---------|
| `config/posthog.php` | PostHog configuration (reads from env vars) |
| `app/Services/PostHogService.php` | Wrapper service for PostHog SDK — identify, capture, captureException, feature flags |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | New user registers via email/password form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_signed_up` | New user registers via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in` | User authenticates via email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in` | User authenticates via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logs out | `app/Livewire/Actions/Logout.php` |
| `dashboard_viewed` | Authenticated user visits the dashboard | `app/Livewire/Dashboard.php` |
| `subscription_checkout_started` | User initiates a subscription checkout | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | Subscription successfully created (demo/stub mode) | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_swapped` | User swaps/upgrades their subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User accesses the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |

## Files modified

| File | Changes |
|------|---------|
| `app/Providers/AppServiceProvider.php` | Registered `PostHogService` as a singleton |
| `app/Models/User.php` | Added `getPostHogProperties()` helper method |
| `app/Livewire/Actions/Logout.php` | Added `user_logged_out` capture |
| `app/Livewire/Dashboard.php` | Added `dashboard_viewed` capture via `mount()` |
| `resources/views/livewire/pages/auth/login.blade.php` | Added `identify` + `user_logged_in` capture |
| `resources/views/livewire/pages/auth/register.blade.php` | Added `identify` + `user_signed_up` capture |
| `app/Http/Controllers/Auth/SocialiteController.php` | Added `identify` + `user_signed_up`/`user_logged_in` for OAuth flows |
| `app/Http/Controllers/SubscriptionController.php` | Added subscription checkout, creation, swap, billing portal events + error tracking |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **Dashboard**: [Analytics basics](https://us.posthog.com/dashboard/1274416)
- 📈 **User Signups** (weekly trend): [https://us.posthog.com/insights/4XjdN4fT](https://us.posthog.com/insights/4XjdN4fT)
- 👤 **User Sign-ins** (daily active): [https://us.posthog.com/insights/Z4MJ13Bd](https://us.posthog.com/insights/Z4MJ13Bd)
- 🛒 **Checkout Conversion Funnel**: [https://us.posthog.com/insights/4gI2V1F8](https://us.posthog.com/insights/4gI2V1F8)
- ❌ **Subscription Cancellations** (churn): [https://us.posthog.com/insights/t1ax7H7E](https://us.posthog.com/insights/t1ax7H7E)
- 🗑️ **Account Deletions** (churn): [https://us.posthog.com/insights/Qtdf9d91](https://us.posthog.com/insights/Qtdf9d91)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
