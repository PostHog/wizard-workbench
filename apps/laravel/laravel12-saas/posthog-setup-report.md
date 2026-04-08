<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Laravel 12 SaaS project. The following changes were made:

- Installed `posthog/posthog-php` via Composer
- Added `config/posthog.php` for centralized PostHog configuration via environment variables
- Created `app/Services/PostHogService.php` — a thin static wrapper around `PostHog::capture` and `PostHog::identify` with a `disabled` guard
- Initialized PostHog in `app/Providers/AppServiceProvider.php` using `PostHog::init()`
- Added the PostHog JS snippet to both `resources/views/layouts/app.blade.php` and `resources/views/layouts/guest.blade.php` for client-side analytics; the app layout automatically calls `posthog.identify()` for authenticated users
- Instrumented 6 server-side event capture points across 4 files

| Event | Description | File |
|---|---|---|
| `user_registered` | User completes registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User logs in with email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in_social` | User logs in or registers via OAuth (e.g. Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logs out | `app/Livewire/Actions/Logout.php` |
| `subscription_checkout_started` | User initiates checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | User upgrades or downgrades their plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User is redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |

## Next steps

To explore your analytics, go to your PostHog project at https://us.posthog.com and create an "Analytics basics" dashboard. Suggested insights:

1. **Registration trend** — Trends chart for `user_registered` over time
2. **Login method breakdown** — Trends for `user_logged_in` + `user_logged_in_social` broken down by method
3. **Signup → Checkout conversion funnel** — Funnel: `user_registered` → `subscription_checkout_started`
4. **Plan swap activity** — Trends for `subscription_plan_swapped` to track upgrade/downgrade velocity
5. **Billing portal usage** — Trends for `billing_portal_accessed` to monitor self-service billing engagement

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
