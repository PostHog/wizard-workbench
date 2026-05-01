<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The `posthog/posthog-php` SDK (v4.3.0) was installed, a dedicated `PostHogService` class was created in `app/Services/`, and PostHog is initialized in `AppServiceProvider`. Event tracking and user identification were added across authentication, billing, and account management flows — covering both email/password and Google OAuth paths.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | New user completes email registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User logs in with email and password | `app/Livewire/Forms/LoginForm.php` |
| `user_signed_up_social` | New user registers via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in_social` | Existing user logs in via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logs out of the application | `app/Livewire/Actions/Logout.php` |
| `subscription_checkout_started` | User initiates checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | User successfully changes their subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User is redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |
| `user_account_deleted` | User deletes their account (churn signal) | `resources/views/livewire/profile/delete-user-form.blade.php` |
| `pricing_page_viewed` | Marketing pricing page viewed — top of conversion funnel | `routes/web.php` |

## Files created or modified

- **Created**: `config/posthog.php` — PostHog configuration (reads from env vars)
- **Created**: `app/Services/PostHogService.php` — Centralized `capture()` and `identify()` wrapper
- **Modified**: `app/Providers/AppServiceProvider.php` — PostHog SDK initialization on boot
- **Modified**: `app/Livewire/Forms/LoginForm.php` — `user_logged_in` + identify
- **Modified**: `app/Livewire/Actions/Logout.php` — `user_logged_out`
- **Modified**: `app/Http/Controllers/Auth/SocialiteController.php` — `user_signed_up_social` / `user_logged_in_social` + identify
- **Modified**: `app/Http/Controllers/SubscriptionController.php` — checkout, swap, billing portal events
- **Modified**: `resources/views/livewire/pages/auth/register.blade.php` — `user_signed_up` + identify
- **Modified**: `resources/views/livewire/profile/delete-user-form.blade.php` — `user_account_deleted`
- **Modified**: `routes/web.php` — `pricing_page_viewed`

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these five insights to track the most important business metrics:

1. **Signup conversion funnel** — Funnel: `pricing_page_viewed` → `user_signed_up` + `user_signed_up_social`
2. **New signups over time** — Trend: `user_signed_up` + `user_signed_up_social` (daily)
3. **Subscription checkout conversion** — Funnel: `subscription_checkout_started` → `subscription_plan_swapped`
4. **Plan changes over time** — Trend: `subscription_plan_swapped` (with `plan_name` breakdown)
5. **Churn signal** — Trend: `user_account_deleted` (weekly, useful to watch alongside signups)

You can create this dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
