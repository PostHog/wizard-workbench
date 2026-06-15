<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The following changes were made:

- Installed `posthog/posthog-php` (v4.6.0) via Composer
- Created `config/posthog.php` — reads `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` from environment variables
- Created `app/Services/PostHogService.php` — a wrapper service with `identify()`, `capture()`, and `captureException()` methods, initialized once via the service container
- Added `getPostHogProperties()` to `app/Models/User.php` — returns `email`, `name`, `provider`, and `date_joined` as person properties
- Added PostHog env vars (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`) to `.env`
- Instrumented 10 events across 6 files covering auth, subscriptions, and the dashboard

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User completes email/password registration | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | User authenticates via email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_out` | User logs out | `routes/auth.php` |
| `social_login_completed` | User authenticates or signs up via OAuth (e.g. Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `subscribe_page_viewed` | Authenticated user views the subscription/pricing page | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_checkout_initiated` | User initiates a Stripe checkout session | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_demo_created` | Stub subscription created in demo mode (no Stripe) | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | Subscribed user switches to a different plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User is redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |
| `dashboard_viewed` | Authenticated user views the main dashboard | `app/Livewire/Dashboard.php` |

## Next steps

The PostHog API key used by the wizard does not have the `dashboard:write` or `query:read` scopes needed to create dashboards and insights programmatically. You can create the "Analytics basics (wizard)" dashboard manually at the links below.

**Suggested dashboard: Analytics basics (wizard)**

Create 5 insights to cover the key business metrics:

1. **Signup trend** — Trends chart for `user_signed_up` over time. [Create insight →](https://us.posthog.com/project/2/insights/new)
2. **Signup-to-subscription funnel** — Funnel from `user_signed_up` → `subscribe_page_viewed` → `subscription_checkout_initiated`. [Create insight →](https://us.posthog.com/project/2/insights/new)
3. **Active logins over time** — Trends chart for `user_logged_in` + `social_login_completed`. [Create insight →](https://us.posthog.com/project/2/insights/new)
4. **Plan swap rate** — Trends chart for `subscription_plan_swapped`, broken down by `new_plan_name`. [Create insight →](https://us.posthog.com/project/2/insights/new)
5. **Churn signal: logout rate** — Trends chart for `user_logged_out` vs `user_logged_in` to spot engagement drops. [Create insight →](https://us.posthog.com/project/2/insights/new)

[View all dashboards →](https://us.posthog.com/project/2/dashboard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to `.env.example` and any bootstrap or CI scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is called on login and signup, but a user who returns with an active session bypasses both. Consider calling `identify` in the `Dashboard::mount()` or a middleware for returning sessions.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
