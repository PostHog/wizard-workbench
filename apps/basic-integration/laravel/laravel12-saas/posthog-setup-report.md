<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS project. The integration includes the PostHog PHP SDK, a dedicated `PostHogService` wrapper, request context middleware, global error tracking via the exception handler, user identification on login/signup (including Google OAuth), and event capture across all key business flows — authentication, subscription management, and core page views.

## Events Tracked

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully completes email/password registration. | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Fired when a user successfully authenticates with email and password. | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_signed_in_with_google` | Fired when a user authenticates or registers via Google OAuth. | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | Fired when a user logs out from the application. | `app/Livewire/Actions/Logout.php` |
| `subscription_checkout_started` | Fired when a user initiates checkout for a subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Fired when an existing subscriber upgrades or downgrades to a different plan. | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | Fired when a subscribed user is redirected to the Stripe billing portal. | `app/Http/Controllers/SubscriptionController.php` |
| `dashboard_viewed` | Fired when an authenticated user loads the main dashboard. | `app/Livewire/Dashboard.php` |
| `email_verified` | Fired when a user successfully verifies their email address. | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `profile_viewed` | Fired when an authenticated user visits their profile settings page. | `resources/views/livewire/profile/update-profile-information-form.blade.php` |

## Files Created or Modified

- **Created** `config/posthog.php` — PostHog configuration (API key, host, disabled flag)
- **Created** `app/Services/PostHogService.php` — Service wrapper for identify, capture, captureException, feature flags
- **Created** `app/Http/Middleware/PostHogRequestContext.php` — Propagates client-side session/distinct ID headers to server-side events
- **Modified** `app/Providers/AppServiceProvider.php` — Initializes PostHog on boot
- **Modified** `bootstrap/app.php` — Registers middleware globally; adds error reporting via `captureException`
- **Modified** `resources/views/livewire/pages/auth/register.blade.php` — `user_signed_up` + `identify`
- **Modified** `resources/views/livewire/pages/auth/login.blade.php` — `user_logged_in` + `identify`
- **Modified** `app/Livewire/Actions/Logout.php` — `user_logged_out`
- **Modified** `app/Http/Controllers/Auth/SocialiteController.php` — `user_signed_in_with_google` + `user_signed_up` (new OAuth users) + `identify`
- **Modified** `app/Http/Controllers/SubscriptionController.php` — `subscription_checkout_started`, `subscription_plan_swapped`, `billing_portal_accessed`
- **Modified** `app/Livewire/Dashboard.php` — `dashboard_viewed`
- **Modified** `app/Http/Controllers/Auth/VerifyEmailController.php` — `email_verified`
- **Modified** `resources/views/livewire/profile/update-profile-information-form.blade.php` — `profile_viewed`

## Next steps

We've built some insights and a dashboard to keep an eye on user behaviour, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793485)
- [New Signups](https://us.posthog.com/project/483112/insights/qGgZzItW)
- [Signup to Subscription Funnel](https://us.posthog.com/project/483112/insights/IQyxTCef)
- [Weekly Active Users](https://us.posthog.com/project/483112/insights/I6yJ7o1G)
- [Subscription Checkouts Started](https://us.posthog.com/project/483112/insights/rFQlnTcA)
- [User Retention: Returning Logins](https://us.posthog.com/project/483112/insights/iO9OoPkw)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to `.env.example` and any deployment/bootstrap scripts so collaborators know what to set. (They were added to `.env.example` in this run.)
- [ ] Confirm the returning-visitor path also calls `identify` — the login handler identifies on every password login and Google OAuth login, but double-check that session-resumed users (e.g. "remember me") are also identified if needed.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
