<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Laravel 12 SaaS application. The `posthog/posthog-php` SDK was installed via Composer, a dedicated `PostHogService` class was created to centralize all PostHog interactions (event capture, identify, exception capture, and feature flags), and PostHog was initialized in `AppServiceProvider`. Nine meaningful events were instrumented across the authentication flow, subscription/billing lifecycle, dashboard activity, and profile management. All API keys are read from environment variables — never hardcoded.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user completes registration via email/password form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Fired when a user successfully authenticates via email/password form | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_out` | Fired when a user logs out of their session | `routes/auth.php` |
| `user_logged_in_via_socialite` | Fired when a user authenticates or registers via a social provider (e.g. Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `subscription_started` | Fired when a user initiates a subscription checkout (or completes a demo subscription) | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Fired when a subscribed user changes their plan (upgrade or downgrade) | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | Fired when a user opens the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |
| `dashboard_viewed` | Fired when an authenticated user views the dashboard | `app/Livewire/Dashboard.php` |
| `profile_updated` | Fired when a user saves changes to their profile information | `resources/views/livewire/profile/update-profile-information-form.blade.php` |

## Files created / modified

| File | Change |
|---|---|
| `config/posthog.php` | **Created** — PostHog config reading from env vars |
| `app/Services/PostHogService.php` | **Created** — Central service for capture, identify, exception tracking, and feature flags |
| `app/Models/User.php` | **Modified** — Added `getPostHogProperties()` helper method |
| `app/Providers/AppServiceProvider.php` | **Modified** — PostHog initialized in `boot()` |
| `resources/views/livewire/pages/auth/register.blade.php` | **Modified** — `user_signed_up` + identify on registration |
| `resources/views/livewire/pages/auth/login.blade.php` | **Modified** — `user_logged_in` + identify on login |
| `routes/auth.php` | **Modified** — `user_logged_out` on logout |
| `app/Http/Controllers/Auth/SocialiteController.php` | **Modified** — `user_logged_in_via_socialite` + identify on social auth |
| `app/Http/Controllers/SubscriptionController.php` | **Modified** — `subscription_started`, `subscription_plan_swapped`, `billing_portal_accessed`, exception capture on swap error |
| `app/Livewire/Dashboard.php` | **Modified** — `dashboard_viewed` on component mount |
| `resources/views/livewire/profile/update-profile-information-form.blade.php` | **Modified** — `profile_updated` + re-identify on profile save |

## Next steps

To view analytics for this app, log in to PostHog and create an "Analytics basics" dashboard with the following suggested insights:

1. **New Signups & Logins (Daily)** — Trend of `user_signed_up`, `user_logged_in`, and `user_logged_in_via_socialite` events
2. **Signup → Dashboard → Subscription Funnel** — Funnel: `user_signed_up` → `dashboard_viewed` → `subscription_started`
3. **Subscription Activity (Weekly)** — Trend of `subscription_started` and `subscription_plan_swapped`
4. **Billing Portal & Plan Changes** — Trend of `billing_portal_accessed` and `subscription_plan_swapped`
5. **User Churn Signals** — Trend of `user_logged_out` over 90 days

Navigate to [PostHog dashboards](https://us.posthog.com/project/2/dashboards) to create these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
