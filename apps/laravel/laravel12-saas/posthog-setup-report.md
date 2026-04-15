<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. PostHog PHP SDK v4.2 was installed via Composer, a dedicated `PostHogService` class was created for centralized capture/identify calls, and PostHog is initialized in `AppServiceProvider` using environment variables. Event tracking was added across the full user lifecycle: registration, login (email and Google OAuth), logout, subscription checkout, subscription creation, plan swaps, billing portal access, pricing page views, and profile management (update, password change, account deletion).

| Event | Description | File |
|---|---|---|
| `user_registered` | User completed registration with email and password | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User logged in with email and password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in_social` | User logged in or signed up via social provider (e.g. Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logged out of the application | `app/Livewire/Actions/Logout.php` |
| `pricing_page_viewed` | Authenticated user viewed the subscription/pricing page | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_checkout_started` | User initiated checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | User successfully subscribed to a plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | User upgraded or downgraded their subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User clicked to open the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |
| `profile_updated` | User updated their profile information | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `password_updated` | User changed their account password | `resources/views/livewire/profile/update-password-form.blade.php` |
| `account_deleted` | User deleted their account | `resources/views/livewire/profile/delete-user-form.blade.php` |

## Next steps

We've set up event tracking across your entire user lifecycle. To visualize these events, create the following insights in your PostHog project:

1. **Subscription conversion funnel** — Funnel: `pricing_page_viewed` → `subscription_checkout_started` → `subscription_created`
2. **New user registrations** — Trend: `user_registered` over time
3. **Login method breakdown** — Bar chart: `user_logged_in` vs `user_logged_in_social` (use `provider` property for breakdown)
4. **Account churn** — Trend: `account_deleted` over time
5. **Plan upgrade/downgrade activity** — Trend: `subscription_plan_swapped` broken down by `plan_name`

Visit your [PostHog project](https://us.posthog.com/project/2) to explore these events and build dashboards.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
