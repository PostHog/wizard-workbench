<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Laravel 12 SaaS application. Here's a summary of all changes made:

- **`posthog/posthog-php` (v4.2.4)** installed via Composer
- **`config/posthog.php`** created — config values read from environment variables
- **`app/Services/PostHogService.php`** created — a static wrapper for `PostHog::capture`, `PostHog::identify`, and `PostHog::flush`
- **`app/Providers/AppServiceProvider.php`** updated — PostHog initialized in `boot()` using `config('posthog.*')` values
- **`resources/views/layouts/app.blade.php`** updated — PostHog JS snippet added with automatic `posthog.identify()` for authenticated users
- **`resources/views/layouts/guest.blade.php`** updated — PostHog JS snippet added for anonymous tracking on auth pages
- **`resources/views/livewire/pages/auth/register.blade.php`** updated — `user_registered` captured with `identify()` after successful registration
- **`app/Livewire/Forms/LoginForm.php`** updated — `user_logged_in` captured with `identify()` after successful authentication
- **`app/Http/Controllers/Auth/SocialiteController.php`** updated — `user_signed_up_with_provider` or `user_logged_in_with_provider` captured based on whether the OAuth user is new, with `identify()` called in both cases
- **`app/Http/Controllers/SubscriptionController.php`** updated — `pricing_viewed`, `subscription_checkout_started`, `subscription_created`, `subscription_plan_changed`, and `billing_portal_accessed` events captured at the relevant points in the billing flow
- **`app/Livewire/Actions/Logout.php`** updated — `user_logged_out` captured before session invalidation, followed by `PostHog::flush()` to ensure delivery
- **`.env`** updated — `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` keys set

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_registered` | A new user creates an account via the registration form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | A user authenticates successfully with email and password | `app/Livewire/Forms/LoginForm.php` |
| `user_logged_in_with_provider` | An existing user logs in via a social OAuth provider (e.g. Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_signed_up_with_provider` | A new user signs up for the first time via a social OAuth provider (e.g. Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `pricing_viewed` | A user views the subscription/pricing page — top of conversion funnel | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_checkout_started` | A user initiates the Stripe checkout flow for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | A subscription is successfully created (demo or real) | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | A user swaps from one subscription plan to another | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | A user is redirected to the Stripe billing portal to manage their subscription | `app/Http/Controllers/SubscriptionController.php` |
| `user_logged_out` | A user logs out of the application | `app/Livewire/Actions/Logout.php` |

## Next steps

To explore the data from these events, head to your PostHog project and build the following recommended insights:

- **Signup conversion funnel**: `pricing_viewed` → `subscription_checkout_started` → `subscription_created`
- **Signup trend**: Trend chart for `user_registered` and `user_signed_up_with_provider` over time
- **Login method breakdown**: Breakdown of `user_logged_in` vs `user_logged_in_with_provider`
- **Subscription churn signal**: Users who triggered `billing_portal_accessed` but not `subscription_plan_changed`
- **Plan change activity**: Trend of `subscription_plan_changed` with `plan_name` as breakdown property

Visit [https://us.posthog.com/project/2/insights](https://us.posthog.com/project/2/insights) to create these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
