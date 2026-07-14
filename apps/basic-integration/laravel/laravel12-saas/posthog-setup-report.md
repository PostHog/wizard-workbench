# PostHog post-wizard report

The wizard has completed a Laravel-focused PostHog integration across authentication, billing, profile management, theme changes, exception reporting, and dashboard setup. The integration added PostHog configuration to Laravel services, initialized the PHP SDK during application boot, added exception capture in the Laravel 12 bootstrap exception pipeline, introduced a dedicated `PostHogService` wrapper plus reusable user distinct ID/person property helpers, instrumented key Livewire and controller flows, and created a PostHog dashboard with five saved insights. Environment variables were added to both `.env` and `.env.example` using `POSTHOG_API_KEY` and `POSTHOG_HOST`.

A limitation remains: the environment blocked the package installation command, so `composer.json` was updated to include `posthog/posthog-php`, but Composer still needs to be run locally to actually install vendor files and refresh the lockfile. A second limitation is PostHog notebook creation: the connected MCP token is missing `notebook:write`, so the report could not be mirrored into an in-app notebook.

| Event name | Description | File |
| --- | --- | --- |
| `user_registered` | Captured when a visitor creates a new account and is signed in. | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Captured when a user successfully logs in with email and password. | `resources/views/livewire/pages/auth/login.blade.php` |
| `social_login_completed` | Captured when a user completes OAuth sign-in with a social provider. | `app/Http/Controllers/Auth/SocialiteController.php` |
| `email_verified` | Captured when an authenticated user verifies their email address. | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `subscription_checkout_started` | Captured when an authenticated user starts checkout for a subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_demo_created` | Captured when a demo subscription is created because Stripe is not configured. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Captured when a user successfully upgrades or downgrades their subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_opened` | Captured when a subscribed user opens the billing portal. | `app/Http/Controllers/SubscriptionController.php` |
| `theme_updated` | Captured when a visitor changes the active UI theme. | `app/Http/Controllers/ThemeController.php` |
| `profile_updated` | Captured when an authenticated user updates their profile details. | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `password_updated` | Captured when an authenticated user changes their account password. | `resources/views/livewire/profile/update-password-form.blade.php` |
| `account_deleted` | Captured when an authenticated user permanently deletes their account. | `resources/views/livewire/profile/delete-user-form.blade.php` |
| `user_logged_out` | Captured when an authenticated user logs out of the application. | `app/Livewire/Actions/Logout.php` |
| `dashboard_viewed` | Captured when an authenticated user loads the dashboard. | `app/Livewire/Dashboard.php` |
| `marketing_cta_clicked` | Captured client-side through clickable CTA metadata on marketing pages for registration, login, pricing, and features entry points. | `resources/views/marketing/home.blade.php`, `resources/views/marketing/features.blade.php`, `resources/views/marketing/pricing.blade.php` |
| `pricing_cta_clicked` | Captured client-side through pricing tier CTA metadata on the pricing page. | `resources/views/marketing/pricing.blade.php` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1846749
- Registrations (wizard): https://us.posthog.com/project/483112/insights/7FnfRGRJ
- Logins (wizard): https://us.posthog.com/project/483112/insights/E3l2MrBB
- Subscription checkout starts (wizard): https://us.posthog.com/project/483112/insights/NlFxwUvF
- Profile and password updates (wizard): https://us.posthog.com/project/483112/insights/B8vsL7Ui
- Registration to checkout funnel (wizard): https://us.posthog.com/project/483112/insights/NwlLNa6S

## Verify before merging

- [ ] Run `composer require posthog/posthog-php` locally so the PHP SDK is actually installed and the lockfile/vendor tree are updated.
- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to any bootstrap or collaborator setup documentation that depends on `.env.example`.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — this run identifies on login, signup, social callback, and email verification, but not yet on every authenticated app load.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
