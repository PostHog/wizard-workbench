<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The integration installs the `posthog/posthog-php` SDK (v4.9.0) and instruments all critical user lifecycle and subscription events via a dedicated `PostHogService` class. Users are identified by email on login and registration, correlating server-side events with person profiles in PostHog.

**Files created:**
- `config/posthog.php` — PostHog configuration (reads from environment variables)
- `app/Services/PostHogService.php` — Service wrapper with `identify`, `capture`, `captureException`, `isFeatureEnabled`, and `getFeatureFlagPayload` methods
- `.env` updated with `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED`

**Files modified:**
- `app/Models/User.php` — Added `getPostHogProperties()` helper
- `resources/views/livewire/pages/auth/login.blade.php` — Tracks `user_logged_in` and calls `identify` on success
- `resources/views/livewire/pages/auth/register.blade.php` — Tracks `user_signed_up` and calls `identify` on success
- `resources/views/livewire/pages/auth/verify-email.blade.php` — Tracks `email_verification_sent`
- `app/Http/Controllers/Auth/SocialiteController.php` — Tracks `user_logged_in_social` (with `is_new_user` flag) and calls `identify`
- `routes/auth.php` — Tracks `user_logged_out`
- `app/Http/Controllers/SubscriptionController.php` — Tracks `subscription_checkout_started`, `subscription_created`, `subscription_plan_changed`
- `app/Actions/Billing/RedirectToBillingPortal.php` — Tracks `billing_portal_accessed`
- `app/Http/Controllers/Auth/VerifyEmailController.php` — Tracks `email_verified`

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user completes registration via the signup form. | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | A user successfully logs in with email/password. | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in_social` | A user successfully logs in or registers via a social provider (e.g., Google). | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | A user logs out of the application. | `routes/auth.php` |
| `subscription_checkout_started` | A user initiates checkout for a subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | A subscription is created for a user (including demo mode). | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | A user swaps their active subscription to a different plan. | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | A user is redirected to the Stripe billing portal. | `app/Actions/Billing/RedirectToBillingPortal.php` |
| `email_verification_sent` | A user requests a new email verification link. | `resources/views/livewire/pages/auth/verify-email.blade.php` |
| `email_verified` | A user verifies their email address by clicking the verification link. | `app/Http/Controllers/Auth/VerifyEmailController.php` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824518)
- **Insight**: [Signup to subscription funnel](https://us.posthog.com/project/483112/insights/q7YmurYa)
- **Insight**: [New signups over time](https://us.posthog.com/project/483112/insights/A7kJnXYN)
- **Insight**: [Signups by method](https://us.posthog.com/project/483112/insights/L38ptTVt)
- **Insight**: [Subscription events breakdown](https://us.posthog.com/project/483112/insights/hrzkKd6k)
- **Insight**: [Active users retention](https://us.posthog.com/project/483112/insights/Hd3mtz8n)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`) to `.env.example` and any onboarding scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. (The wizard added `identify` on the login and register forms, but verify any other entry points like API tokens or impersonation flows.)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
