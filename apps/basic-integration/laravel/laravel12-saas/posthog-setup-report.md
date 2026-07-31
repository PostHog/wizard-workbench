# PostHog setup report

PostHog server-side analytics was configured for this Laravel application, with authenticated event capture, user identification, global exception reporting, and a starter dashboard.

## What was set up

- **SDK declaration:** `posthog/posthog-php:^4.12.1` was added to `composer.json`.
- **Initialization:** `config/posthog.php` reads `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED`; `app/Services/PostHogService.php` initializes the PHP SDK once and provides the shared `identify`, `identifyUser`, `capture`, and exception-capture paths. The environment variable names are documented in `.env.example` and were configured in the project `.env` during the run.
- **Server-side capture:** Events are sent through `PostHogService`; no browser SDK or CSP changes were needed because this is a server-rendered application.

The run did **not** observe events arriving in PostHog. The dashboard and event plan describe the intended instrumentation, but a passing frontend build does not prove event delivery.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_signed_up` | A new account is successfully created and authenticated. | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | An existing user successfully signs in with a password. | `resources/views/livewire/pages/auth/login.blade.php` |
| `social_login_completed` | A user successfully signs in through a social identity provider. | `app/Http/Controllers/Auth/SocialiteController.php` |
| `email_verified` | An authenticated user verifies their email address. | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `subscription_checkout_started` | An authenticated user starts checkout for a selected subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | A demo subscription is created when Stripe checkout is unavailable. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | An authenticated subscriber successfully changes plans. | `app/Http/Controllers/SubscriptionController.php` |
| `profile_updated` | An authenticated user successfully updates profile information. | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `password_updated` | An authenticated user successfully changes their password. | `resources/views/livewire/profile/update-password-form.blade.php` |
| `account_deleted` | An authenticated user successfully deletes their account. | `resources/views/livewire/profile/delete-user-form.blade.php` |
| `password_reset_completed` | A user successfully completes a password reset. | `resources/views/livewire/pages/auth/reset-password.blade.php` |
| `user_logged_out` | An authenticated user logs out of the application. | `app/Livewire/Actions/Logout.php` |

Capture properties were recorded as non-PII context. Authenticated captures use the user model's persisted primary-key identifier rather than an email address.

## User identification

Identification **was wired**. `PostHogService::identifyUser()` uses the authenticated model's primary key as the stable distinct ID and sends email and name as person properties. It is called after successful password login, registration, and Socialite authentication. The returning-visitor path is not separately instrumented beyond these successful authentication transitions; verify the relevant authenticated-session behavior before merging.

## Error tracking

Laravel's global reportable exception callback in `bootstrap/app.php` routes `Throwable` instances to `PostHogService::captureException()`. Reported exceptions use the authenticated stable user ID when available and anonymous otherwise. The SDK dependency could not be installed into the lockfile in this run, so runtime exception delivery remains unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935644)

The dashboard contains four insight tiles covering account signups and logins, the signup-to-subscription funnel, subscription starts by plan, and account churn signals. The dashboard was created successfully, but its data may currently be empty and no incoming event was observed during this run.

## Build and dependency status

The frontend dependency install and production build passed: `npm install` completed, and `npm run build` completed with Vite reporting 54 transformed modules and successful output. No Laravel build, lint, test suite, or live application event-flow test was run.

Composer installation was blocked by an existing dependency conflict. The attempted `composer require posthog/posthog-php` was reverted because locked `larabug/larabug 3.4.0` resolves `nesbot/carbon 3.11.0`, which resolves `symfony/clock 8.0.0`; Symfony Clock 8.0.0 requires PHP `>=8.4`, while the available runtime is PHP `8.3.6`. Consequently, `composer.lock` was not updated and the SDK is declared in `composer.json` but is not installed in this environment. The review task did not retry Composer. NPM also reported dependency-audit vulnerabilities unrelated to this integration.

## Unresolved issues to follow up

- **SDK availability:** `composer.lock` does not contain the PostHog SDK because dependency resolution is blocked by the PHP 8.4 requirement above. Until the deployment environment resolves this conflict, the configured service and captures cannot be verified at runtime.
- **Event delivery:** No event arrival was observed. A deployed environment must exercise the instrumented paths and confirm the events appear in PostHog.
- **External payment completion:** The application captures Stripe checkout initiation, but successful production payment is external to this application and is not captured here. Subscription conversion analysis must account for that gap.

## Next steps

1. Resolve the PHP/dependency constraint (upgrade the Composer runtime to a compatible PHP version or otherwise reconcile the pre-existing `larabug/carbon` lock) and run Composer installation in the deployment environment.
2. Set `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` in each deployment environment, not only in local `.env`; confirm the names in `.env.example`.
3. Run the Laravel test suite and a full production build, then exercise signup, login, social login, verification, subscription, profile, password, deletion, reset, and logout flows.
4. Confirm the twelve event names arrive in PostHog with stable primary-key distinct IDs, and verify the dashboard tiles populate.
5. Decide how successful production Stripe payments should be represented, since that completion currently occurs outside this application.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; review the service initialization in `app/Services/PostHogService.php` (especially lines 1–70).
- [ ] Run the test suite and update mocks or fixtures for the instrumented action boundaries, including the login and registration captures around `resources/views/livewire/pages/auth/login.blade.php:24-29` and `resources/views/livewire/pages/auth/register.blade.php:36-41`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` are set in deployment environments and remain documented in `.env.example`.
- [ ] Resolve the Composer PHP 8.4 dependency conflict and verify `posthog/posthog-php` is installed from the lockfile before relying on runtime capture or exception tracking.
- [ ] Exercise an authenticated returning-session path and verify identification continues to use the stable user ID in `app/Services/PostHogService.php:47-53`.
- [ ] Trigger representative instrumented flows and confirm events arrive in PostHog; do not treat the passing frontend build as event-flow verification.
