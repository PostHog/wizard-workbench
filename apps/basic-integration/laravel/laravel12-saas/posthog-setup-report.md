<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The integration covers the full user lifecycle — from first visit through registration, login, subscription checkout, plan changes, profile management, and account deletion. Server-side tracking is implemented throughout using the `posthog/posthog-php` SDK.

## What was added

**New files:**
- `config/posthog.php` — PostHog configuration (reads `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED` from environment)
- `app/Services/PostHogService.php` — Service wrapper providing `identify()`, `capture()`, and `captureException()` methods; initializes the SDK once per process

**Modified files:**
- `bootstrap/app.php` — Global exception reporting via `PostHog::captureException()` so all unhandled Laravel exceptions are automatically captured
- `app/Models/User.php` — Added `getPostHogProperties()` helper returning `email`, `name`, `date_joined`, and `provider` for person profiles
- `.env` — Added `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED`

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | New user completed email/password registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User authenticated via email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_signed_up_social` | New user created via OAuth provider (e.g. Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in_social` | Existing user authenticated via OAuth provider | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User explicitly logged out | `routes/auth.php` |
| `profile_updated` | User saved changes to their profile | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `account_deleted` | User permanently deleted their account | `resources/views/livewire/profile/delete-user-form.blade.php` |
| `pricing_page_viewed` | Visitor viewed the pricing page (top of conversion funnel) | `routes/web.php` |
| `subscription_checkout_started` | User initiated a Stripe checkout for a plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Subscriber changed their active plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User was redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |

## Next steps

The PostHog API key used by this integration did not have the `dashboard:write` and `query:read` scopes required to auto-create a dashboard. To build your analytics dashboard, visit [PostHog Dashboards](/dashboard) and create a new dashboard named **"Analytics basics"** with these five insights:

1. **Signup conversion funnel** — Funnel: `pricing_page_viewed` → `user_signed_up` or `user_signed_up_social`
2. **Subscription conversion funnel** — Funnel: `user_signed_up` → `subscription_checkout_started`
3. **New signups over time** — Trends: `user_signed_up` + `user_signed_up_social` (daily)
4. **Subscription activity** — Trends: `subscription_checkout_started` and `subscription_plan_swapped` (weekly)
5. **Churn signal** — Trends: `account_deleted` (weekly)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
