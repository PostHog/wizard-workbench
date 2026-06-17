<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS project. The PHP SDK (`posthog/posthog-php`) was installed, a dedicated `PostHogService` wrapper class was created, and events are captured across authentication flows, subscription billing, the dashboard, and profile management. A global exception reporter was also wired into Laravel's exception handler via `bootstrap/app.php` to automatically capture unhandled errors to PostHog.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | New user completes email registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User authenticates via email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_out` | User logs out | `routes/auth.php` |
| `user_signed_up` | New user registers via OAuth (e.g. Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in` | Existing user authenticates via OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `subscription_checkout_started` | User initiates a plan checkout | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Subscribed user changes their plan | `app/Http/Controllers/SubscriptionController.php` |
| `dashboard_viewed` | Authenticated user loads the dashboard | `app/Livewire/Dashboard.php` |
| `profile_updated` | User saves profile information changes | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `password_updated` | User successfully changes their password | `resources/views/livewire/profile/update-password-form.blade.php` |

## Files created or modified

| File | Change |
|------|--------|
| `config/posthog.php` | New — PostHog config (api_key, host, disabled, debug) via env vars |
| `app/Services/PostHogService.php` | New — service wrapper for identify, capture, captureException |
| `app/Models/User.php` | Added `getPostHogProperties()` helper method |
| `app/Providers/AppServiceProvider.php` | Added `PostHog::init()` in `boot()` |
| `bootstrap/app.php` | Added global exception reporter calling `PostHog::captureException()` |
| `resources/views/livewire/pages/auth/login.blade.php` | Added `user_logged_in` capture + identify |
| `resources/views/livewire/pages/auth/register.blade.php` | Added `user_signed_up` capture + identify |
| `routes/auth.php` | Added `user_logged_out` capture in logout closure |
| `app/Http/Controllers/Auth/SocialiteController.php` | Added social signup/login tracking |
| `app/Http/Controllers/SubscriptionController.php` | Added `subscription_checkout_started` and `subscription_plan_swapped` |
| `app/Livewire/Dashboard.php` | Added `dashboard_viewed` capture in `mount()` |
| `resources/views/livewire/profile/update-profile-information-form.blade.php` | Added `profile_updated` capture + identify |
| `resources/views/livewire/profile/update-password-form.blade.php` | Added `password_updated` capture |

## Next steps

The PostHog MCP API key did not have the required scopes (`dashboard:write`, `insight:write`, `query:read`) to create the dashboard automatically. You can create the "Analytics basics (wizard)" dashboard manually at:

[PostHog Project Dashboard](https://us.posthog.com/project/2/dashboards)

Recommended insights to add:

1. **Sign-up funnel** — Funnel: `user_signed_up` → `dashboard_viewed` → `subscription_checkout_started`
2. **Login trend** — Trends: `user_logged_in` over time, broken down by `login_method` (password vs google)
3. **Subscription conversions** — Trends: `subscription_checkout_started` and `subscription_plan_swapped` over time
4. **User retention** — Retention: users who fire `user_logged_in` and return to fire `dashboard_viewed`
5. **Profile engagement** — Trends: `profile_updated` and `password_updated` over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to `.env.example` and any CI/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the login handler identifies on each login, but if your app loads with an already-authenticated session (e.g. "remember me"), you may want to call `identify` on that first authenticated request as well.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
