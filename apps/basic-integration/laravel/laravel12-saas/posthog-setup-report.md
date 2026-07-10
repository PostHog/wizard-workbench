<wizard-report>
# PostHog post-wizard report

The wizard completed a Laravel-focused PostHog integration across authentication, account management, dashboard, pricing, subscription, and exception-reporting flows. A reusable `PostHogService` was added, PostHog configuration was wired through Laravel service config and environment variables, initialization was added during app bootstrap, and server-side exception capture was connected in `bootstrap/app.php`. Event capture and identify calls were added to signup, login, social login callback, email verification, profile updates, password changes, account deletion, pricing views, dashboard views, subscription checkout, subscription activation, plan changes, and billing portal entry.

| Event name | Description | File |
| --- | --- | --- |
| pricing_viewed | Tracks when an authenticated or anonymous visitor opens the pricing page. | `routes/web.php` |
| dashboard_viewed | Tracks when an authenticated user loads the dashboard. | `app/Livewire/Dashboard.php` |
| user_signed_up | Tracks when a new user account is created with email registration. | `resources/views/livewire/pages/auth/register.blade.php` |
| user_logged_in | Tracks when a user signs in with email and password. | `resources/views/livewire/pages/auth/login.blade.php` |
| social_login_completed | Tracks when a user completes OAuth sign-in with a social provider. | `app/Http/Controllers/Auth/SocialiteController.php` |
| password_reset_requested | Tracks when a visitor successfully requests a password reset email. | `resources/views/livewire/pages/auth/forgot-password.blade.php` |
| email_verification_completed | Tracks when a signed-in user verifies their email address. | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| profile_updated | Tracks when a signed-in user updates their profile details. | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| password_updated | Tracks when a signed-in user changes their password. | `resources/views/livewire/profile/update-password-form.blade.php` |
| account_deleted | Tracks when a signed-in user permanently deletes their account. | `resources/views/livewire/profile/delete-user-form.blade.php` |
| subscription_checkout_started | Tracks when a user starts a subscription checkout flow for a plan. | `app/Http/Controllers/SubscriptionController.php` |
| subscription_activated | Tracks when a demo or Stripe-backed subscription becomes active. | `app/Http/Controllers/SubscriptionController.php` |
| subscription_plan_changed | Tracks when a subscriber successfully changes plans. | `app/Http/Controllers/SubscriptionController.php` |
| billing_portal_opened | Tracks when a subscriber opens the billing portal. | `app/Http/Controllers/SubscriptionController.php` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831055)
- [Account lifecycle events (wizard)](https://us.posthog.com/project/483112/insights/278d9Uxp)
- [Signups (wizard)](https://us.posthog.com/project/483112/insights/Cbndj7kH)
- [Checkout starts (wizard)](https://us.posthog.com/project/483112/insights/p5rS9L7p)
- [Pricing to signup funnel (wizard)](https://us.posthog.com/project/483112/insights/1DLQRUbk)
- [Checkout to activation funnel (wizard)](https://us.posthog.com/project/483112/insights/xnWCzS0X)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.
- [ ] Install `posthog/posthog-php` in Composer before merging; the package install step was blocked in this environment, so runtime classes are referenced but not yet added to the manifest.
- [ ] Install frontend dependencies before rerunning the production build; `npm run build` failed because `vite` was not available in the current environment.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
