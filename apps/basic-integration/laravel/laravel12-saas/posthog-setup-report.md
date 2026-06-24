<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The following changes were made:

- **`posthog/posthog-php`** installed via Composer.
- **`config/posthog.php`** created — reads `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` from environment variables.
- **`.env`** updated with `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED`.
- **`app/Services/PostHogService.php`** created — a service wrapper that handles PostHog initialization (once, via a static flag), `identify()`, `capture()`, and `captureException()`. Injected via Laravel's IoC container wherever events are captured.
- **`bootstrap/app.php`** updated — a `withExceptions` report callback automatically captures all Laravel-reported exceptions to PostHog with the current user's email as the distinct ID.
- **Auth flows** instrumented: email/password registration and login (Volt pages), Google OAuth sign-up and login (`SocialiteController`), logout route, and email verification (`VerifyEmailController`).
- **Subscription flows** instrumented: pricing page view, checkout initiation, plan swap, and billing portal access (`SubscriptionController`).
- **Profile update** instrumented: `update-profile-information-form.blade.php`.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user registered via the email/password form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | An existing user authenticated via the login form | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_signed_up_with_google` | A new user registered via Google OAuth for the first time | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in_with_google` | An existing user authenticated via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | A user ended their session by logging out | `routes/auth.php` |
| `email_verified` | A user confirmed their email address via the verification link | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `subscription_page_viewed` | A user viewed the subscription/pricing page | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_checkout_started` | A user initiated checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | A subscriber changed to a different plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | A subscriber opened the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |
| `profile_updated` | A user saved changes to their profile information | `resources/views/livewire/profile/update-profile-information-form.blade.php` |

## Next steps

We've built some insights and added them to your PostHog dashboard to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: https://us.posthog.com/project/483112/dashboard/1751155
- **User signups over time** (insight 9560445) — email vs. Google signups, daily over 30 days
- **Login activity** (insight 9560446) — password vs. Google logins, daily over 30 days
- **Subscription checkout funnel** (insight 9560447) — conversion from pricing page view to checkout start
- **Plan upgrades and swaps** (insight 9560449) — plan swap frequency and billing portal visits
- **Signup activation funnel** (insight 9560450) — sign up → email verified → checkout started

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to `.env.example` and any other environment bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
