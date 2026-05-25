<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. A new `PostHogService` class was created as a centralized wrapper around the PostHog PHP SDK, and event capture calls were added across nine key business flows covering the full user lifecycle — from signup through subscription management and profile updates. The `posthog/posthog-php` SDK (v4.4) was installed via Composer, and a dedicated `config/posthog.php` configuration file was added. All PostHog credentials are read from environment variables and never hardcoded.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user completes registration via the email/password form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Fired when a user successfully authenticates via email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_out` | Fired when a user explicitly logs out | `app/Livewire/Actions/Logout.php` |
| `social_signup_completed` | Fired when a brand-new user account is created through a social provider | `app/Http/Controllers/Auth/SocialiteController.php` |
| `social_login_completed` | Fired when an existing user signs in via a social provider (e.g. Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `subscription_checkout_started` | Fired when a user initiates checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Fired when an existing subscriber switches to a different plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | Fired when a user is redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |
| `profile_updated` | Fired when a user saves changes to their name or email address | `resources/views/livewire/profile/update-profile-information-form.blade.php` |

## Next steps

Build an "Analytics basics" dashboard in PostHog to monitor user behavior and subscription conversion. Suggested insights:

1. **Signups over time** — Trends chart on `user_signed_up` (daily, last 30 days)
2. **Login activity** — Trends chart comparing `user_logged_in` and `social_login_completed`
3. **Subscription conversion funnel** — Funnel: `user_signed_up` → `subscription_checkout_started` → `subscription_plan_swapped`
4. **Plan upgrade rate** — Trends chart on `subscription_plan_swapped` (daily, last 30 days)
5. **Churn signal** — Trends chart on `user_logged_out` vs `user_logged_in` ratio

Create your dashboard here: [/dashboard](/dashboard)

Browse all dashboards: [/dashboards](/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
