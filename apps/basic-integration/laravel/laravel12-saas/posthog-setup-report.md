# PostHog setup report

PostHog server-side analytics was configured for this Laravel application, with authenticated event capture, user identification, global exception reporting, and a starter dashboard.

## What was set up

- **SDK/dependency:** `posthog/posthog-php` was added to `composer.json` at `^4.12.1`. Composer could not complete installation or update `composer.lock` during this run.
- **Initialization:** `config/posthog.php` reads `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED`. `app/Services/PostHogService.php` owns one-time SDK initialization plus `identify`, `capture`, and `captureException` wrappers. The real token and host were configured in the local `.env`; `.env.example` documents the variable names.
- **Identification:** Wired after successful password login, registration, and Socialite authentication. Distinct IDs use each authenticated user's stable primary-key identifier; email and name remain person properties rather than event properties. No browser SDK was added.

## Events instrumented

The event contract records these ten action-specific events. The run verified nine capture call sites corresponding to these entries; it did **not** observe events arriving in PostHog because the backend could not be installed or run.

| Event | What it measures | File |
|---|---|---|
| `user_registered` | New account created through the registration form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Existing user successfully signs in with password authentication | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_registered` | New account created through a social provider | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in` | Existing user successfully signs in through a social provider | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | Authenticated user explicitly ends the application session | `routes/auth.php` |
| `email_verified` | Authenticated user verifies their email for the first time | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `subscription_checkout_started` | Authenticated user starts hosted Stripe checkout for a selected plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | Authenticated user receives a subscription through the local demo fulfillment path when Stripe is not configured | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | Authenticated subscriber successfully changes plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_opened` | Authenticated subscriber opens the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |

Hosted Stripe checkout completion is not instrumented because no Stripe webhook endpoint exists. `subscription_created` therefore does not represent confirmed hosted checkout completion.

## Error tracking

`bootstrap/app.php` registers Laravel's global exception report callback. It skips disabled or unconfigured PostHog, uses the shared `PostHogService`, and calls `captureException` with the authenticated stable user ID when available plus request URL and method context. The run verified the code edit, but did not run the application or observe an exception arrive in PostHog.

## Dashboard

The starter dashboard **Analytics basics (wizard)** was created in PostHog project 483112 with four insights: registrations by method, authentication activity, subscription lifecycle activity, and a registration-to-subscription funnel. It is configured to be empty-safe and ready to populate when events arrive.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1918872)

## What the run verified vs. what remains unconfirmed

### Verified by the run

- The integration files and event contract were created or updated at the boundaries described above.
- The review found the changes minimal and consistent with the Laravel reference pattern.
- `npm install` completed successfully.
- `npm run build` completed successfully with 54 transformed modules. This verifies the frontend production build only; it does not prove that backend PHP code compiles, boots, or sends events.
- The dashboard and four insight tiles were created in PostHog.

### Not verified by the run

- No backend boot, PHP typecheck, test suite, or live event-ingestion test was completed.
- No event or exception was observed arriving in PostHog.
- Composer does not contain the SDK in `composer.lock`, so the Laravel service cannot be executed until dependency resolution is fixed.

## Issues requiring follow-up

1. **Composer dependency conflict:** `composer require posthog/posthog-php` was attempted and reverted. The existing locked `larabug/larabug 3.4.0` dependency leads to `symfony/clock v8.0.0`, which requires PHP >=8.4, while the runtime is PHP 8.3.6. `composer.json` declares `posthog/posthog-php: ^4.12.1`, but `composer.lock` does not. Leaving this unresolved prevents backend installation, boot, runtime verification, and event delivery.
2. **Hosted checkout attribution gap:** No Stripe webhook endpoint exists, so the integration cannot confirm a completed hosted checkout. Leaving this unresolved means the dashboard cannot measure Stripe checkout completion from the current event contract.

## Before you merge

- [ ] Resolve the Composer/PHP conflict and install `posthog/posthog-php` into `composer.lock`; inspect `composer.json` and the locked `larabug`/Symfony dependencies.
- [ ] Run the full production build and fix any lint or type errors introduced by the integration; the run only verified `npm run build`.
- [ ] Run the test suite; authentication, billing, verification, logout, and exception call sites may need updated mocks or fixtures.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` are set appropriately in every deploy environment, not only local `.env`; compare deployment configuration with `.env.example`.
- [ ] Exercise login, registration, Socialite auth, logout, verification, and billing paths and confirm the corresponding events arrive in the dashboard; event delivery was not observed during this run.
- [ ] Confirm the returning authenticated-user path still reaches `identify` in `resources/views/livewire/pages/auth/login.blade.php:25`, `resources/views/livewire/pages/auth/register.blade.php:37`, and `app/Http/Controllers/Auth/SocialiteController.php:47` so sessions do not fragment across anonymous IDs.
