<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The integration adds server-side event tracking and user identification across all critical user flows: authentication (email/password login, social OAuth login, registration, and logout), dashboard visits, subscription plan views, checkout initiation, plan swaps, and billing portal access.

A dedicated `PostHogService` wrapper was created in `app/Services/PostHogService.php` to centralize all PostHog SDK calls. A `config/posthog.php` configuration file was added to manage PostHog settings via environment variables. The `User` model was extended with a `getPostHogProperties()` helper method to consistently pass user attributes to PostHog. All PostHog credentials are read from environment variables — nothing is hardcoded.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fires when a new user completes email/password registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Fires when a user successfully authenticates via email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_signed_up` | Fires when a new user is created via social OAuth for the first time | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in` | Fires when an existing user authenticates via social OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | Fires when an authenticated user logs out | `routes/auth.php` |
| `dashboard_viewed` | Fires when an authenticated user views the main dashboard | `app/Livewire/Dashboard.php` |
| `subscription_page_viewed` | Fires when a user views the plan selection/subscription page | `app/Http/Controllers/SubscriptionController.php` |
| `checkout_started` | Fires when a user initiates checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `plan_swapped` | Fires when a subscribed user swaps to a different plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | Fires when a user is redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |

## New files

| File | Purpose |
|---|---|
| `app/Services/PostHogService.php` | Wrapper service for the PostHog PHP SDK |
| `config/posthog.php` | PostHog configuration (reads from env vars) |

## Modified files

| File | Change |
|---|---|
| `app/Models/User.php` | Added `getPostHogProperties()` helper |
| `resources/views/livewire/pages/auth/register.blade.php` | `identify` + `user_signed_up` after registration |
| `resources/views/livewire/pages/auth/login.blade.php` | `identify` + `user_logged_in` after password auth |
| `app/Http/Controllers/Auth/SocialiteController.php` | `identify` + `user_signed_up`/`user_logged_in` after OAuth callback |
| `routes/auth.php` | `user_logged_out` before session invalidation |
| `app/Livewire/Dashboard.php` | `dashboard_viewed` on mount |
| `app/Http/Controllers/SubscriptionController.php` | Four billing events across index/checkout/swap/portal methods |

## Next steps

To create a dashboard with insights for these events, visit [PostHog](https://us.posthog.com/project/2) and create:

1. **Signup funnel** — `user_signed_up` → `dashboard_viewed` → `subscription_page_viewed` → `checkout_started`
2. **Daily signups trend** — trends chart for `user_signed_up` over time, broken down by `signup_method`
3. **Login activity trend** — trends chart for `user_logged_in` over time, broken down by `login_method`
4. **Subscription conversions** — funnel from `subscription_page_viewed` → `checkout_started` → `plan_swapped`
5. **Churn signals** — trends chart for `user_logged_out` and `billing_portal_accessed`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current integration identifies on fresh login/signup; returning sessions that skip login will use anonymous distinct IDs until they log in again.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
