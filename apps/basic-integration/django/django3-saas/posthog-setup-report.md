<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The Python SDK is initialized in `accounts/apps.py` via `AppConfig.ready()`, making it available throughout the application lifecycle. The `PosthogContextMiddleware` is added to `MIDDLEWARE` so every request automatically carries session and user context. Thirteen events spanning user authentication, billing, and project management are now captured across three apps.

| Event Name | Description | File |
|---|---|---|
| `user_registered` | A new user completes registration and creates an account | `accounts/views.py` |
| `user_logged_in` | A user successfully authenticates and logs into the app | `accounts/views.py` |
| `user_logged_out` | An authenticated user logs out of the app | `accounts/views.py` |
| `profile_settings_updated` | A user saves changes to their profile settings | `accounts/views.py` |
| `pricing_page_viewed` | A visitor views the pricing plans page (top of conversion funnel) | `billing/views.py` |
| `subscription_started` | A user initiates a new subscription to a plan (demo mode) | `billing/views.py` |
| `checkout_completed` | Stripe confirms a successful checkout and a subscription is created | `billing/views.py` |
| `subscription_plan_changed` | A user changes their active subscription to a different plan | `billing/views.py` |
| `subscription_canceled` | A user cancels their active subscription | `billing/views.py` |
| `payment_failed` | A Stripe invoice payment fails for a user's subscription | `billing/views.py` |
| `project_created` | A user creates a new project in the dashboard | `dashboard/views.py` |
| `project_updated` | A user edits and saves changes to an existing project | `dashboard/views.py` |
| `project_deleted` | A user permanently deletes a project from the dashboard | `dashboard/views.py` |

## Next steps

Five PostHog insights were created for project 483112 to monitor user behavior:

- [Signup to Subscription Funnel](https://us.i.posthog.com/project/483112/insights/9584891) — funnel from `user_registered` → `pricing_page_viewed` → `subscription_started`
- [Active Users Over Time](https://us.i.posthog.com/project/483112/insights/9584893) — trend of `user_logged_in` events
- [Subscription Cancellations](https://us.i.posthog.com/project/483112/insights/9584897) — trend of `subscription_canceled` events
- [Project Activity](https://us.i.posthog.com/project/483112/insights/9584898) — combined trend of `project_created`, `project_updated`, and `project_deleted`
- [Payment Failures](https://us.i.posthog.com/project/483112/insights/9584899) — trend of `payment_failed` events

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any other bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the login handler identifies users on fresh login, but returning sessions via Django's session auth (e.g. "remember me") should also be covered if applicable.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
