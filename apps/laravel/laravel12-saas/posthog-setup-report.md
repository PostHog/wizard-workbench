<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The following changes were made:

- **Installed** `posthog/posthog-php ^4.0` via Composer
- **Created** `config/posthog.php` — PostHog configuration reading from environment variables
- **Created** `app/Services/PostHogService.php` — A reusable service class wrapping the PostHog PHP SDK with `identify()`, `capture()`, `captureException()`, `isFeatureEnabled()`, and `getFeatureFlagPayload()` methods
- **Updated** `app/Providers/AppServiceProvider.php` — Initializes PostHog once in the `boot()` method
- **Updated** `app/Models/User.php` — Added `getPostHogProperties()` helper returning `email`, `name`, `email_verified`, and `date_joined`
- **Updated** `.env` — Added `POSTHOG_API_KEY`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` environment variables
- **Instrumented 10 events** across 8 files covering auth, billing, and profile flows

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully registers via the Volt registration form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Fired when a user successfully logs in via the Volt login form | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_out` | Fired when a user logs out of the application | `app/Livewire/Actions/Logout.php` |
| `social_auth_completed` | Fired when a user authenticates or registers via a social provider (e.g. Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `subscription_checkout_started` | Fired when a user initiates checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Fired when a subscribed user upgrades or downgrades to a different plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_opened` | Fired when a user is redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |
| `profile_updated` | Fired when a user saves changes to their profile information | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `account_deleted` | Fired when a user permanently deletes their account | `resources/views/livewire/profile/delete-user-form.blade.php` |
| `dashboard_viewed` | Fired when a user loads the main application dashboard (top of the post-login funnel) | `app/Livewire/Dashboard.php` |

## Next steps

We've designed an "Analytics basics" dashboard for you to keep an eye on user behavior. Create it in PostHog using the insights below:

1. **Signup & Login Trend** — Trends chart with `user_signed_up` and `user_logged_in` over last 30 days
2. **Subscription Signup Funnel** — Funnel: `user_signed_up` → `dashboard_viewed` → `subscription_checkout_started` → `subscription_plan_swapped`
3. **Daily Active Users** — Trends chart with `dashboard_viewed` (DAU math) over last 30 days
4. **Churn Events** — Trends chart with `account_deleted` over last 30 days
5. **Auth Method Breakdown** — Trends chart comparing `user_logged_in` vs `social_auth_completed` over last 30 days

Visit your PostHog project to create the dashboard: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
