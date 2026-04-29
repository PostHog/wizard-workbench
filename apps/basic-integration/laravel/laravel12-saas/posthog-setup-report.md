<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Laravel 12 SaaS application. The PHP SDK (`posthog/posthog-php`) has been installed via Composer, a dedicated `PostHogService` class was created in `app/Services/`, and PostHog is initialized once in `AppServiceProvider::boot()` using environment variables. Server-side event tracking and user identification have been added to all key user flows: registration, login (email and OAuth), logout, subscription checkout, subscription creation, plan swapping, and billing portal access.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User completes email/password registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User successfully logs in with email and password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_signed_up_with_oauth` | New user account created via OAuth (Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in_with_oauth` | Existing user logs in via OAuth (Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logs out of the application | `app/Livewire/Actions/Logout.php` |
| `subscription_checkout_started` | User initiates checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | Subscription successfully created (including demo/stub mode) | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | User successfully swaps to a different subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |

## Next steps

Create a new dashboard called **"Analytics basics"** in PostHog and add the following insights:

1. **New User Signups** — Trends insight with `user_signed_up` and `user_signed_up_with_oauth` over the last 30 days. Shows growth in new registrations and the split between email and OAuth signups.

2. **Subscription Checkout Conversion Funnel** — Funnel insight: `subscription_checkout_started` → `subscription_created`. Shows what percentage of users who start checkout complete their subscription.

3. **Login Method Breakdown** — Trends insight with `user_logged_in` and `user_logged_in_with_oauth`, displayed as a pie chart or stacked bar. Shows the split between email and Google OAuth logins.

4. **Subscription Activity** — Trends insight with `subscription_checkout_started`, `subscription_created`, and `subscription_plan_swapped` over time. Tracks overall subscription momentum.

5. **Churn Signal — Logouts** — Trends insight with `user_logged_out` over time. High logout rates relative to logins can be an early churn signal.

- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboards)
- [Create new insight](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
