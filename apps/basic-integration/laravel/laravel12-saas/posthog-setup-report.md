# PostHog post-wizard report

PostHog server-side analytics was added to the Laravel application through a dedicated `PostHogService`. Configuration reads the project token, host, and enabled state from Laravel environment variables. Authentication and subscription lifecycle actions identify authenticated users with stable database IDs and capture business events with non-PII properties.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | A user successfully authenticates with the application. | `app/Livewire/Forms/LoginForm.php` |
| `user_logged_out` | An authenticated user ends their session. | `routes/auth.php` |
| `social_login_completed` | A user successfully completes authentication through a social provider. | `app/Http/Controllers/Auth/SocialiteController.php` |
| `subscription_checkout_started` | An authenticated user starts checkout for a selected subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_created` | A subscription is successfully created through the demo or Stripe checkout flow. | `app/Http/Controllers/SubscriptionController.php` |
| `subscription_plan_changed` | An authenticated user successfully changes their active subscription plan. | `app/Http/Controllers/SubscriptionController.php` |
| `billing_portal_opened` | An authenticated user opens the billing portal. | `app/Http/Controllers/SubscriptionController.php` |

## Next steps

Dashboard and notebook creation could not be completed because the PostHog MCP server was unavailable in this run.

## Verify before merging

- [ ] Install `posthog/posthog-php` with Composer and commit the updated Composer manifest and lockfile.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to `.env.example` for collaborators.
- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite and update any affected mocks or fixtures.
- [ ] Confirm the returning-visitor path identifies the authenticated user before capturing authenticated events.

### Agent skill

The installed integration skill is available in `.claude/skills/integration-laravel` for future agent development.
