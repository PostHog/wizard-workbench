<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The PostHog PHP SDK (`posthog/posthog-php` v3.7.3) has been installed, a dedicated `PostHogService` class centralises all capture and identify calls, and event tracking has been added to all key user flows including authentication, social login, and subscription management.

## Summary of changes

- **`config/posthog.php`** — New config file reading `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` from environment variables.
- **`app/Services/PostHogService.php`** — New service class with static `capture()` and `identify()` methods. All calls are no-ops when `POSTHOG_DISABLED=true`.
- **`app/Providers/AppServiceProvider.php`** — PostHog SDK initialised in `boot()` using config values.
- **`.env`** — `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` values written.
- **`composer.json` / `composer.lock`** — `posthog/posthog-php ^3.7` added as a dependency.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user completes email/password registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Fired when a user successfully authenticates via email/password | `app/Livewire/Forms/LoginForm.php` |
| `social_login_completed` | Fired on OAuth callback (Google etc). Includes `provider` and `is_new_user` properties | `app/Http/Controllers/Auth/SocialiteController.php` |
| `subscription_checkout_started` | Fired when a user initiates a Stripe checkout session | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Fired when a user successfully swaps to a different plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | Fired when a user is redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |
| `user_logged_out` | Fired when a user logs out | `app/Livewire/Actions/Logout.php` |
| `password_reset_requested` | Fired when a password reset link is successfully sent | `resources/views/livewire/pages/auth/forgot-password.blade.php` |

## Next steps

We've outlined five insights to build in PostHog under a new **"Analytics basics"** dashboard. Navigate to [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) and create a new dashboard, then add these insights:

1. **Registration → Subscription funnel** — A Funnel insight with steps: `user_registered` → `subscription_checkout_started`. Shows how many new users convert to paying customers.

2. **New registrations over time** — A Trends insight for `user_registered` (daily count). Shows growth in new signups.

3. **Login method breakdown** — A Trends insight comparing `user_logged_in` and `social_login_completed` event counts. Shows which authentication methods users prefer.

4. **Plan swap rate** — A Trends insight for `subscription_plan_swapped` over time. Tracks how frequently users upgrade or change plans.

5. **Logout vs login ratio** — A Trends insight showing `user_logged_out` vs `user_logged_in` over time. An early signal of disengagement if logout rate rises relative to logins.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
