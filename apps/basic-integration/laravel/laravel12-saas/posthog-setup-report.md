<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Laravel 12 SaaS application with PostHog analytics. The integration adds server-side event tracking across authentication, subscription management, and dashboard flows using a dedicated `PostHogService` class and the `posthog/posthog-php` SDK (v4.12.1). User identification is performed at login, registration, and key action points so that server-side events are correctly correlated to individual users.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | New user registered via email form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User authenticated with email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_out` | User ended their session | `routes/auth.php` |
| `user_signed_up` | New user registered via social OAuth (Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in` | Existing user authenticated via social OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `email_verified` | User verified their email address | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `subscription_checkout_started` | User initiated subscription checkout | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Subscriber changed to a different plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User opened the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |
| `dashboard_viewed` | Authenticated user visited the dashboard | `app/Livewire/Dashboard.php` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.i.posthog.com/project/483112/dashboard/1897356)
  - User signups (wizard) — daily trend of `user_signed_up`
  - User logins (wizard) — daily trend of `user_logged_in`
  - Signup to checkout funnel (wizard) — conversion from `user_signed_up` → `subscription_checkout_started`
  - Subscription checkouts by plan (wizard) — bar chart breakdown by `plan_name`
  - Login method breakdown (wizard) — bar chart breakdown by `login_method` (password vs google)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`) to any monorepo/bootstrap scripts so collaborators know what to set (they are already in `.env.example`).
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
