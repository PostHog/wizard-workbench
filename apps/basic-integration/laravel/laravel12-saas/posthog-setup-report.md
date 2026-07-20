# PostHog post-wizard report

The wizard added a Laravel PostHog configuration, a dedicated analytics service, SDK initialization, exception reporting, user identification, and nine business events covering authentication, subscriptions, billing, logout, and account deletion. PostHog environment variables were configured locally. The PHP SDK was installed and locked successfully after resolving the project's Symfony dependency set to PHP 8.3-compatible releases.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | A user successfully creates an account with the registration form. | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | A user successfully authenticates with a password. | `resources/views/livewire/pages/auth/login.blade.php` |
| `social_login_completed` | A user successfully authenticates through a social provider. | `app/Http/Controllers/Auth/SocialiteController.php` |
| `checkout_started` | A user begins checkout for a selected subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `demo_subscription_created` | A demo subscription is successfully created when Stripe is unavailable. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | A subscribed user successfully changes subscription plans. | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_opened` | A subscribed user requests access to the billing portal. | `app/Http/Controllers/SubscriptionController.php` |
| `user_logged_out` | An authenticated user logs out of the application. | `app/Livewire/Actions/Logout.php` |
| `account_deleted` | A user permanently deletes their account. | `resources/views/livewire/profile/delete-user-form.blade.php` |

## Next steps

The PostHog MCP server was unavailable during setup, so the live dashboard, insights, and shareable notebook could not be created.

## Verify before merging

- [ ] Run a full production build in CI and fix any environment-specific lint or type errors; the local Vite production build passed.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
