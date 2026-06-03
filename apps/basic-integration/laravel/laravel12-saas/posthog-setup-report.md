<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The following changes were made:

- Installed `posthog/posthog-php` (v4.5.0) via Composer
- Created `config/posthog.php` to centralise PostHog settings via environment variables
- Set `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` in `.env`
- Created `app/Services/PostHogService.php` — a wrapper around the PHP SDK providing `identify()`, `capture()`, `captureException()`, `isFeatureEnabled()`, and `getFeatureFlagPayload()` methods
- Added `getPostHogProperties()` to `app/Models/User.php` to provide consistent person properties
- Initialised PostHog in `app/Providers/AppServiceProvider.php` so it is ready before any request handler runs
- Created `app/Http/Middleware/PostHogRequestContext.php` to read `X-PostHog-Distinct-Id` and `X-PostHog-Session-Id` headers from the PostHog JS frontend SDK, enabling cross-domain event correlation; registered it in `bootstrap/app.php` for all web routes
- Added global exception capture in `bootstrap/app.php` using `PostHog::captureException()` so unhandled Laravel exceptions are automatically tracked with the current user context
- Instrumented 8 business events across 6 files (see table below)

| Event | Description | File |
|---|---|---|
| `user_registered` | A new user completes the registration form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | A user logs in with email and password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in_social` | A user logs in or signs up via a social provider (e.g. Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | A user logs out of the application | `routes/auth.php` |
| `subscription_checkout_started` | A user initiates a checkout session for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | A subscribed user changes their active subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | A user navigates to the Stripe billing portal to manage their subscription | `app/Http/Controllers/SubscriptionController.php` |
| `dashboard_viewed` | An authenticated user views the main dashboard | `app/Livewire/Dashboard.php` |

## Next steps

To monitor user behaviour, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Signup funnel** — Funnel insight: `user_registered` → `dashboard_viewed` → `subscription_checkout_started`  
2. **Subscription conversions** — Trends insight: `subscription_checkout_started` count over time  
3. **Plan changes** — Trends insight: `subscription_plan_swapped` broken down by `new_plan_name`  
4. **Authentication methods** — Trends insight: `user_logged_in` and `user_logged_in_social` side by side  
5. **Active users** — Trends insight: `dashboard_viewed` unique users over time  

Visit [PostHog Dashboards](/dashboard) to create these manually.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
