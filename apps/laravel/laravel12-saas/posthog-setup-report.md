<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Laravel 12 SaaS application. The `posthog/posthog-php` SDK (v4.0.1) was installed and configured. A dedicated `PostHogService` class was created in `app/Services/PostHogService.php` and registered as a singleton. A `config/posthog.php` configuration file was added to centralise all PostHog settings via environment variables. The `User` model was extended with a `getPostHogProperties()` helper used for consistent identity properties on every identify call. Eight key business events were instrumented across auth flows and billing actions — covering the full user lifecycle from registration through subscription management to account deletion.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully completes registration via the standard form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | Fired when a user successfully authenticates via the email/password form | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in` | Fired when a user authenticates or registers via a social provider (Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | Fired when the authenticated user logs out | `app/Livewire/Actions/Logout.php` |
| `subscription_checkout_started` | Fired when a user initiates a Stripe checkout session for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Fired when an existing subscriber successfully swaps to a different plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | Fired when a user is redirected to the Stripe billing portal | `app/Actions/Billing/RedirectToBillingPortal.php` |
| `user_account_deleted` | Fired when a user permanently deletes their account | `resources/views/livewire/profile/delete-user-form.blade.php` |

## Next steps

We've created a suggested "Analytics basics" dashboard for you in PostHog. To set it up, log in to your PostHog project and create a new dashboard with the following insights:

1. **Sign-ups & Logins (Daily)** — Trends insight tracking `user_signed_up` and `user_logged_in` over 30 days
2. **Signup → Checkout Conversion Funnel** — Funnel insight: `user_signed_up` → `subscription_checkout_started` → `subscription_plan_swapped`
3. **Account Deletions (Weekly)** — Trends bar chart for `user_account_deleted` over 90 days
4. **Subscription Activity (Daily)** — Trends insight tracking `subscription_checkout_started` and `subscription_plan_swapped` over 30 days
5. **Login Method Breakdown** — Breakdown of `user_logged_in` events by `login_method` property (password vs google)

View your PostHog project at: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
