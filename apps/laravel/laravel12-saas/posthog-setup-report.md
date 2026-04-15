<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The PHP SDK (`posthog/posthog-php`) has been installed, a dedicated `PostHogService` class was created, and event tracking was added across the core user journey: registration, login (email and social), subscription checkout, plan swaps, and logout. PostHog is initialized once in `AppServiceProvider` on boot, using environment variables for all credentials.

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired when a user completes email registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Fired when a user logs in via email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_signed_up` | Fired when a new account is created via social provider | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in` | Fired when a user logs in via social provider (e.g. Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `subscription_checkout_started` | Fired when a user initiates a Stripe checkout | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | Fired when a demo/stub subscription is created | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Fired when a subscribed user changes their plan | `app/Http/Controllers/SubscriptionController.php` |
| `user_logged_out` | Fired when a user logs out | `app/Livewire/Actions/Logout.php` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these five insights to monitor your key business metrics:

1. **Registration → Subscription funnel** — Funnel insight: `user_registered` → `subscription_checkout_started` → `subscription_created`
2. **New registrations over time** — Trend: `user_registered` (daily unique users)
3. **Login method breakdown** — Trend: `user_logged_in` broken down by `method` property (email vs google)
4. **Plan swaps over time** — Trend: `subscription_plan_swapped` broken down by `plan_name`
5. **User churn / logout rate** — Trend: `user_logged_out` (daily total)

You can create this dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
