<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Django SaaS application. The Python SDK was installed and configured to initialize via `accounts/apps.py` using Django's `AppConfig.ready()` hook. The `PosthogContextMiddleware` was added to `MIDDLEWARE` in `config/settings.py` to automatically capture session/user context on every request. Event tracking was added across the three core apps — accounts, billing, and dashboard — covering the full user lifecycle from registration through subscription management and project activity. Users are identified via `identify_context()` on login and signup so backend events are linked to the correct person profile.

| Event Name | Description | File |
|---|---|---|
| `user_registered` | A new user completes registration and their account is created. | `accounts/views.py` |
| `user_logged_in` | An existing user successfully authenticates and logs in. | `accounts/views.py` |
| `user_logged_out` | An authenticated user ends their session by logging out. | `accounts/views.py` |
| `profile_updated` | A user saves changes to their profile settings. | `accounts/views.py` |
| `pricing_viewed` | A visitor views the pricing page, the top of the subscription conversion funnel. | `billing/views.py` |
| `subscription_started` | A user successfully subscribes to a paid plan. | `billing/views.py` |
| `subscription_changed` | A subscriber switches from one plan to another. | `billing/views.py` |
| `subscription_canceled` | A subscriber cancels their active subscription. | `billing/views.py` |
| `checkout_completed` | A Stripe checkout session completes and a subscription is activated. | `billing/views.py` |
| `payment_failed` | A subscription payment attempt fails, putting the account into past-due status. | `billing/views.py` |
| `project_created` | A user successfully creates a new project in their dashboard. | `dashboard/views.py` |
| `project_updated` | A user saves edits to an existing project. | `dashboard/views.py` |
| `project_deleted` | A user permanently deletes one of their projects. | `dashboard/views.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1807626)
- [New User Registrations (wizard)](https://us.posthog.com/project/483112/insights/rh2pvKxH)
- [Pricing to Subscription Funnel (wizard)](https://us.posthog.com/project/483112/insights/embOSIsu)
- [New Subscriptions (wizard)](https://us.posthog.com/project/483112/insights/yQrN4S7a)
- [Subscription Cancellations (wizard)](https://us.posthog.com/project/483112/insights/KTVDdImf)
- [Project Activity (wizard)](https://us.posthog.com/project/483112/insights/HUUIQRsm)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. Consider identifying on each authenticated page load or relying on the `PosthogContextMiddleware` fallback (which uses Django's authenticated user pk automatically).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
