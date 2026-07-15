# PostHog post-wizard report

The wizard added a server-side PostHog integration for this Laravel and Livewire application. PostHog is initialized in the application service provider from environment-backed configuration. A dedicated service centralizes user identification, event capture, and Laravel exception capture. Authenticated people use their stable database user ID as the distinct ID; person properties, including email and name, are sent only via `identify`.

Environment configuration was added to `.env` and documented in `.env.example` with `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED`.

> **Setup blockers:** The execution environment blocked the required `composer require posthog/posthog-php` command, so the PHP SDK is not yet in the dependency manifest. The PostHog MCP server was unavailable, so the dashboard, insights, and shareable notebook could not be created.

| Event name | Event description | File |
|---|---|---|
| `user_logged_in` | Captures a successful password-based login for an authenticated user. | `app/Livewire/Forms/LoginForm.php` |
| `user_signed_up` | Captures creation of an account through password registration. | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_signed_up` | Captures creation of an account through social sign-in. | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in` | Captures a successful social sign-in for an authenticated user. | `app/Http/Controllers/Auth/SocialiteController.php` |
| `email_verified` | Captures successful verification of an authenticated user's email address. | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `subscription_checkout_started` | Captures a user's request to begin checkout for a selected plan. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | Captures successful creation of a demo subscription when payment processing is unavailable. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | Captures a successful subscription plan change. | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_opened` | Captures a user's request to access the billing portal. | `app/Http/Controllers/SubscriptionController.php` |
| `user_logged_out` | Captures an authenticated user's logout. | `routes/auth.php` |

## Next steps

A PostHog dashboard named `Analytics basics (wizard)`, its insights, and a shareable notebook could not be created because the PostHog MCP server was unavailable. Once connectivity is restored, create the dashboard with views for signup, login, checkout starts, demo subscription creation, and plan changes.

## Verify before merging

- [ ] Run `composer require posthog/posthog-php` to install the required PHP SDK and update Composer dependencies.
- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to deployment configuration and any bootstrap scripts used outside the repository.
- [ ] Confirm the returning-visitor path also calls `identify` so authenticated returning sessions use the stable user ID.

### Agent skill

An agent skill folder remains in the project for future Claude Code work. It contains the Laravel integration guidance used for this setup.
