# PostHog setup report

PostHog server-side analytics was added to the Laravel application through an environment-backed PHP SDK service, authenticated-user identification, product-event capture, exception reporting, and a starter dashboard.

## What was installed and initialized

- `posthog/posthog-php` `^4.12.1` was added to `composer.json`.
- Composer installation and lockfile generation were not completed: the existing `larabug/larabug` dependency graph resolves Carbon/Symfony packages requiring PHP 8.4, while this run used PHP 8.3.6.
- `config/posthog.php` reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- `App\Services\PostHogService` initializes the static PHP SDK once, guards all calls until initialization succeeds, and centralizes identify, capture, and exception capture.
- The real token and host were configured in `.env` through the wizard environment tools; `.env.example` documents both variable names.
- This is a server-rendered Laravel/Livewire integration; no browser SDK or CSP changes were added.

## Events instrumented

| Event | What it measures | File(s) |
|---|---|---|
| `user_logged_in` | Successful password or social authentication, segmented by login method. | `resources/views/livewire/pages/auth/login.blade.php`; `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_signed_up` | New account creation, segmented by registration method. | `resources/views/livewire/pages/auth/register.blade.php`; `app/Http/Controllers/Auth/SocialiteController.php` |
| `email_verified` | Completion of email verification for an authenticated account. | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `profile_updated` | Authenticated profile information update, including whether email changed. | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `password_updated` | Authenticated account password update. | `resources/views/livewire/profile/update-password-form.blade.php` |
| `account_deleted` | Confirmed deletion of an authenticated account. | `resources/views/livewire/profile/delete-user-form.blade.php` |
| `user_logged_out` | Authenticated user logout. | `app/Livewire/Actions/Logout.php`; `routes/auth.php` |
| `subscription_checkout_started` | Initiation of checkout for a selected plan, segmented by checkout mode. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_started` | Successful demo-mode subscription creation. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | Successful change to an active subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_opened` | Attempt to open the Stripe billing-management portal. | `app/Http/Controllers/SubscriptionController.php` |

The run verified event call sites by read-based review and confirmed stable authenticated database identifiers are used. It did **not** observe events arriving in PostHog, because no application startup or traffic verification was run. In particular, `subscription_checkout_started` is not proof of completed Stripe payment, and `billing_portal_opened` represents an attempt before redirect/fallback.

## User identification

Identification was wired on successful password login, registration, and Socialite login using `(string) $user->getAuthIdentifier()` as the stable distinct ID. Email and name are sent only as person properties through `getPostHogProperties()`, not as event properties. Profile updates re-identify to refresh those person properties. Exception reporting also uses the authenticated numeric ID when available. No browser reset was needed because identity is request-scoped on the server.

## Error tracking

Laravel 12's global exception report callback in `bootstrap/app.php` sends reported `Throwable` instances through `PostHogService::captureException()`, including the current URL and request method and the authenticated user ID when available. Wiring was confirmed by source review; runtime delivery was not observed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924669) was created in PostHog project 483112 with five tiles: signup-to-subscription funnel, authentication activity, subscription lifecycle by plan, account maintenance activity, and billing engagement. The dashboard and insights were created successfully, but the run did not verify that populated event data appears in the tiles.

## Unresolved issues and their cost

1. **Composer dependency resolution remains unresolved.** `composer update posthog/posthog-php --with-all-dependencies` exited 2 and `composer install` exited 4 because locked `larabug/larabug` 3.4.0 leads to Carbon 3.11.0 and Symfony packages requiring PHP >=8.4, while the runtime is PHP 8.3.6. Until this is resolved in PHP 8.4+ or by adjusting the dependency graph, `composer.lock` does not contain `posthog/posthog-php` and the application cannot be confirmed runnable with the integration.
2. **Production subscription completion is not attributed.** The instrumentation records checkout initiation and demo subscription creation, but a real Stripe completion event from a verified webhook was not added. Without a webhook-based completion signal, subscription analytics can overstate intent and miss successful payment outcomes.

## What the run verified vs. did not verify

Verified: environment-backed configuration, one-time SDK initialization guards, stable-ID identify/capture call sites, exception-reporting wiring, the event plan, and successful creation of the dashboard and five insights. Not verified: Composer installation, a build, tests, lint/type checks, application startup, SDK delivery, event arrival, exception arrival, or populated dashboard results. No build/typecheck/lint scripts are defined in `composer.json`.

## Before you merge

- [ ] Resolve the PHP 8.3 / `larabug` Carbon/Symfony conflict in `composer.json`/`composer.lock`, then install `posthog/posthog-php` in a PHP 8.4+ compatible environment and run the application's dependency checks.
- [ ] Run a full production build or deployment validation and fix any errors introduced by the generated integration; the run only performed source review.
- [ ] Run the test suite, especially authentication, profile, logout, subscription, and exception-reporting tests; instrumentation call sites may need updated mocks or fixtures.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only local `.env`; the exact names are documented in `.env.example`.
- [ ] Trigger representative authenticated flows and confirm the expected events and exception data arrive in PostHog; this run observed no runtime traffic.
- [ ] Add and verify a Stripe webhook completion event before treating checkout activity as completed subscriptions; review `app/Http/Controllers/SubscriptionController.php` and the future webhook handler.
