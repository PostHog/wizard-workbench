<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Laravel 12 SaaS application. The `posthog/posthog-php` SDK (v4.9.0) was installed via Composer. A dedicated `PostHogService` class was created to wrap all PostHog calls, and PostHog is initialized once in `AppServiceProvider::boot()`. A `PostHogRequestContext` middleware was added to the web middleware stack to propagate client-side session context to server-side events. Error tracking was wired into `bootstrap/app.php` using Laravel 11+'s `withExceptions` callback. Twelve events covering auth, billing, and profile actions were instrumented across Volt/Livewire components and standard controllers.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user completes registration with email and password. | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Fired when an existing user successfully authenticates with email and password. | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_out` | Fired when a user logs out of the application. | `routes/auth.php` |
| `social_login_completed` | Fired when a user authenticates or registers via a social provider such as Google. | `app/Http/Controllers/Auth/SocialiteController.php` |
| `subscription_started` | Fired when a user initiates checkout for a subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Fired when an existing subscriber upgrades or downgrades to a different plan. | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_opened` | Fired when a user opens the Stripe billing portal to manage their subscription. | `app/Http/Controllers/SubscriptionController.php` |
| `profile_updated` | Fired when a user saves changes to their name or email address. | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `account_deleted` | Fired when a user permanently deletes their account. | `resources/views/livewire/profile/delete-user-form.blade.php` |
| `dashboard_viewed` | Fired when an authenticated user views the main dashboard. | `app/Livewire/Dashboard.php` |
| `subscription_page_viewed` | Fired when a user views the subscription plans page — top of the billing conversion funnel. | `app/Http/Controllers/SubscriptionController.php` |
| `password_reset_requested` | Fired when a user submits the forgot-password form to request a reset link. | `resources/views/livewire/pages/auth/forgot-password.blade.php` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1807683)
- [Subscription conversion funnel](https://us.posthog.com/project/483112/insights/Yp7hSiEz)
- [New signups over time](https://us.posthog.com/project/483112/insights/IhXSDDFd)
- [Signups vs Logins](https://us.posthog.com/project/483112/insights/dHHXgZZr)
- [Subscription activity](https://us.posthog.com/project/483112/insights/GkkQrvEV)
- [Account churn events](https://us.posthog.com/project/483112/insights/6yVQ2qNW)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`) to any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
