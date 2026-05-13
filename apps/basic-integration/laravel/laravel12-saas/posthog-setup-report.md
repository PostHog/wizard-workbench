<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Laravel 12 SaaS application. The integration covers both server-side event tracking (via the PostHog PHP SDK) and client-side tracking (via the PostHog JS snippet injected into the app layout). Users are identified on login, registration, and Google OAuth login, correlating server-side events with client-side sessions.

## Changes made

- **`composer.json`** — Added `posthog/posthog-php` dependency
- **`config/posthog.php`** — New config file reading `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED` from environment
- **`app/Services/PostHogService.php`** — New service class with static `capture()` and `identify()` helpers
- **`app/Providers/AppServiceProvider.php`** — Initialized `PostHog::init()` in the `boot()` method
- **`resources/views/layouts/app.blade.php`** — Injected PostHog JS snippet for client-side tracking and user identification on every authenticated page
- **`.env`** / **`.env.example`** — Added `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Triggered when a new user completes registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Triggered when a user successfully logs in with email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in_with_google` | Triggered when a user authenticates or registers via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `subscription_page_viewed` | Triggered when a user views the subscription/plans page (top of billing funnel) | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_checkout_started` | Triggered when a user initiates a checkout session for a plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Triggered when a subscribed user successfully swaps to a different plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | Triggered when a user is redirected to the Stripe billing portal | `app/Actions/Billing/RedirectToBillingPortal.php` |
| `user_account_deleted` | Triggered when a user permanently deletes their account | `resources/views/livewire/profile/delete-user-form.blade.php` |

## Next steps

We recommend building the following insights in an **"Analytics basics"** dashboard to monitor user behavior based on the events just instrumented:

1. **New signups over time** — Trends chart for `user_signed_up`: [Create insight](https://us.posthog.com/project/2/insights/new#eyJldmVudHMiOlt7ImlkIjoidXNlcl9zaWduZWRfdXAiLCJuYW1lIjoidXNlcl9zaWduZWRfdXAiLCJ0eXBlIjoiZXZlbnRzIiwib3JkZXIiOjB9XSwiaW5zaWdodCI6IlRSRU5EUyJ9)

2. **Subscription conversion funnel** — Funnel: `subscription_page_viewed` → `subscription_checkout_started` → `subscription_plan_swapped`: [Create insight](https://us.posthog.com/project/2/insights/new#eyJldmVudHMiOlt7ImlkIjoic3Vic2NyaXB0aW9uX3BhZ2Vfdmlld2VkIiwibmFtZSI6InN1YnNjcmlwdGlvbl9wYWdlX3ZpZXdlZCIsInR5cGUiOiJldmVudHMiLCJvcmRlciI6MH0seyJpZCI6InN1YnNjcmlwdGlvbl9jaGVja291dF9zdGFydGVkIiwibmFtZSI6InN1YnNjcmlwdGlvbl9jaGVja291dF9zdGFydGVkIiwidHlwZSI6ImV2ZW50cyIsIm9yZGVyIjoxfSx7ImlkIjoic3Vic2NyaXB0aW9uX3BsYW5fc3dhcHBlZCIsIm5hbWUiOiJzdWJzY3JpcHRpb25fcGxhbl9zd2FwcGVkIiwidHlwZSI6ImV2ZW50cyIsIm9yZGVyIjoyfV0sImluc2lnaHQiOiJGVU5ORUxTIn0=)

3. **Login method breakdown** — Trends: `user_logged_in` vs `user_logged_in_with_google` broken down by event name: [Create insight](https://us.posthog.com/project/2/insights/new)

4. **Plan upgrades/downgrades** — Trends chart for `subscription_plan_swapped` broken down by `plan_name`: [Create insight](https://us.posthog.com/project/2/insights/new)

5. **Account churn (deletions)** — Trends chart for `user_account_deleted`: [Create insight](https://us.posthog.com/project/2/insights/new)

You can also create a new dashboard directly at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
