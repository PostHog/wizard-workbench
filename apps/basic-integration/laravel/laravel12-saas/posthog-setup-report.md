<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The PostHog PHP SDK (`posthog/posthog-php`) was installed, a dedicated `PostHogService` class was created in `app/Services/`, a `PostHogRequestContext` middleware was added to propagate client-side session context to server-side events, and global exception capture was wired into `bootstrap/app.php`. PostHog is initialized in `AppServiceProvider` on every request. Ten events are now tracked across authentication, billing, and core app flows, with user identification happening on every login and signup path (including Google OAuth).

| Event | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully registered with email and password. | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | A user authenticated via the email/password login form. | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_signed_up` | A new user registered via Google OAuth for the first time. | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in` | A returning user authenticated via Google OAuth. | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | A user logged out of the application. | `routes/auth.php` |
| `subscription_page_viewed` | A user viewed the subscription/plan selection page. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_checkout_started` | A user initiated a Stripe checkout session for a plan. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | A subscribed user changed their plan to a different tier. | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | A user was redirected to the Stripe billing portal. | `app/Http/Controllers/SubscriptionController.php` |
| `dashboard_viewed` | A logged-in user loaded their main dashboard. | `app/Livewire/Dashboard.php` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818186)
- [New signups over time (wizard)](https://us.posthog.com/project/483112/insights/U5k8o6ai)
- [Signup to subscription funnel (wizard)](https://us.posthog.com/project/483112/insights/XD8ULRaw)
- [Logins by method (wizard)](https://us.posthog.com/project/483112/insights/q8qYSIOd)
- [Subscription events over time (wizard)](https://us.posthog.com/project/483112/insights/nj407OJl)
- [User retention after signup (wizard)](https://us.posthog.com/project/483112/insights/lmUERnO7)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to `.env.example` and any deployment scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
