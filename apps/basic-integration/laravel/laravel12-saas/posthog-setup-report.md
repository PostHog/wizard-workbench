# PostHog post-wizard report

The wizard added a Laravel server-side PostHog integration with configuration sourced from environment variables, initialization during application boot, and a dedicated analytics service. Authenticated users are identified with their stable database ID; email and name are sent only as person properties. Critical authentication, verification, subscription, and logout actions now capture analytics events. Laravel exception reporting also sends exceptions to PostHog with request context.

The SDK package could not be installed in this environment: Composer dependency resolution selected Symfony 8 packages that require PHP 8.4 while this runtime is PHP 8.3.6. Install `posthog/posthog-php` in an environment with compatible locked dependencies before merging; the service and initialization reference that SDK.

| Event name | Description | File |
| --- | --- | --- |
| `user_signed_up` | A visitor completes account registration. | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | An existing user successfully signs in with a password. | `app/Livewire/Forms/LoginForm.php` |
| `social_login_completed` | A user successfully completes a social sign-in. | `app/Http/Controllers/Auth/SocialiteController.php` |
| `subscription_checkout_started` | A user starts checkout for a subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | A subscription is created in demo mode after checkout. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | A subscribed user successfully changes their plan. | `app/Http/Controllers/SubscriptionController.php` |
| `email_verified` | A user successfully verifies their email address. | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `user_logged_out` | An authenticated user signs out. | `app/Livewire/Actions/Logout.php` and `routes/auth.php` |

## Next steps

A PostHog dashboard and shareable notebook could not be created because the configured PostHog MCP server was unreachable from this environment. Create an **Analytics basics (wizard)** dashboard after restoring MCP connectivity, with insights based on `user_signed_up`, `subscription_checkout_started`, `subscription_created`, and `subscription_plan_changed`.

## Verify before merging

- [ ] Install `posthog/posthog-php` after resolving the PHP 8.3/Symfony dependency conflict in Composer.
- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

An agent skill folder remains in `.claude/skills/integration-laravel` for future PostHog integration work.
