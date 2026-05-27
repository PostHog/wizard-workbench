<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS project. The integration covers the full user lifecycle: registration, login (email/password and OAuth), logout, subscription checkout, plan upgrades/downgrades, and billing portal access. A dedicated `PostHogService` class centralises all SDK calls, PostHog is initialised once in `AppServiceProvider`, a request-context middleware correlates client- and server-side events via PostHog headers, and automatic exception reporting is wired into Laravel's bootstrap error handler.

## Files changed

| File | Change |
|------|--------|
| `composer.json` / `composer.lock` | Added `posthog/posthog-php ^4.4` |
| `config/posthog.php` | New — PostHog config (api_key, host, disabled, debug) |
| `app/Services/PostHogService.php` | New — identify, capture, captureException, isFeatureEnabled, getFeatureFlagPayload wrappers |
| `app/Http/Middleware/PostHogRequestContext.php` | New — sets request context from `X-PostHog-Distinct-Id` / `X-PostHog-Session-Id` headers |
| `app/Providers/AppServiceProvider.php` | Added `PostHog::init()` on boot |
| `bootstrap/app.php` | Registered `PostHogRequestContext` as web middleware; added `PostHog::captureException` in global exception reporter |
| `resources/views/livewire/pages/auth/register.blade.php` | identify + `user_signed_up` capture on registration |
| `app/Livewire/Forms/LoginForm.php` | identify + `user_logged_in` capture on password login |
| `app/Http/Controllers/Auth/SocialiteController.php` | identify + `user_logged_in_via_social` / `user_registered_via_social` capture on OAuth callback |
| `app/Livewire/Actions/Logout.php` | `user_logged_out` capture before session invalidation |
| `app/Http/Controllers/SubscriptionController.php` | `subscription_page_viewed`, `subscription_checkout_started`, `subscription_created`, `subscription_plan_swapped` captures; captureException on swap failure |
| `app/Actions/Billing/RedirectToBillingPortal.php` | `billing_portal_accessed` capture |
| `.env` | Added `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED` |

## Events

| Event name | Description | File |
|-----------|-------------|------|
| `user_signed_up` | New user completes email/password registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User successfully authenticates with email and password | `app/Livewire/Forms/LoginForm.php` |
| `user_logged_in_via_social` | Existing user authenticates via OAuth provider | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_registered_via_social` | Brand-new account created via OAuth provider | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logs out of the application | `app/Livewire/Actions/Logout.php` |
| `subscription_page_viewed` | User views the subscription/pricing page | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_checkout_started` | User initiates a Stripe checkout session | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | Subscription is successfully created | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Subscriber upgrades or downgrades their plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | Subscriber is redirected to the Stripe billing portal | `app/Actions/Billing/RedirectToBillingPortal.php` |

## Next steps

Create a dashboard named **"Analytics basics"** in PostHog with the following five insights:

1. **Signups over time** — Trends: `user_signed_up` daily, last 30 days.
2. **Signup method breakdown** — Trends: `user_signed_up` + `user_registered_via_social`, broken down by signup_method / provider property.
3. **Subscription conversion funnel** — Funnel: `subscription_page_viewed` → `subscription_checkout_started` → `subscription_created`, 14-day conversion window.
4. **Plan changes** — Trends: `subscription_plan_swapped` daily, broken down by plan_name property.
5. **Billing portal & churn signal** — Trends: `billing_portal_accessed` daily (users accessing billing portal often precede cancellations).

You can create these at [/insights](/insights) and assemble them into a dashboard at [/dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
