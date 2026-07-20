# PostHog post-wizard report

The wizard integrated the PostHog Python SDK into this Django application using environment-backed configuration, an application startup client, request context middleware, automatic exception capture, authenticated user identification, and server-side analytics for account, subscription, and project lifecycle actions. The SDK dependency was added to the project manifest, and Django's system check completed successfully.

| Event | Description | File |
|---|---|---|
| `user_registered` | A visitor successfully creates an account. | `accounts/views.py` |
| `user_logged_in` | A user successfully authenticates. | `accounts/views.py` |
| `user_logged_out` | An authenticated user ends their session. | `accounts/views.py` |
| `account_settings_updated` | A user successfully updates account settings. | `accounts/views.py` |
| `password_reset_requested` | A user submits a valid password reset request. | `accounts/views.py` |
| `checkout_started` | A user starts a subscription checkout flow. | `billing/views.py` |
| `subscription_created` | A subscription is successfully created in demo mode or from a payment webhook. | `billing/views.py` |
| `subscription_plan_changed` | A user successfully changes their subscription plan. | `billing/views.py` |
| `subscription_canceled` | A user cancels an active subscription. | `billing/views.py` |
| `subscription_payment_failed` | A payment failure webhook moves a subscription to past due. | `billing/views.py` |
| `project_created` | A user successfully creates a project. | `dashboard/views.py` |
| `project_updated` | A user successfully updates a project. | `dashboard/views.py` |
| `project_deleted` | A user permanently deletes a project. | `dashboard/views.py` |

## Next steps

Dashboard and insight creation could not be completed because the PostHog MCP server was unavailable during setup. Reconnect the configured PostHog MCP server, then create the `Analytics basics (wizard)` dashboard with signup-to-subscription conversion, checkout conversion, subscription churn, payment failures, and project activity insights based on the events above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the deployed values for `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to each runtime environment; the variable names are documented in `.env.example`.
- [ ] Confirm returning authenticated requests are associated with the Django user ID through the PostHog context middleware.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
