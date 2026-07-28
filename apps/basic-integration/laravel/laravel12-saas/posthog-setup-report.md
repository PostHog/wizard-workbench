# PostHog setup report

PostHog server-side analytics, user identification, exception tracking, and a starter dashboard were added to the Laravel application.

## What was set up

- The PostHog PHP SDK was declared in `composer.json` as `posthog/posthog-php` `^4.12.1`.
- `config/posthog.php` reads `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` from the environment.
- `app/Services/PostHogService.php` provides the single lazy SDK initialization point plus guarded `identify`, `capture`, and `captureException` methods.
- The configured project token and host were present in the local `.env` during the run; `.env.example` documents the three PostHog variables.
- No browser SDK, CSP change, queue-job instrumentation, or worker flush logic was added.

## Events instrumented

These are the events recorded in `.posthog-wizard-cache/.posthog-events.json`. The run verified that capture calls exist at the listed action paths; it did **not** verify that any event arrived in PostHog.

| Event | What it measures | Instrumented file |
|---|---|---|
| `user_logged_in` | Successful password or social-provider sign-in | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_registered` | Completed account registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_out` | Authenticated user sign-out | `app/Livewire/Actions/Logout.php` |
| `subscription_checkout_started` | Start of subscription checkout for a plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_started` | Successful demo subscription creation | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | Successful plan change by an active subscriber | `app/Http/Controllers/SubscriptionController.php` |
| `profile_updated` | Saved profile changes | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `password_updated` | Successful password change | `resources/views/livewire/profile/update-password-form.blade.php` |
| `account_deleted` | Permanent account deletion | `resources/views/livewire/profile/delete-user-form.blade.php` |

`subscription_started` currently represents the application's demo/stub completion, not verified Stripe payment completion. Production billing should capture the event from a verified Stripe webhook.

## Identification

Identification was wired for successful password login, registration, and OAuth login in:

- `resources/views/livewire/pages/auth/login.blade.php`
- `resources/views/livewire/pages/auth/register.blade.php`
- `app/Http/Controllers/Auth/SocialiteController.php`

Each uses the authenticated user's primary key from `getAuthIdentifier()` as the stable distinct ID. Email and name are sent as person properties rather than event properties. The run did not observe identity or event delivery in PostHog. No browser identify/reset flow exists because this project has no browser PostHog SDK.

## Error tracking

A global Laravel `reportable` handler in `bootstrap/app.php` calls `PostHogService::captureException()` for uncaught exceptions. Known authenticated users use `auth()->id()`; otherwise the handler uses `anonymous`. The run verified the handler and wrapper in source, but did not observe an exception arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918283)

The dashboard contains four attached insights covering signup-to-subscription conversion, authentication activity, subscription lifecycle, and account-management activity. It is defined over the intended events even if current data is empty.

## Verified by this run

- Source review found the planned capture and identify call sites and found no integration fixes necessary.
- `npm install` completed successfully.
- `npm run build` completed successfully with Vite 6.3.2.
- The local environment check found `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` present.
- The dashboard and four attached insight tiles were created in PostHog.

A successful frontend build proves only that the frontend assets compile. It does not prove that the PHP SDK loads or that events flow to PostHog.

## Unresolved issues and their cost

1. **Composer dependency installation is blocked.** `composer install` exited with code 4 because `composer.lock` does not contain the declared `posthog/posthog-php`, and regenerating the lock is blocked by the existing dependency graph: `larabug/larabug 3.4.0` leads through `nesbot/carbon 3.11.0` to `symfony/clock v8.0.0`, which requires PHP `>=8.4`, while the run environment has PHP `8.3.6`. Until this is resolved under a compatible PHP/dependency environment, the PHP SDK is unavailable and server-side initialization, captures, identification, and exception delivery cannot be exercised.
2. **Production subscription attribution is incomplete.** `subscription_started` is emitted only for the application's demo/stub completion in `app/Http/Controllers/SubscriptionController.php`; leaving it unchanged would make the dashboard report demo completion rather than verified Stripe subscription completion.

## Before you merge

- [ ] Resolve the PHP 8.3 / Symfony Clock 8 conflict, regenerate `composer.lock`, and run `composer install`; inspect `composer.json` and the resulting lockfile before relying on `app/Services/PostHogService.php` (dependency declaration at `composer.json:21`).
- [ ] Run the full production build and fix any lint or type errors introduced by the integration; the run verified only `npm run build`, and `package.json` has no lint or typecheck script.
- [ ] Run the test suite; instrumented authentication, billing, profile, password, logout, and deletion paths may need updated mocks or fixtures.
- [ ] Set `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` in every deploy environment, not only local `.env`; verify the names in `.env.example:25-27` and `config/posthog.php:4-6`.
- [ ] Exercise a successful login, registration, logout, subscription, profile update, password update, and account deletion after Composer is fixed, then confirm the corresponding events arrive in PostHog; source presence alone did not verify delivery.
- [ ] Exercise an uncaught exception after Composer is fixed and confirm Error Tracking receives it; inspect `bootstrap/app.php:18-23` and `app/Services/PostHogService.php:66-73`.
- [ ] Verify returning authenticated sessions continue to identify with the stable user ID by checking the successful-login paths in `resources/views/livewire/pages/auth/login.blade.php:26-30` and `app/Http/Controllers/Auth/SocialiteController.php:45-49`.
- [ ] Replace the demo-only subscription completion path with verified Stripe webhook attribution before treating `subscription_started` as production billing data; inspect `app/Http/Controllers/SubscriptionController.php:67`.
