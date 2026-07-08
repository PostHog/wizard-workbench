<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Laravel 12 SaaS application. The PostHog PHP SDK (`posthog/posthog-php`) was installed and configured. A dedicated `PostHogService` class was created in `app/Services/`, PostHog is initialized in `AppServiceProvider`, global error tracking was wired into `bootstrap/app.php`, and event capture + user identification calls were added across all key user flows: authentication, subscription lifecycle, profile management, and churn.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | A new user completes the registration form and creates an account. | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | A user successfully authenticates with email/password. | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_signed_up` | A new user registers via Google OAuth (Socialite). | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in` | A returning user signs in via Google OAuth (Socialite). | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | A user logs out of their account. | `app/Livewire/Actions/Logout.php` |
| `subscriptions_viewed` | A user views the subscription/pricing plans page. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_checkout_started` | A user initiates the checkout flow to subscribe to a plan. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | An existing subscriber upgrades or downgrades their plan. | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_visited` | A subscribed user opens the Stripe billing portal. | `app/Http/Controllers/SubscriptionController.php` |
| `dashboard_viewed` | A logged-in user loads the main dashboard page. | `app/Livewire/Dashboard.php` |
| `profile_updated` | A user saves changes to their profile name or email. | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `account_deleted` | A user permanently deletes their account. | `resources/views/livewire/profile/delete-user-form.blade.php` |
| `email_verification_resent` | A user requests a new email verification link after registration. | `resources/views/livewire/pages/auth/verify-email.blade.php` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818146)
- [New signups over time (wizard)](https://us.posthog.com/project/483112/insights/DpojwHTq)
- [Subscription conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/0ucroQql)
- [Logins by method (wizard)](https://us.posthog.com/project/483112/insights/HxSnfb8K)
- [Plan upgrades and downgrades (wizard)](https://us.posthog.com/project/483112/insights/v1sEloGh)
- [Account deletions (wizard)](https://us.posthog.com/project/483112/insights/4GewicOa)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
