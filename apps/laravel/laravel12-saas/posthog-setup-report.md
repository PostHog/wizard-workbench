# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Laravel 12 SaaS application. The `posthog/posthog-php` SDK was installed and configured with a dedicated `PostHogService` class (`app/Services/PostHogService.php`) that wraps the SDK with safe initialization guards and a `config/posthog.php` configuration file. PostHog is initialized on boot in `AppServiceProvider`. Ten events across eight files cover the full user lifecycle — from registration and login through subscription checkout, plan swaps, billing portal access, and account deletion.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user completes registration via the standard signup form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_signed_up` | Fired when a new user account is created via a social provider | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in` | Fired when a user successfully authenticates with email and password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in` | Fired when a user logs in via a social provider (Google, etc.) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | Fired when a user logs out of the application | `app/Livewire/Actions/Logout.php` |
| `dashboard_viewed` | Fired when an authenticated user visits the main dashboard | `app/Livewire/Dashboard.php` |
| `subscription_checkout_started` | Fired when a user initiates the checkout process for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Fired when a user successfully switches from one subscription plan to another | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | Fired when a user is redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |
| `account_deleted` | Fired when a user deletes their account (churn signal) | `resources/views/livewire/profile/delete-user-form.blade.php` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1344803)
- [Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/Cpg2izVb) — Tracks users from signup through checkout
- [User Acquisition](https://us.posthog.com/project/2/insights/pfv4PACB) — Daily signups and sign-ins over the last 30 days
- [Subscription Activity](https://us.posthog.com/project/2/insights/etSY0JLy) — Checkout completions and subscription changes
- [Churn Signals](https://us.posthog.com/project/2/insights/a1wKlBlE) — Account deletions over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
