<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The Python SDK is installed and initialized via `AccountsConfig.ready()`, with `PosthogContextMiddleware` added to automatically wrap every request with session and user context. Twelve business-critical events are captured across authentication, billing, and the project dashboard, with users identified on login and registration. Exception tracking is wired into Stripe error paths.

| Event Name | Description | File |
|---|---|---|
| `pricing_viewed` | User viewed the pricing page, indicating intent to subscribe. | `billing/views.py` |
| `user_registered` | A new user completed registration and created an account. | `accounts/views.py` |
| `user_logged_in` | An existing user successfully logged in. | `accounts/views.py` |
| `user_logged_out` | A user logged out of their account. | `accounts/views.py` |
| `profile_updated` | A user updated their profile or account settings. | `accounts/views.py` |
| `subscription_initiated` | User submitted the subscribe form to start a new subscription. | `billing/views.py` |
| `subscription_created` | A subscription was successfully created (demo mode or via Stripe webhook). | `billing/views.py` |
| `plan_changed` | A user changed their subscription plan. | `billing/views.py` |
| `subscription_canceled` | A user canceled their active subscription. | `billing/views.py` |
| `payment_failed` | A payment for a subscription invoice failed. | `billing/views.py` |
| `project_created` | A user created a new project in the dashboard. | `dashboard/views.py` |
| `project_deleted` | A user deleted a project from the dashboard. | `dashboard/views.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818092)
- [Subscription conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/OeRNsiTm)
- [New registrations over time (wizard)](https://us.posthog.com/project/483112/insights/1YEZqUP4)
- [Subscription events over time (wizard)](https://us.posthog.com/project/483112/insights/ULeKcrSS)
- [Project activity (wizard)](https://us.posthog.com/project/483112/insights/CPptZrrU)
- [Subscription cancellations by plan (wizard)](https://us.posthog.com/project/483112/insights/M2AJcSyW)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any onboarding scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
