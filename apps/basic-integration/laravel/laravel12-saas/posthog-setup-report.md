# PostHog setup report

PostHog server-side analytics was configured for this Laravel application, with authenticated-user identification, ten explicit event captures, centralized exception tracking, and a starter dashboard.

## What was installed and initialized

- `posthog/posthog-php` was declared in `composer.json` at `^4.12.1`.
- `config/posthog.php` reads `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` from the environment.
- `App\Services\PostHogService` initializes the PHP SDK once, guards missing configuration, binds request context, identifies authenticated users by their primary-key identifier, and exposes the shared `capture()` and `captureException()` methods.
- `bootstrap/app.php` registers the service as global middleware and reports uncaught exceptions through it.
- `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are present in the local `.env`; the names and documented placeholders are in `.env.example`.
- No browser SDK or CSP changes were added. This is a Laravel server-side integration.

## Events instrumented

These events are present at the recorded action points. The run did not observe any event arriving in PostHog, so these are **instrumented**, not confirmed-captured events.

| Event | What it measures | Instrumented in |
|---|---|---|
| `user_logged_in` | An account signs in with password or social authentication. | `resources/views/livewire/pages/auth/login.blade.php`, `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_registered` | A new account completes password or social registration. | `resources/views/livewire/pages/auth/register.blade.php`, `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | An authenticated account signs out. | `routes/auth.php` |
| `email_verified` | An account verifies its email address. | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `profile_updated` | An authenticated account saves profile changes. | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `password_updated` | An authenticated account changes its password. | `resources/views/livewire/profile/update-password-form.blade.php` |
| `account_deleted` | An authenticated account permanently deletes itself. | `resources/views/livewire/profile/delete-user-form.blade.php` |
| `subscription_checkout_started` | An account starts checkout for a selected subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_started` | A demo subscription is created when Stripe is not configured. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | An account successfully changes its subscription plan. | `app/Http/Controllers/SubscriptionController.php` |

`subscription_started` currently describes the Stripe-unconfigured demo path. A live Stripe checkout lifecycle would need webhook-side instrumentation if introduced later.

## Identification and attribution

User identification is wired, not skipped. Successful password login, registration, and Socialite authentication call `identifyUser()`; global middleware also binds authenticated requests to the user's stable auth identifier. The review added an explicit authenticated `auth()->id()` distinct ID in `app/Services/PostHogService.php` so events fired immediately after authentication are attributed correctly. Email and name are person properties, not event distinct IDs.

## Error tracking

`bootstrap/app.php` registers a global Laravel exception report callback. It resolves `App\Services\PostHogService` and sends reported exceptions through `captureException()`, using the authenticated numeric user ID when available and `null` otherwise. No runtime error event was observed during this run.

## Dashboard

The dashboard `Analytics basics (wizard)` was created with four saved tiles: Authentication activity, Subscription lifecycle, Account engagement actions, and Registration to subscription funnel. The definitions use the exact event names above over a 30-day range and are valid before ingestion. [Open the dashboard](https://us.posthog.com/project/483112/dashboard/1926615)

## What the run verified

- The event manifest and repository searches show all ten planned event contracts and their intended capture call sites.
- Frontend dependencies installed successfully, and `npm run build` passed twice.
- The dashboard and four insights were created successfully in PostHog; PostHog returned dashboard ID `1926615` and confirmed the tiles were saved.
- Configuration files, service wiring, identification paths, and exception reporting were reviewed.

## What the run did not verify

- No event delivery was observed in PostHog.
- The PHP SDK was not installed into `vendor`, so Laravel runtime checks, PHP lint, and application tests could not run.
- The dashboard contains definitions, but its data cannot be treated as populated from this run.

## Build conflict

Composer could not install or update `posthog/posthog-php`. The existing locked dependency path through `larabug/larabug` permits Carbon `3.11.0`, which selected `symfony/clock v8.0.0`; that package requires PHP `>=8.4`, while the environment reports PHP `8.3.6`. Composer reverted its attempted changes, and `composer.lock` remains unupdated. The package declaration was retained manually in `composer.json` at `^4.12.1`. Resolve the PHP/Symfony or existing dependency constraint, then run Composer before relying on Laravel runtime behavior.

## Next steps

1. Resolve the Composer PHP 8.3 versus `symfony/clock` PHP 8.4 conflict and install the declared SDK.
2. Run the Laravel test suite and PHP checks after dependencies are available.
3. Exercise login, registration, logout, verification, profile/password changes, account deletion, and subscription paths in a configured environment; confirm the ten event names arrive in PostHog and review their attribution.
4. Confirm exception reports appear in PostHog Error Tracking.
5. Check the dashboard after events arrive; its current tiles are definitions, not run-verified results.

## Before you merge

- [ ] Resolve the dependency conflict described above, install `posthog/posthog-php`, and run PHP checks against `app/Services/PostHogService.php` and `bootstrap/app.php`.
- [ ] Run the full production build and fix any lint or type errors introduced by the integration; the run verified Vite only, via the generated frontend build.
- [ ] Run the test suite, including callers and mocks covering the instrumented actions in `routes/auth.php`, `app/Http/Controllers/Auth/`, `app/Http/Controllers/SubscriptionController.php`, and the Livewire profile/auth views.
- [ ] Set `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and the intended `POSTHOG_DISABLED` value in every deploy environment, not only local `.env`; verify the names in `.env.example` and `config/posthog.php`.
- [ ] Exercise an authenticated returning-user path and confirm it calls identification in `app/Services/PostHogService.php` and the auth success paths in `resources/views/livewire/pages/auth/login.blade.php`, `resources/views/livewire/pages/auth/register.blade.php`, and `app/Http/Controllers/Auth/SocialiteController.php`.
- [ ] Trigger each instrumented action and verify event delivery and stable attribution in PostHog; no event flow was observed during this run.
