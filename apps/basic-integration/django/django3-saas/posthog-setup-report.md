<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Django SaaS project with PostHog. It installed the Python SDK dependency, initialized PostHog in Django app startup using environment variables, added the Django context middleware, and instrumented key authenticated product, billing, and account-management flows. It also set person properties during signup, login, and settings updates, while keeping event properties free of direct personal data.

| Event name | Description | File |
| --- | --- | --- |
| user_signed_up | Tracks when a new account is created and the user is signed in. | `accounts/views.py` |
| user_logged_in | Tracks successful user logins. | `accounts/views.py` |
| settings_updated | Tracks when an authenticated user saves account settings. | `accounts/views.py` |
| checkout_started | Tracks when a user starts subscribing to a plan. | `billing/views.py` |
| subscription_created | Tracks when a subscription is successfully created in demo mode or after Stripe checkout. | `billing/views.py` |
| billing_portal_opened | Tracks when a user opens the billing portal. | `billing/views.py` |
| subscription_canceled | Tracks when a user cancels an active subscription. | `billing/views.py` |
| stripe_webhook_processed | Tracks successful processing of supported Stripe webhook events. | `billing/views.py` |
| dashboard_viewed | Tracks visits to the authenticated dashboard. | `dashboard/views.py` |
| project_created | Tracks creation of a new project. | `dashboard/views.py` |
| project_updated | Tracks project edits. | `dashboard/views.py` |
| project_deleted | Tracks project deletions. | `dashboard/views.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825317
- Insight: New signups (wizard) — https://us.posthog.com/project/483112/insights/XA4lALho
- Insight: Signup to subscription funnel (wizard) — https://us.posthog.com/project/483112/insights/Y8feFOye
- Insight: Subscriptions created by source (wizard) — https://us.posthog.com/project/483112/insights/4deKpGQy
- Insight: Project lifecycle events (wizard) — https://us.posthog.com/project/483112/insights/1pSKMDyR
- Insight: Subscription cancellations (wizard) — https://us.posthog.com/project/483112/insights/Ag0Tdmyz

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
