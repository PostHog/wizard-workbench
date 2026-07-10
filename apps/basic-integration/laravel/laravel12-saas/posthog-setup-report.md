# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The `posthog/posthog-php` SDK was installed via Composer, a dedicated `PostHogService` class was created to wrap the SDK, and 12 business-critical events were instrumented across authentication, subscription, and profile flows. All PostHog keys are read from environment variables — nothing is hardcoded. Global exception capture was wired into `bootstrap/app.php` so unhandled errors are automatically sent to PostHog.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user completes registration with email and password. | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_signed_up_with_google` | Fired when a brand-new user registers via Google OAuth for the first time. | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in` | Fired when an existing user successfully authenticates with email and password. | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in_with_google` | Fired when an existing user authenticates via Google OAuth. | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | Fired when a user logs out of the application. | `routes/auth.php` |
| `subscription_checkout_started` | Fired when a user initiates the checkout process for a subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `plan_changed` | Fired when an already-subscribed user swaps from one plan to another. | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_opened` | Fired when a user is redirected to the Stripe billing portal. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_page_viewed` | Fired when an authenticated user views the subscription plans page. | `app/Http/Controllers/SubscriptionController.php` |
| `profile_updated` | Fired when a user saves changes to their profile name or email. | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `account_deleted` | Fired just before a user permanently deletes their account. | `resources/views/livewire/profile/delete-user-form.blade.php` |
| `password_reset_requested` | Fired when a user successfully submits the forgot-password form. | `resources/views/livewire/pages/auth/forgot-password.blade.php` |

## Files created

- `config/posthog.php` — PostHog configuration (reads `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED` from env)
- `app/Services/PostHogService.php` — Service class wrapping the PHP SDK with `identify()`, `capture()`, `captureException()`, `isFeatureEnabled()`, and `getFeatureFlagPayload()` methods
- `.env` updated with `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED`

## Files modified

- `app/Models/User.php` — Added `getPostHogProperties()` helper returning `name`, `email`, and `date_joined`
- `app/Providers/AppServiceProvider.php` — Registered `PostHogService` as a singleton and eagerly initializes it on boot
- `bootstrap/app.php` — Added global exception reporting via `PostHogService::captureException()`

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1829244)
- **Signup to subscription funnel**: [View insight](https://us.posthog.com/project/483112/insights/vQqOzlTF) — Tracks conversion from `user_signed_up` → `subscription_page_viewed` → `subscription_checkout_started` over a 14-day window
- **New signups over time**: [View insight](https://us.posthog.com/project/483112/insights/SFJuA7Nr) — Daily bar chart comparing email vs Google signups
- **Account deletions (churn)**: [View insight](https://us.posthog.com/project/483112/insights/4AGGx3jB) — Weekly line chart of `account_deleted` events over 90 days
- **Plan change rate**: [View insight](https://us.posthog.com/project/483112/insights/gr5uw99e) — Weekly trend of `plan_changed` and `billing_portal_opened`
- **Active logins by method**: [View insight](https://us.posthog.com/project/483112/insights/higE1QsD) — Daily stacked bar of unique active users by login method

Dashboard subscriptions and alerts were not set up automatically (the interactive prompt was unavailable in this environment). To set them up manually, visit the dashboard and use the **Share** menu to add a recurring email digest, and the **Alerts** tab on the funnel and churn insights to configure threshold notifications.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`) to `.env.example` and any CI/deployment bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on login and signup; a user who returns with an active session will not re-identify until they log out and back in.
- [ ] Check that the `posthog/posthog-php` package installed correctly with `--ignore-platform-reqs` (PHP 8.3 was in use; the flag was needed due to a transitive dependency requiring 8.4). Verify behavior is correct in your target deployment environment.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
