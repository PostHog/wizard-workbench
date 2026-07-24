<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Laravel 12 SaaS application. A dedicated `PostHogService` class was created in `app/Services/` following the service-wrapper pattern, along with a `config/posthog.php` configuration file driven entirely by environment variables. The `posthog/posthog-php` SDK was installed via Composer. PostHog identity and event capture calls were added to six key user-facing flows: registration, password login, OAuth (Google Socialite) sign-in, logout, subscription checkout, and plan swapping. The `User` model was extended with a `getPostHogProperties()` helper for consistent person property payloads.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | A new user registers an account with email and password. | `resources/views/livewire/pages/auth/register.blade.php` |
| `user_logged_in` | An existing user logs in with their email and password credentials. | `resources/views/livewire/pages/auth/login.blade.php` |
| `user_logged_out` | A user ends their authenticated session by logging out. | `routes/auth.php` |
| `user_signed_in_oauth` | A user authenticates via an OAuth provider such as Google (includes `provider` and `is_new_user` properties). | `app/Http/Controllers/Auth/SocialiteController.php` |
| `subscription_checkout_started` | A user initiates checkout to subscribe to a paid plan. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | A subscribed user switches their active plan to a different tier. | `app/Http/Controllers/SubscriptionController.php` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902650)
- **Insight**: [User signups over time](https://us.posthog.com/project/483112/insights/EziOIrU3)
- **Insight**: [Signup to subscription funnel](https://us.posthog.com/project/483112/insights/a9H4ClZs)
- **Insight**: [Logins by method](https://us.posthog.com/project/483112/insights/Tf2U36jl)
- **Insight**: [Subscription checkouts over time](https://us.posthog.com/project/483112/insights/ygpxbk8m)
- **Insight**: [Active users retention](https://us.posthog.com/project/483112/insights/NMzbEfQv)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to `.env.example` and any CI/CD environment configuration so collaborators know what to set. (Already added to `.env.example` in this run.)
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
