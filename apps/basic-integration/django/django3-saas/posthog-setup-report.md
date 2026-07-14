# PostHog post-wizard report

The wizard has completed a Django server-side PostHog integration covering authentication, billing, Stripe webhook processing, and project lifecycle actions. It installed the Python SDK, initialized a shared PostHog client from environment variables, enabled Django request context middleware plus exception autocapture, and added capture/set calls in the main business flows so user and subscription activity can be analyzed in PostHog.

| Event name | Description | File |
| --- | --- | --- |
| user_registered | Captures when a visitor successfully creates an account and is signed in. | `accounts/views.py` |
| user_logged_in | Captures when an existing user successfully logs into the application. | `accounts/views.py` |
| user_logged_out | Captures when an authenticated user signs out of the application. | `accounts/views.py` |
| profile_updated | Captures when a signed-in user saves changes to account settings. | `accounts/views.py` |
| subscription_checkout_started | Captures when a user starts a subscription checkout flow for a plan. | `billing/views.py` |
| subscription_activated | Captures when a subscription becomes active through demo mode or Stripe completion. | `billing/views.py` |
| subscription_plan_changed | Captures when a user successfully switches to a different subscription plan. | `billing/views.py` |
| subscription_canceled | Captures when a user cancels an active subscription. | `billing/views.py` |
| billing_portal_opened | Captures when a user opens the billing self-serve portal. | `billing/views.py` |
| billing_webhook_processed | Captures when a Stripe webhook is successfully processed by the server. | `billing/views.py` |
| payment_failed | Captures when Stripe reports a failed invoice payment for a subscription. | `billing/views.py` |
| project_created | Captures when a user successfully creates a new project. | `dashboard/views.py` |
| project_updated | Captures when a user saves edits to an existing project. | `dashboard/views.py` |
| project_deleted | Captures when a user deletes a project. | `dashboard/views.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1846686)
- Insight: [New accounts (wizard)](https://us.posthog.com/project/483112/insights/dUN15V4M)
- Insight: [Registrations to activations funnel (wizard)](https://us.posthog.com/project/483112/insights/LtJC8GOZ)
- Insight: [Subscription lifecycle events (wizard)](https://us.posthog.com/project/483112/insights/qdGYF90J)
- Insight: [Project lifecycle events (wizard)](https://us.posthog.com/project/483112/insights/6n8G9M3O)
- Insight: [Checkout starts by plan (wizard)](https://us.posthog.com/project/483112/insights/r1A9zcR2)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
