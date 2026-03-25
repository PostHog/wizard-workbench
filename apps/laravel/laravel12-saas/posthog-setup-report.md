<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Laravel 12 SaaS application. Here's a summary of all changes made:

**New files created:**
- `config/posthog.php` — PostHog configuration using environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`)
- `app/Services/PostHogService.php` — Centralized service class wrapping `PostHog::capture()` and `PostHog::identify()` with disabled-flag support

**Modified files:**
- `app/Providers/AppServiceProvider.php` — Initializes PostHog on boot via `PostHog::init()` using config values
- `app/Livewire/Forms/LoginForm.php` — Identifies user and captures `user_logged_in` on successful email/password login
- `app/Livewire/Actions/Logout.php` — Captures `user_logged_out` before the session is invalidated
- `app/Http/Controllers/Auth/SocialiteController.php` — Identifies user and captures `user_registered_via_social` or `user_logged_in_via_social` on OAuth callback
- `app/Http/Controllers/SubscriptionController.php` — Captures `subscription_checkout_initiated`, `subscription_plan_swapped`, and `billing_portal_accessed`

**Environment variables set in `.env`:**
- `POSTHOG_PROJECT_TOKEN`
- `POSTHOG_HOST`
- `POSTHOG_DISABLED`

---

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticates with email/password | `app/Livewire/Forms/LoginForm.php` |
| `user_logged_out` | User logs out of the application | `app/Livewire/Actions/Logout.php` |
| `user_registered_via_social` | New user registers via a social OAuth provider | `app/Http/Controllers/Auth/SocialiteController.php` |
| `user_logged_in_via_social` | Existing user logs in via a social OAuth provider | `app/Http/Controllers/Auth/SocialiteController.php` |
| `subscription_checkout_initiated` | User initiates checkout for a subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_swapped` | User successfully swaps to a different subscription plan | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_accessed` | User is redirected to the Stripe billing portal | `app/Http/Controllers/SubscriptionController.php` |

---

## Next steps

Visit your PostHog project to explore the data and build insights. Suggested insights to create:

- **Login trend** — `user_logged_in` + `user_logged_in_via_social` over time
- **Social vs email registrations** — compare `user_registered_via_social` vs standard signup
- **Subscription checkout conversion funnel** — `subscription_checkout_initiated` → `subscription_plan_swapped`
- **Plan swap rate** — `subscription_plan_swapped` over time
- **Billing portal engagement** — `billing_portal_accessed` over time

[Open PostHog project →](https://us.posthog.com/project/238460)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
