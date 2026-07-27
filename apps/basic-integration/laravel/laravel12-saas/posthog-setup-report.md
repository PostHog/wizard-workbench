# PostHog setup report

## Summary

Laravel server-side PostHog instrumentation was added for authentication, account management, subscriptions, billing, request identity, and exception reporting, with a starter dashboard in project 483112.

## What was installed and initialized

- `posthog/posthog-php` `^4.12.1` was added to `composer.json`.
- The package was **not installed into `composer.lock`**: Composer failed against the existing dependency graph because `larabug/larabug 3.4.0` resolves Carbon/Symfony packages requiring PHP 8.4, while this environment runs PHP 8.3.6.
- `config/posthog.php` reads `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` from environment configuration.
- `app/Services/PostHogService.php` is the shared injected wrapper and initializes the PHP SDK once, with missing-configuration guards.
- The real environment keys were set locally through the wizard tooling; `.env.example` documents the three key names.
- Laravel requests use the shared request context in `bootstrap/app.php`; authenticated users use their stable primary-key identifier rather than email. Login, registration, and Socialite success paths explicitly identify the authenticated user.
- No browser SDK or CSP changes were made. No runtime event delivery was observed because the SDK could not be installed and the application was not started.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | Successful password or social-provider sign-in | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_signed_up` | New account creation followed by authentication | `resources/views/livewire/pages/auth/register.blade.php` |
| `email_verified` | Authenticated user email verification | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `profile_updated` | Successful authenticated profile save | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `password_updated` | Successful authenticated password change | `resources/views/livewire/profile/update-password-form.blade.php` |
| `account_deleted` | Confirmed permanent account deletion | `resources/views/livewire/profile/delete-user-form.blade.php` |
| `subscription_checkout_started` | Start of checkout for a selected subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | Successful active subscription plan change | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_opened` | Request to open the billing management portal | `app/Http/Controllers/SubscriptionController.php` |

The recorded review confirmed the planned event names and call sites are present and that event properties are limited to non-PII action metadata (`login_method` and `plan_id` where applicable). The run did **not** observe any of these events arriving in PostHog.

## Identification

User identification was wired, not skipped. Authenticated request context uses the framework user primary key, and the password login, registration, and Socialite callback paths explicitly identify immediately after authentication because their request context began before login. Email and name are person properties rather than event properties. No browser logout reset was added because this is a PHP-only integration.

## Error tracking

A global Laravel `reportable` callback was added in `bootstrap/app.php`. It delegates exceptions to `PostHogService::captureException()` and uses the authenticated numeric user ID when available, otherwise anonymous. The run verified the callback and wrapper were written, but could not verify exception delivery to PostHog because the SDK was not installed and the application was not run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914268) contains five saved insight tiles covering signup-to-login conversion, authentication activity, subscription plan changes, account engagement, and account deletion. The dashboard exists, but its fresh insight definitions may remain empty until the application sends events.

## Verified versus unconfirmed

### Verified by this run

- The integration files, environment configuration names, request context, identity calls, event calls, and exception boundary were reviewed after editing.
- Frontend dependencies installed successfully and `npm run build` passed; Vite transformed 54 modules.
- The PostHog dashboard and five insight tiles were created successfully.
- No event capture was observed, no exception was observed arriving in Error Tracking, and no end-to-end application run was completed.

### Unconfirmed

- PHP dependency installation, Laravel application startup, PHP compilation, test-suite behavior, and actual PostHog delivery remain unconfirmed.
- The dashboard’s data population and attribution remain unconfirmed until the PHP SDK is installed and real flows are exercised.

## Unresolved issue and cost

**Composer/PHP compatibility remains unresolved.** The declared SDK cannot enter `composer.lock` while the locked `larabug/larabug 3.4.0` dependency graph requires PHP 8.4 and the available runtime is PHP 8.3.6. Until the environment is upgraded to a compatible PHP version or the dependency graph is resolved, the Laravel app cannot load the declared PostHog SDK and none of the instrumented events or exception reports can be confirmed as delivered.

## Next steps

1. Resolve the PHP 8.4 versus PHP 8.3.6 Composer conflict, then run Composer again so `posthog/posthog-php` is installed and `composer.lock` is updated.
2. Configure `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` in every deployment environment, not only local `.env`.
3. Run the Laravel test suite and a full production build after dependency installation.
4. Exercise login, signup, verification, profile/password/account, checkout, subscription, and billing flows, then confirm the nine named events arrive with stable user attribution.
5. Trigger a controlled exception and verify it appears in PostHog Error Tracking.
6. Consider adding password-reset completion and Stripe webhook-confirmed subscription outcome events, which the capture handoff identified as outside this focused pass.

## Before you merge

- [ ] Resolve the Composer conflict and install `posthog/posthog-php`; check `composer.json` and the dependency lock state before deployment.
- [ ] Run the full production build and fix any lint or type errors introduced by the integration; the verified build was the frontend `npm run build` only.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures, especially the PostHog service calls in `app/Services/PostHogService.php` and their callers.
- [ ] Set `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` in deployment configuration as documented in `.env.example`, not just `.env`.
- [ ] With the SDK installed, exercise the returning authenticated-user path through `bootstrap/app.php` and confirm it retains the stable primary-key distinct ID rather than creating anonymous fragments.
- [ ] Confirm the nine event names and exception reports arrive in PostHog after exercising their call sites; the run only verified source placement, not delivery.
