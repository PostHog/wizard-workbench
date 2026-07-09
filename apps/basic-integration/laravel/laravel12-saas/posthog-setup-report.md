<wizard-report>
# PostHog post-wizard report

The wizard completed a Laravel + Livewire PostHog integration centered on server-side analytics. PostHog configuration was added to Laravel services config, SDK initialization was added in the application service provider, request context middleware was added for PostHog headers, and exception capture was wired into Laravel's bootstrap exception pipeline. User helpers were added to the User model for stable distinct IDs and person properties, environment variables were written locally, and business events were instrumented across authentication, dashboard usage, subscriptions, theme changes, profile visits, social login, and email verification flows.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Captures successful account creation from password signup and first-time social signup flows. | `resources/views/livewire/pages/auth/register.blade.php`, `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in` | Captures successful password login after authentication completes. | `resources/views/livewire/pages/auth/login.blade.php` |
| `social_login_started` | Captures authenticated starts of a social auth redirect flow. | `app/Http/Controllers/Auth/SocialiteController.php` |
| `social_login_completed` | Captures successful OAuth authentication callback completion. | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_out` | Captures logout before the authenticated session is invalidated. | `routes/auth.php` |
| `dashboard_viewed` | Captures authenticated dashboard visits with subscription context. | `app/Livewire/Dashboard.php` |
| `profile_viewed` | Captures visits to the authenticated profile/settings area. | `resources/views/profile.blade.php` |
| `subscription_page_viewed` | Captures visits to the subscription management page. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_checkout_started` | Captures when an authenticated user starts checkout for a plan. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_activated` | Captures successful subscription activation from demo checkout or plan swap flows. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_swap_requested` | Captures attempts to change an active subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_opened` | Captures billing portal launches by subscribers. | `app/Http/Controllers/SubscriptionController.php` |
| `theme_updated` | Captures theme preference changes stored in session. | `app/Http/Controllers/ThemeController.php` |
| `email_verified` | Captures successful email verification completion. | `app/Http/Controllers/Auth/VerifyEmailController.php` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825366
- Insight: Signup volume (wizard) — https://us.posthog.com/project/483112/insights/D1AWQaQN
- Insight: Subscription activations (wizard) — https://us.posthog.com/project/483112/insights/A5GD5ze4
- Insight: Signup to activation funnel (wizard) — https://us.posthog.com/project/483112/insights/SOWF4znT
- Insight: Login methods (wizard) — https://us.posthog.com/project/483112/insights/AfSmhDbk
- Insight: Billing engagement (wizard) — https://us.posthog.com/project/483112/insights/QWoDuG7K

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here to `.env.example` and any bootstrap/setup scripts so collaborators know what to set: `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED`.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
