<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The following changes were made:

- **`composer.json`** — `posthog/posthog-php` SDK installed as a dependency.
- **`.env`** — `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` environment variables added.
- **`config/posthog.php`** — New config file reading PostHog settings from environment variables.
- **`app/Services/PostHogService.php`** — New service class wrapping `PostHog::capture` and `PostHog::identify` with disabled-flag support.
- **`app/Providers/AppServiceProvider.php`** — `PostHog::init()` called in `boot()` to initialize the SDK once on application start.
- **`resources/views/livewire/pages/auth/register.blade.php`** — User identify + `user_registered` event captured after successful registration.
- **`resources/views/livewire/pages/auth/login.blade.php`** — User identify + `user_logged_in` event captured after successful email/password login.
- **`app/Http/Controllers/Auth/SocialiteController.php`** — User identify + `user_logged_in_social` event captured after social (OAuth) login/signup.
- **`app/Livewire/Actions/Logout.php`** — `user_logged_out` event captured before session invalidation.
- **`app/Http/Controllers/SubscriptionController.php`** — `subscription_checkout_started`, `subscription_plan_swapped`, and `billing_portal_accessed` events captured at the relevant billing actions.

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user completes registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Fired when a user successfully logs in with email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in_social` | Fired when a user logs in or signs up via a social provider | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | Fired when a user logs out | `app/Livewire/Actions/Logout.php` |
| `subscription_checkout_started` | Fired when a user initiates a checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Fired when an existing subscriber successfully swaps to a different plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | Fired when a user is redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |

## Next steps

Head to your PostHog project to build insights and a dashboard based on these events. Some recommended insights:

- **Registration → Subscription funnel** — Funnel from `user_registered` → `subscription_checkout_started` to measure conversion rate from signup to paying customer.
- **Daily active registrations** — Trend chart of `user_registered` over time to track growth.
- **Login method breakdown** — Breakdown of `user_logged_in` vs `user_logged_in_social` to see which auth method is most popular.
- **Plan swap activity** — Trend of `subscription_plan_swapped` to monitor upgrade/downgrade behavior.
- **Billing portal usage** — Trend of `billing_portal_accessed` as a churn signal.

- [PostHog Dashboards](https://us.posthog.com/project/238460/dashboard)
- [PostHog Insights](https://us.posthog.com/project/238460/insights)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
