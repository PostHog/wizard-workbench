<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Django SaaS application. PostHog was added as a Python dependency, environment-based configuration was introduced for the project token and host, Django request context middleware was enabled, and a shared PostHog client was initialized in app startup with automatic shutdown flushing and exception autocapture. Server-side analytics and identification were then added across authentication, billing, subscription lifecycle, webhook handling, dashboard visits, and project CRUD flows.

| Event name | Description | File |
|---|---|---|
| user_registered | Captures successful account registration and initial identification. | `accounts/views.py` |
| user_logged_in | Captures successful account login for authenticated users. | `accounts/views.py` |
| user_logged_out | Captures authenticated logout requests before the session ends. | `accounts/views.py` |
| profile_updated | Captures successful profile settings updates. | `accounts/views.py` |
| checkout_started | Captures subscription checkout attempts with the selected plan. | `billing/views.py` |
| subscription_started | Captures successful subscription creation in Stripe or demo mode. | `billing/views.py` |
| subscription_plan_changed | Captures successful plan changes for existing subscriptions. | `billing/views.py` |
| subscription_canceled | Captures successful subscription cancellations. | `billing/views.py` |
| billing_portal_opened | Captures successful redirects into the billing self-service portal. | `billing/views.py` |
| stripe_webhook_processed | Captures processed Stripe webhook events for subscription lifecycle changes. | `billing/views.py` |
| dashboard_viewed | Captures visits to the authenticated dashboard overview. | `dashboard/views.py` |
| project_created | Captures successful project creation actions. | `dashboard/views.py` |
| project_updated | Captures successful project edits. | `dashboard/views.py` |
| project_deleted | Captures successful project deletions. | `dashboard/views.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1831000)
- Insight: [Registrations and logins (wizard)](https://us.posthog.com/project/483112/insights/VzLfymBg)
- Insight: [Subscription lifecycle (wizard)](https://us.posthog.com/project/483112/insights/YkGRMteW)
- Insight: [Project activity (wizard)](https://us.posthog.com/project/483112/insights/3kPMQ7EI)
- Insight: [Signup to subscription funnel (wizard)](https://us.posthog.com/project/483112/insights/c40vZDCx)
- Insight: [Plan changes and portal usage (wizard)](https://us.posthog.com/project/483112/insights/lAmwxwFe)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and optional `POSTHOG_DISABLED`) to onboarding/bootstrap documentation if teammates rely on additional setup entrypoints.
- [ ] Confirm the returning-visitor path also calls `identify`-equivalent person updates through the authenticated request flow, not only fresh signup or login.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
