<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 + Livewire + Volt SaaS starter. The integration uses the `posthog/posthog-php` SDK (v3.7.3) with a dedicated `PostHogService` class to centralise all tracking. User identity is established at authentication boundaries (registration, login, social OAuth) and propagated through billing and profile actions.

**Files created:**
- `config/posthog.php` — PostHog configuration (reads from env vars)
- `app/Services/PostHogService.php` — PostHog service wrapper (identify, capture, captureException)

**Files modified:**
- `app/Models/User.php` — added `getPostHogProperties()` method
- `app/Livewire/Dashboard.php` — `dashboard_viewed` event on mount
- `app/Http/Controllers/Auth/SocialiteController.php` — `social_login_completed` + identify on OAuth callback
- `app/Http/Controllers/SubscriptionController.php` — `subscription_checkout_started` and `subscription_plan_swapped` events
- `resources/views/livewire/pages/auth/login.blade.php` — `user_logged_in` + identify after login
- `resources/views/livewire/pages/auth/register.blade.php` — `user_signed_up` + identify after registration
- `resources/views/livewire/profile/update-profile-information-form.blade.php` — `profile_updated` after save
- `routes/auth.php` — `user_logged_out` event before session invalidation
- `.env.example` — added PostHog env var placeholders

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User registered via the registration form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User authenticated via email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `social_login_completed` | User authenticated via OAuth provider (e.g. Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logged out of the application | `routes/auth.php` |
| `dashboard_viewed` | Authenticated user viewed the dashboard | `app/Livewire/Dashboard.php` |
| `subscription_checkout_started` | User initiated a subscription checkout | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | User swapped to a different subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `profile_updated` | User saved updated profile information | `resources/views/livewire/profile/update-profile-information-form.blade.php` |

## Next steps

We recommend building the following insights in PostHog to monitor key business metrics. Visit your [PostHog project](https://us.posthog.com/project/2) and create a new dashboard called **"Analytics basics"** with these insights:

1. **Signup trend** — Trends chart for `user_signed_up` over the last 30 days
2. **Login method breakdown** — Trends chart comparing `user_logged_in` (password) vs `social_login_completed` (OAuth)
3. **Signup → Checkout conversion funnel** — Funnel: `user_signed_up` → `subscription_checkout_started`
4. **Subscription swap rate** — Trends chart for `subscription_plan_swapped` over time
5. **Active users** — Trends chart for `dashboard_viewed` (unique users) as a daily active user proxy

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
