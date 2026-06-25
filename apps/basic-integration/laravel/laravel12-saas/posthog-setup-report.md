<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Laravel 12 SaaS application. The integration adds server-side event tracking and user identification across the full user lifecycle: registration, authentication (email/password and Google OAuth), subscription management (checkout, plan swaps, billing portal), and session activity.

A dedicated `PostHogService` class was created in `app/Services/` to wrap the PostHog PHP SDK, following the single-responsibility principle. All PostHog calls are routed through this service, which initialises the SDK once per process and respects the `POSTHOG_DISABLED` environment flag. A `getPostHogProperties()` helper was added to the `User` model to provide consistent person properties everywhere `identify()` is called.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully registers via the email/password form | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | An existing user successfully authenticates via email/password | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_out` | A user explicitly logs out of the application | `routes/auth.php` |
| `social_login_completed` | A user authenticates or registers via a social OAuth provider (Google) | `app/Http/Controllers/Auth/SocialiteController.php` |
| `email_verified` | A user successfully verifies their email address | `app/Http/Controllers/Auth/VerifyEmailController.php` |
| `subscription_checkout_started` | A user initiates checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | A subscribed user switches to a different plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | A user is redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |
| `dashboard_viewed` | A logged-in user views the main application dashboard | `app/Livewire/Dashboard.php` |
| `subscription_page_viewed` | A user views the subscription/pricing page listing available plans | `app/Http/Controllers/SubscriptionController.php` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1761158)
- [New User Signups](https://us.posthog.com/project/483112/insights/DsohQovr)
- [Subscription Checkout Funnel](https://us.posthog.com/project/483112/insights/DxlbNKID)
- [Login Methods](https://us.posthog.com/project/483112/insights/PBNoN25m)
- [Plan Upgrades/Swaps](https://us.posthog.com/project/483112/insights/AnCWbaR4)
- [Billing Portal Accesses](https://us.posthog.com/project/483112/insights/AQjCcVSb)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. Currently `identify` is called on every login and signup; verify it also fires for session restoration if needed.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
