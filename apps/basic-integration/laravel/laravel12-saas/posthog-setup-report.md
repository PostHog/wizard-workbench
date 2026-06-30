<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The integration covers all key business events across user authentication (email/password and Google OAuth), subscription management, profile management, and session tracking. A dedicated `PostHogService` class wraps the PHP SDK and is injected via Laravel's service container wherever events are captured.

## Files created or modified

| File | Change |
|------|--------|
| `config/posthog.php` | New config file reading `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` from environment |
| `app/Services/PostHogService.php` | New service class wrapping `PostHog::init`, `identify`, `capture`, and `captureException` |
| `app/Models/User.php` | Added `getPostHogProperties()` helper returning email, name, email_verified, and date_joined |
| `.env` | Added `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED` |
| `composer.json` | Added `posthog/posthog-php ^4.8` |

## Events instrumented

| Event name | Description | File |
|------------|-------------|------|
| `user_signed_up` | Fired when a new user completes registration via the email/password form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Fired when an existing user authenticates with email and password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_signed_up_with_google` | Fired when a new user account is created via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in_with_google` | Fired when an existing user authenticates via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | Fired when a user explicitly logs out of the application | `routes/auth.php` |
| `email_verified` | Fired when a user successfully verifies their email address | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `subscription_checkout_started` | Fired when a user initiates checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Fired when a user successfully changes their active subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `dashboard_viewed` | Fired when an authenticated user loads the main dashboard | `app/Livewire/Dashboard.php` |
| `profile_updated` | Fired when a user saves changes to their profile name or email | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `account_deleted` | Fired just before a user permanently deletes their account | `resources/views/livewire/profile/delete-user-form.blade.php` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1777421)
  - Subscription conversion funnel (user_signed_up → subscription_checkout_started → subscription_plan_swapped)
  - New user signups over time
  - User logins over time
  - Account deletions (churn signal)
  - Dashboard views over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to `.env.example` and any CI/CD environment configuration so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on login and signup, but returning users who skip the login page (e.g. via a persistent session) will not be re-identified until their next explicit login.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
