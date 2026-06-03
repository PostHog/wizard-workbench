<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The integration covers server-side event tracking for all key business flows: user authentication (email/password and Google OAuth), subscription lifecycle (page views, checkout initiation, plan swaps), billing portal access, and logout. A dedicated `PostHogService` class centralises all PostHog calls, a request context middleware threads client-side session/distinct-ID headers into server-side events, and global exception reporting is wired into Laravel's bootstrap pipeline.

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | New user registers via the sign-up form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User authenticates with email and password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in_with_google` | User authenticates or registers via Google OAuth | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | User logs out of the application | `app/Livewire/Actions/Logout.php` |
| `subscription_page_viewed` | User views the subscription / pricing page | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_checkout_started` | User initiates checkout for a plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | User upgrades or downgrades their active plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_visited` | User is redirected to the Stripe billing portal | `app/Actions/Billing/RedirectToBillingPortal.php` |

## Files created

- `config/posthog.php` — PostHog configuration (reads from env vars)
- `app/Services/PostHogService.php` — centralised service wrapper
- `app/Http/Middleware/PostHogRequestContext.php` — propagates client-side headers

## Files modified

- `app/Providers/AppServiceProvider.php` — initialises PostHog on boot
- `bootstrap/app.php` — registers middleware and global exception reporting
- `app/Models/User.php` — adds `getPostHogProperties()` helper
- `app/Livewire/Actions/Logout.php` — captures `user_logged_out`
- `resources/views/livewire/pages/auth/login.blade.php` — captures `user_logged_in` and identifies user
- `resources/views/livewire/pages/auth/register.blade.php` — captures `user_registered` and identifies user
- `app/Http/Controllers/Auth/SocialiteController.php` — captures `user_logged_in_with_google`
- `app/Http/Controllers/SubscriptionController.php` — captures subscription events
- `app/Actions/Billing/RedirectToBillingPortal.php` — captures `billing_portal_visited`

## Next steps

The PostHog MCP API key used during this session does not have `dashboard:write` or `query:read` scopes, so the dashboard could not be created automatically. To build the recommended "Analytics basics" dashboard in PostHog, create the following insights and add them to a new dashboard:

1. **Registration funnel** — Funnel: `subscription_page_viewed` → `subscription_checkout_started` → (Stripe webhook confirms subscription active). Shows conversion from pricing page to paid customer.
2. **Login method breakdown** — Trends of `user_logged_in` and `user_logged_in_with_google`, broken down by `login_method`. Shows which auth method is most popular.
3. **New registrations over time** — Trend of `user_registered`. Monitor growth.
4. **Plan swap activity** — Trend of `subscription_plan_swapped` with breakdown by `new_plan_name`. Monitor upgrade/downgrade behaviour.
5. **Churn signal** — Trend of `user_logged_out` alongside active user count. A spike in logouts without a matching registration trend can indicate churn risk.

[Create a new dashboard in PostHog](/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
