<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS project. Here's a summary of what was done:

- **Installed** `posthog/posthog-php` via Composer
- **Created** `config/posthog.php` — reads `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` from environment variables
- **Created** `app/Services/PostHogService.php` — a thin wrapper around `PostHog::capture` and `PostHog::identify` that respects the `disabled` flag
- **Updated** `app/Providers/AppServiceProvider.php` — initializes the PostHog PHP SDK in `boot()` using config values
- **Updated** `resources/views/layouts/app.blade.php` — added the PostHog JS snippet for client-side autocapture and automatic `identify()` calls for authenticated users
- **Updated** auth and billing files to fire server-side events at key conversion and churn moments (see table below)
- **Set** `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` in `.env`

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User completes email/password registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User authenticates successfully with email and password | `app/Livewire/Forms/LoginForm.php` |
| `social_signup_completed` | New user account created via OAuth social provider | `app/Http/Controllers/Auth/SocialiteController.php` |
| `social_login_completed` | Existing user logs in via OAuth social provider | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logs out of the application | `app/Livewire/Actions/Logout.php` |
| `subscription_checkout_started` | User initiates a subscription checkout for a plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | User swaps their active subscription to a different plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User navigates to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |

## Next steps

To explore your data, head to your PostHog project and create an **"Analytics basics"** dashboard. Suggested insights to add:

1. **Signup funnel** — Funnel from `user_signed_up` / `social_signup_completed` → `subscription_checkout_started` → (return visit to dashboard after checkout)
2. **Signup trend** — Trend of `user_signed_up` + `social_signup_completed` over time
3. **Login method breakdown** — Breakdown of `user_logged_in` vs `social_login_completed` by provider
4. **Subscription checkout trend** — Trend of `subscription_checkout_started` to track plan interest
5. **Plan swaps & billing portal** — Combined trend of `subscription_plan_swapped` and `billing_portal_accessed` to watch upgrade/downgrade activity

**PostHog project:** https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
