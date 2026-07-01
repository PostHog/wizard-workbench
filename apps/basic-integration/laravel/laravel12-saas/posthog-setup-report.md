<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The integration includes a dedicated `PostHogService` class, a `config/posthog.php` configuration file, and event tracking across all critical user flows: authentication (email/password and Google OAuth), subscription billing (checkout, plan creation, plan swaps, billing portal access), and account management (profile updates and account deletion). Users are identified on every login and signup to ensure session correlation.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fires when a new user completes registration via the email/password form. | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Fires when a user successfully authenticates with email and password. | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_out` | Fires when an authenticated user logs out of the application. | `routes/auth.php` |
| `social_login_completed` | Fires when a user signs in or registers via a social OAuth provider such as Google. | `app/Http/Controllers/Auth/SocialiteController.php` |
| `subscription_checkout_started` | Fires when a user submits the checkout form to begin subscribing to a plan. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | Fires when a subscription is successfully created (including demo stub subscriptions). | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | Fires when an existing subscriber swaps to a different plan (upgrade or downgrade). | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | Fires when a subscribed user clicks to open the Stripe billing portal. | `app/Actions/Billing/RedirectToBillingPortal.php` |
| `profile_updated` | Fires when a user saves changes to their profile name or email address. | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `account_deleted` | Fires when a user confirms and deletes their account. | `resources/views/livewire/profile/delete-user-form.blade.php` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1787413)
- [Signup Funnel](https://us.posthog.com/project/483112/insights/9743497) — conversion from signup to paid subscription
- [Daily Active Users (Login)](https://us.posthog.com/project/483112/insights/9743498) — daily trend of user logins
- [Subscription Plan Changes](https://us.posthog.com/project/483112/insights/9743499) — subscription activity trends
- [Account Churn](https://us.posthog.com/project/483112/insights/9743501) — daily account deletions
- [Signup Methods](https://us.posthog.com/project/483112/insights/9743505) — breakdown of email vs social signups

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
