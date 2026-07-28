# PostHog setup report

PostHog server-side analytics was wired into the Laravel application with authenticated-user attribution, eight custom events, global exception reporting, and a starter dashboard; runtime event delivery remains unconfirmed.

## Installed and initialized

- `posthog/posthog-php` was declared in `composer.json` as `^4.12.1`.
- Installation did not complete: the existing Composer dependency graph requires PHP 8.4 through `symfony/clock`, while the environment has PHP 8.3.6. The package is absent from `composer.lock` and `vendor`.
- `config/posthog.php` reads `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED`.
- `app/Services/PostHogService.php` is registered as a Laravel singleton and is the sole SDK boundary. The real `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are present in the local `.env`; the names are documented in `.env.example`.
- No browser SDK or CSP change was needed; review found no Content-Security-Policy in the project.

## Events instrumented

These events are defined in `.posthog-wizard-cache/.posthog-events.json` and are called after the corresponding successful application actions. No event was observed arriving in PostHog during this run because the PHP SDK was not installed.

| Event | What it measures | Source file(s) |
|---|---|---|
| `user_logged_in` | Successful authentication, including authentication method | `resources/views/livewire/pages/auth/login.blade.php`; `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_signed_up` | Completed account registration, including signup method | `resources/views/livewire/pages/auth/register.blade.php`; `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | An authenticated user explicitly ending their session | `app/Livewire/Actions/Logout.php`; `routes/auth.php` |
| `email_verified` | An authenticated user verifying their email address | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `account_deleted` | Confirmed permanent account deletion | `resources/views/livewire/profile/delete-user-form.blade.php` |
| `subscription_checkout_started` | Starting a Stripe Checkout session for a selected plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_started` | Successful demo-mode subscription creation without Stripe | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | Successfully switching an active subscription to another plan | `app/Http/Controllers/SubscriptionController.php` |

A real Stripe Checkout completion event was not added: fulfillment is webhook-driven and no webhook handler was found.

## User identification

Identification is wired, not skipped. `PostHogService::identify()` uses the authenticated Eloquent user's primary-key authentication identifier as the stable `distinctId`; email and name are sent as person properties rather than event properties. Login, registration, and Socialite authentication flows identify immediately after successful authentication. Custom events likewise use the authenticated user's primary key. No client-side reset is required for this server-rendered application.

## Error tracking

`bootstrap/app.php` registers Laravel's exception report callback, which resolves the singleton `PostHogService` and forwards reported exceptions to `captureException()`. The service includes the authenticated user ID when available and retains non-PII request-method context. This wiring was reviewed, but actual exception delivery was not observed because the SDK is not installed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919782) contains four tagged insights: signup/login activity trends, signup-to-subscription funnel, checkout starts by `plan_id`, and account lifecycle events. The dashboard and its four tiles were created successfully in PostHog, but it is expected to remain empty until the application emits events.

## What the run verified vs. what remains unconfirmed

### Verified by the run

- The integration files and call sites were reviewed and kept behind the singleton `PostHogService`.
- `npm install` succeeded and `npm run build` completed successfully with Vite 6.3.2.
- The dashboard and four insights were created in PostHog.
- `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are present in the local environment.

### Not verified by the run

- No PHP build, Laravel test suite, or runtime analytics test was run.
- No event, identify call, or exception was observed arriving in PostHog.
- Composer installation remains unresolved, so the declared SDK cannot currently be relied on at runtime.
- The exact installed SDK API could not be checked; `captureException` is based on the declared `^4.12.1` package contract.

## Issues requiring follow-up

1. **Composer dependency conflict:** `posthog/posthog-php` is declared but not installed because the locked `larabug/larabug`/Carbon dependency graph resolves `symfony/clock v8.0.0`, which requires PHP >=8.4, while this environment runs PHP 8.3.6. Until the graph is corrected or Composer runs on PHP 8.4+, analytics and exception delivery cannot be runtime-verified.
2. **Stripe completion attribution:** no webhook handler was present, so successful real Stripe subscription fulfillment is not represented by a completion event. If a webhook is added, capture the completion there.

## Before you merge

- [ ] Run Composer in a PHP-compatible environment, update `composer.lock`, and confirm `posthog/posthog-php` is installed; inspect `composer.json:15` and the existing locked dependency graph.
- [ ] Run the full production build and fix any lint or type errors; the reviewed build only verified the Vite path (`package.json` scripts and generated `public/build/` assets).
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deploy environment, not only local `.env`; verify the names in `.env.example` and `config/posthog.php`.
- [ ] After installing the SDK, exercise login, signup, logout, verification, deletion, subscription, and an exception path, then confirm the corresponding events and person identification arrive in PostHog.
- [ ] If authentication is retained across returning sessions, verify the returning-visitor path still calls `identify()` in `resources/views/livewire/pages/auth/login.blade.php: identify call` and the equivalent registration/Socialite call sites.
