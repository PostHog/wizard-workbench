<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The `posthog/posthog-php` SDK (v4.2.2) was installed and a dedicated `PostHogService` class was created in `app/Services/PostHogService.php` to wrap all PostHog calls. PostHog is initialized as a singleton via `AppServiceProvider` and gracefully skips initialization when the API key is empty or `POSTHOG_DISABLED=true`.

Ten server-side events are now tracked across authentication (email/password login, Google OAuth login, registration, logout), subscription lifecycle (checkout started, plan swap, billing portal access), profile management (profile update, password change), and account deletion (a critical churn event). Users are identified on registration and both login paths using `PostHog::identify()` with name, email, and signup date as person properties.

| Event | Description | File |
|---|---|---|
| `user_registered` | A new user completed registration with name, email, and password | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | A user successfully logged in with email and password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in_social` | A user logged in or signed up via a social OAuth provider (e.g. Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | A user logged out of the application | `app/Livewire/Actions/Logout.php` |
| `subscription_checkout_started` | A user initiated checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | A user successfully swapped their active subscription to a different plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | A user was redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |
| `profile_updated` | A user updated their profile name or email address | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `password_updated` | A user successfully changed their account password | `resources/views/livewire/profile/update-password-form.blade.php` |
| `account_deleted` | A user permanently deleted their account (churn event) | `resources/views/livewire/profile/delete-user-form.blade.php` |

## Next steps

Visit your PostHog project to explore these events and build insights as data comes in:

- [PostHog Project](https://us.posthog.com/project/2)
- [Create a new dashboard](https://us.posthog.com/project/2/dashboard) — suggested name: **Analytics basics**

Recommended insights to build once data flows:

1. **Registration funnel** — Funnel: `user_registered` → `subscription_checkout_started` → `subscription_plan_swapped` (conversion from signup to paid)
2. **Daily active users** — Trend: `user_logged_in` + `user_logged_in_social` combined, unique users per day
3. **Churn signal** — Trend: `account_deleted` over time, broken down by week
4. **Subscription checkout starts** — Trend: `subscription_checkout_started` with `plan_name` breakdown
5. **Plan upgrade vs downgrade** — Trend: `subscription_plan_swapped` events over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
