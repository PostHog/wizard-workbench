# PostHog setup report

Server-side PostHog analytics was configured for Laravel with shared initialization, authenticated-user identification, product-event capture, exception reporting, and a starter dashboard.

## What was set up

- **SDK declaration:** `posthog/posthog-php` was added to `composer.json` with the approved `^4.12.1` constraint. It was not installed into `composer.lock` or `vendor` because Composer dependency resolution is blocked; see [Build status](#build-status).
- **Initialization:** `config/posthog.php` reads `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED`. `app/Providers/AppServiceProvider.php` initializes the shared `App\Services\PostHogService` once when configured. The real token and host are present in the local `.env`; `.env.example` documents the variable names.
- **Event delivery:** Capture calls use authenticated Eloquent primary keys as stable distinct IDs and avoid PII in event properties. No request-scoped identity middleware was added.
- **Identification:** `PostHogService::identifyUser(User $user)` uses the Eloquent primary key as the distinct ID and sends email and name as person properties. Identification is wired after password login, registration, and Socialite login.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_registered` | A new account is successfully created with the registration form. | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | An existing account successfully authenticates by password or supported social provider, recording the authentication method. | `resources/views/livewire/pages/auth/login.blade.php`; `app/Http/Controllers/Auth/SocialiteController.php` |
| `email_verified` | An authenticated user verifies their email address. | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `subscription_checkout_started` | An authenticated user starts checkout for a selected subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_started` | A demo subscription is created when checkout runs without Stripe configuration. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | An active subscription is successfully changed to a different plan. | `app/Http/Controllers/SubscriptionController.php` |
| `user_logged_out` | An authenticated user explicitly logs out. | `app/Livewire/Actions/Logout.php` |
| `account_deleted` | An authenticated user confirms permanent account deletion. | `resources/views/livewire/profile/delete-user-form.blade.php` |

These events were verified in the event plan and by repository review of the capture call sites. The run did **not** observe events arriving in PostHog, because the PHP SDK was not installed and no runtime event-flow test was performed. Production Stripe subscription completion is asynchronous and has no webhook handler in this project, so only checkout initiation is captured for that path.

## Error tracking

`bootstrap/app.php` registers Laravel's global `Exceptions::report` callback. It guards capture on PostHog configuration and calls `PostHog::captureException` once per reported exception with the authenticated ID and request context. This wiring was reviewed, but runtime exception delivery was not confirmed because the PHP dependency could not be installed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1901833)

The dashboard contains five insights for the last 30 days: registration trend, login methods by `auth_method`, signup-to-checkout funnel, subscription starts by `plan_id`, and plan changes over time by `plan_id`. It may initially be empty until events arrive; the run did not verify ingestion.

## Build status

The frontend dependency installation (`npm install`) and production Vite build (`npm run build`) succeeded. The PHP SDK could not be installed: `composer require posthog/posthog-php` was reverted because the existing locked `larabug/larabug 3.4.0` dependency requires Carbon/Symfony versions that resolved to `symfony/clock v8.0.0`, which requires PHP >=8.4, while the runtime is PHP 8.3.6. A later `composer install` also exited 4 because `posthog/posthog-php` is absent from `composer.lock`. Consequently, PHP runtime and Laravel static verification remain unconfirmed. This is an unresolved dependency conflict, not evidence that the PostHog code is invalid.

## Unresolved issue to follow up

- **PHP SDK availability:** `posthog/posthog-php` is declared in `composer.json` but absent from `composer.lock` and `vendor` because of the existing `larabug`/Carbon/Symfony/PHP 8.3.6 conflict. If left unresolved, the Laravel PostHog initialization, captures, identification, and exception reporting cannot run in the deployed application.
- **Runtime ingestion:** No run step observed events or exceptions arriving in PostHog. If left untested, the dashboard and event contract can exist while production delivery is still broken.

## Next steps

1. Resolve the existing Composer dependency graph under a supported PHP/dependency combination, then run Composer so `posthog/posthog-php` is present in `composer.lock` and `vendor`.
2. Run Laravel tests and PHP/static checks after dependency installation.
3. Exercise registration, password/social login, email verification, checkout, subscription changes, logout, account deletion, and an exception in a safe environment; confirm the corresponding events and error issue arrive in PostHog.
4. Confirm `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` are correctly configured in every deployment environment, not only local `.env`.
5. Confirm the dashboard populates with the expected event volume and breakdowns.

## Before you merge

- [ ] Resolve the Composer conflict and verify `posthog/posthog-php` is installed in `composer.lock`/`vendor`; inspect `composer.json` and the dependency versions involving `larabug/larabug`, Carbon, Symfony Clock, and PHP 8.3.6.
- [ ] Run the full production build and fix any lint, type, or PHP errors introduced by the integration; inspect the instrumented files and `bootstrap/app.php`.
- [ ] Run the test suite and update mocks or fixtures for capture, identify, and exception-reporting paths; inspect the relevant test files alongside each instrumented call site.
- [ ] Set `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` in deployment environments, not just `.env`; inspect `.env.example` and `config/posthog.php`.
- [ ] Exercise authenticated flows and confirm events and exceptions arrive in PostHog; inspect the capture calls in the files listed in the event table and the reporting callback in `bootstrap/app.php`.
- [ ] Confirm returning authenticated sessions identify consistently; inspect the identify calls in `resources/views/livewire/pages/auth/login.blade.php`, `resources/views/livewire/pages/auth/register.blade.php`, and `app/Http/Controllers/Auth/SocialiteController.php`.
