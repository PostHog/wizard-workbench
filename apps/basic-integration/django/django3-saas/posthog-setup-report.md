<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Django SaaS application. The Python SDK is initialized via `accounts/apps.py` using `AppConfig.ready()`, which fires once when Django starts. The `PosthogContextMiddleware` is added to `MIDDLEWARE` so every HTTP request is automatically wrapped with PostHog context (session ID, distinct ID, URL, method, IP, user agent). Twelve business-critical events are now captured across three core modules — accounts, billing, and dashboard — with user identification on every event via `new_context()` + `identify_context()`.

| Event name | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user completes registration and their account is created. | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs into the application. | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out of the application. | `accounts/views.py` |
| `profile_updated` | Fired when a user saves changes to their profile settings. | `accounts/views.py` |
| `subscription_started` | Fired when a user subscribes to a paid plan (demo or Stripe mode). | `billing/views.py` |
| `checkout_completed` | Fired when a Stripe checkout session completes successfully via webhook. | `billing/views.py` |
| `plan_changed` | Fired when a user upgrades or downgrades their subscription plan. | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their active subscription. | `billing/views.py` |
| `payment_failed` | Fired via Stripe webhook when an invoice payment fails. | `billing/views.py` |
| `project_created` | Fired when a user successfully creates a new project. | `dashboard/views.py` |
| `project_updated` | Fired when a user saves edits to an existing project. | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project. | `dashboard/views.py` |

## Next steps

We've built a dashboard with five insights to monitor key user behavior:

- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1829164)
- **Insight:** [Registration to subscription funnel](https://us.posthog.com/project/483112/insights/Pb0rfEmw) — 30-day ordered funnel from `user_registered` → `subscription_started`
- **Insight:** [New registrations](https://us.posthog.com/project/483112/insights/bH1I2PJh) — daily bar chart of `user_registered` events over 30 days
- **Insight:** [Subscription cancellations](https://us.posthog.com/project/483112/insights/kStKKy6J) — daily bar chart of `subscription_canceled` events over 30 days
- **Insight:** [Subscriptions started vs canceled](https://us.posthog.com/project/483112/insights/RHnOlKql) — weekly line chart comparing `subscription_started` and `subscription_canceled` over 90 days
- **Insight:** [Project activity](https://us.posthog.com/project/483112/insights/8Ls3RvHg) — weekly bar chart of `project_created` vs `project_deleted` over 30 days

Dashboard subscription and alerts were not set up in this run because interactive prompts were unavailable. To set them up manually, go to the dashboard and use the **Subscribe** button to configure a weekly email digest, and use **Alerts** on the funnel and cancellation insights to get notified when conversion drops or churn spikes.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the `PosthogContextMiddleware` handles identification on most requests, but verify that sessions resumed after expiry still resolve to the correct distinct ID.
- [ ] Check that Stripe webhook events (`checkout_completed`, `payment_failed`) arrive and appear in PostHog — these fire from `_handle_checkout_completed` and `_handle_payment_failed` without a user session, so confirm the distinct IDs resolve correctly.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
