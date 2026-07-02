<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. A dedicated `PostHogService` class was created in `app/Services/` to centralise all SDK calls. PostHog is initialised once in `AppServiceProvider::boot()` and exception tracking is wired into Laravel 11's `withExceptions` callback in `bootstrap/app.php`. Events cover the full user lifecycle — registration, authentication (email and Google OAuth), billing, profile management, and account deletion — along with a pricing-page view that works for both authenticated and anonymous visitors.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | New user completes email registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_signed_up` | New user signs up via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in` | User authenticates with email and password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in` | User authenticates via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logs out of the application | `app/Livewire/Actions/Logout.php` |
| `pricing_page_viewed` | Visitor views the pricing page (top of funnel) | `resources/views/marketing/pricing.blade.php` |
| `subscription_checkout_started` | User initiates a subscription checkout | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Subscriber switches to a different plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User is redirected to the Stripe billing portal | `app/Actions/Billing/RedirectToBillingPortal.php` |
| `profile_updated` | User saves profile information changes | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `password_changed` | User successfully changes their password | `resources/views/livewire/profile/update-password-form.blade.php` |
| `account_deleted` | User permanently deletes their account | `resources/views/livewire/profile/delete-user-form.blade.php` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1792462)
- [Sign-up to subscription funnel](https://us.posthog.com/project/483112/insights/d6DfA2y5)
- [Daily logins](https://us.posthog.com/project/483112/insights/fTQn6CoA)
- [New sign-ups](https://us.posthog.com/project/483112/insights/HFP3IAea)
- [Subscription checkouts started](https://us.posthog.com/project/483112/insights/TUMB2tmh)
- [Account deletions (churn)](https://us.posthog.com/project/483112/insights/KUkS6P9p)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to `.env.example` and any deployment scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
