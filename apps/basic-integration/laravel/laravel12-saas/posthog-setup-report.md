<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The integration covers the full user lifecycle — from registration through subscription conversion — using the `posthog/posthog-php` SDK. A dedicated `PostHogService` class was created to wrap all PostHog calls, PostHog is initialized once in `AppServiceProvider`, and global exception capture was wired into `bootstrap/app.php` using Laravel 11+'s exception callback API. Distinct IDs use the authenticated user's database ID (`$user->id`) for consistent cross-session tracking.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user completed registration via the email/password form. | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | A user successfully authenticated via the login form. | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_out` | A user ended their session by logging out. | `routes/auth.php` |
| `social_login_completed` | A user authenticated or registered using a social provider (e.g. Google). | `app/Http/Controllers/Auth/SocialiteController.php` |
| `email_verified` | A user successfully verified their email address. | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `subscription_page_viewed` | A user viewed the subscription/pricing plans page. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_checkout_started` | A user initiated checkout for a subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | A subscribed user swapped to a different subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | A user was redirected to the Stripe billing portal to manage their subscription. | `app/Http/Controllers/SubscriptionController.php` |
| `profile_updated` | A user saved changes to their profile information (name or email). | `resources/views/livewire/profile/update-profile-information-form.blade.php` |

**New files created:**
- `config/posthog.php` — PostHog configuration (api_key, host, disabled, debug)
- `app/Services/PostHogService.php` — Service wrapper for identify, capture, captureException, isFeatureEnabled, getFeatureFlagPayload

**Files modified:**
- `app/Providers/AppServiceProvider.php` — PostHog::init() on boot
- `bootstrap/app.php` — Global exception reporting via PostHog::captureException()
- `routes/auth.php` — `user_logged_out` capture on the logout route
- `app/Http/Controllers/Auth/SocialiteController.php` — `social_login_completed` + identify
- `app/Http/Controllers/Auth/VerifyEmailController.php` — `email_verified` capture
- `app/Http/Controllers/SubscriptionController.php` — `subscription_page_viewed`, `subscription_checkout_started`, `subscription_plan_swapped`, `billing_portal_accessed`
- `resources/views/livewire/pages/auth/register.blade.php` — `user_signed_up` + identify
- `resources/views/livewire/pages/auth/login.blade.php` — `user_logged_in` + identify
- `resources/views/livewire/profile/update-profile-information-form.blade.php` — `profile_updated` + identify

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1813023)
- [New signups over time (wizard)](https://us.posthog.com/project/483112/insights/1SdNFJuv)
- [Subscription conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/nngziDOJ)
- [Daily active users (wizard)](https://us.posthog.com/project/483112/insights/QSbnIulU)
- [Signup methods breakdown (wizard)](https://us.posthog.com/project/483112/insights/J6ArTJoP)
- [Plan upgrade activity (wizard)](https://us.posthog.com/project/483112/insights/OagYgshC)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to `.env.example` and any onboarding scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current integration identifies on fresh login and signup, but a user who returns via an authenticated session cookie without logging in again will not be re-identified in the PHP backend. Consider calling `PostHogService::identify()` from a middleware or in the dashboard controller's `mount()` for such sessions.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
