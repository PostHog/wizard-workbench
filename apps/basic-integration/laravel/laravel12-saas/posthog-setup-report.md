# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Laravel 12 SaaS application. The integration covers server-side event capture via the PHP SDK, user identification on login/signup/OAuth, error tracking via the global exception handler, a request-context middleware that correlates client and server events, and the PostHog JS snippet injected into both the authenticated and guest layouts for autocapture and session recording.

## Files created

| File | Purpose |
|------|---------|
| `config/posthog.php` | PostHog configuration (reads from env vars) |
| `app/Services/PostHogService.php` | Centralized service wrapping the PHP SDK |
| `app/Http/Middleware/PostHogRequestContext.php` | Reads `X-PostHog-Distinct-Id` / `X-PostHog-Session-Id` headers from the browser client to correlate client and server events |

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully registered via the email/password form. | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | An existing user successfully authenticated with password. | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_in_social` | A user authenticated or registered via a social OAuth provider (e.g. Google). | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | An authenticated user ended their session by logging out. | `app/Livewire/Actions/Logout.php` |
| `subscription_checkout_started` | A user initiated the Stripe checkout flow for a subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | A subscriber upgraded or downgraded to a different plan. | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_opened` | A user was redirected to the Stripe billing portal to manage their subscription. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_page_viewed` | A user viewed the pricing/plan selection page. | `app/Http/Controllers/SubscriptionController.php` |
| `profile_updated` | A user saved changes to their profile name or email address. | `resources/views/livewire/profile/update-profile-information-form.blade.php` |
| `account_deleted` | A user permanently deleted their account. | `resources/views/livewire/profile/delete-user-form.blade.php` |

## Additional integration details

- **AppServiceProvider**: PostHog PHP SDK is initialized once in the `boot()` method.
- **bootstrap/app.php**: Global exception handler reports all unhandled exceptions to PostHog with the authenticated user ID and request context.
- **PostHogRequestContext middleware**: Added to the `web` middleware group so every request can forward the client's PostHog session headers to server-side events.
- **Layouts** (`layouts/app.blade.php`, `layouts/guest.blade.php`): PostHog JS snippet injected in `<head>`. Authenticated users are immediately `identify`-d on page load using their database ID.
- **Identify calls**: Added to login (password + OAuth) and registration so the client distinct ID is linked to the server user ID.

## Next steps

To monitor user behaviour after deployment, create a dashboard in PostHog with insights such as:

- **Signup funnel**: `subscription_page_viewed` → `subscription_checkout_started` → (confirm conversion via Stripe webhook)
- **Plan swap rate**: unique users who trigger `subscription_plan_swapped`
- **Churn signal**: `billing_portal_opened` followed by plan cancellation
- **Daily active users**: unique users triggering any event per day
- **Account deletions**: trend of `account_deleted` events over time

Log in to [https://us.i.posthog.com](https://us.i.posthog.com), open project 483112, and navigate to **Dashboards → New dashboard** to build these.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to `.env.example` so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. (The JS snippet in the app layout already calls `identify` on every authenticated page load, covering returning visitors.)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
