<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The integration covers the full user lifecycle — sign-up, login, logout, social auth via Google — and the core SaaS conversion funnel — subscription page views, checkout initiation, plan creation, plan swaps, and billing portal access.

A dedicated `PostHogService` class was created in `app/Services/` following the Laravel service pattern, wrapping the PostHog PHP SDK with `identify`, `capture`, `captureException`, `isFeatureEnabled`, and `getFeatureFlagPayload` methods. A `getPostHogProperties()` helper was added to the `User` model to keep person property definitions in one place. Configuration is managed via `config/posthog.php` backed by environment variables.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user completes email/password registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User authenticates via email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_out` | User logs out of the application | `routes/auth.php` |
| `social_login_completed` | User authenticates or registers via OAuth (Google), includes `is_new_user` flag | `app/Http/Controllers/Auth/SocialiteController.php` |
| `dashboard_viewed` | Authenticated user loads the dashboard, includes subscription status | `app/Livewire/Dashboard.php` |
| `subscription_page_viewed` | User views the subscription/pricing page, includes whether they already have a subscription | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_checkout_started` | User initiates plan checkout (Stripe or demo mode) | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | Demo subscription created when Stripe is not configured | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_swapped` | Existing subscriber changes their plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User is redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |

## Next steps

Create a dashboard named **"Analytics basics (wizard)"** in PostHog to monitor these events. Suggested insights:

1. **Sign-up conversion funnel** — `subscription_page_viewed` → `subscription_checkout_started` → `subscription_created` / `subscription_swapped`
2. **Sign-ups over time** — trend of `user_signed_up` and `social_login_completed` (filter `is_new_user = true`)
3. **Login method breakdown** — `user_logged_in` and `social_login_completed` broken down by `login_method` / `provider`
4. **Subscription events** — trend of `subscription_checkout_started`, `subscription_created`, `subscription_swapped`
5. **Churn signal** — trend of `user_logged_out` vs `dashboard_viewed` to spot drop-off

[Create a new dashboard](https://us.posthog.com/project/2/dashboard) | [Create a new insight](https://us.posthog.com/project/2/insights/new)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to `.env.example` and any CI/CD bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — `user_logged_in` and `social_login_completed` both call `identify`, but verify that any session-resume paths (e.g. remember-me tokens, middleware-based auth) also re-identify the user so returning sessions are not left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
