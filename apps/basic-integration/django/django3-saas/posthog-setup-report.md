<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Django SaaS application. The Python SDK was installed, `PosthogContextMiddleware` was added to the Django middleware stack, and PostHog is initialised in `DashboardConfig.ready()` using environment variables. Events covering the full user lifecycle — registration, login/logout, profile updates, all billing flows, and project CRUD — were instrumented across three app modules with proper user identification on every event.

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user successfully registers an account | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs in | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out | `accounts/views.py` |
| `profile_updated` | Fired when a user updates their profile/settings | `accounts/views.py` |
| `subscription_started` | Fired when a user starts a new subscription (demo or Stripe checkout initiated) | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their subscription | `billing/views.py` |
| `plan_changed` | Fired when a user changes their subscription plan | `billing/views.py` |
| `checkout_completed` | Fired when a Stripe checkout webhook confirms payment success | `billing/views.py` |
| `payment_failed` | Fired when a Stripe invoice payment fails | `billing/views.py` |
| `project_created` | Fired when a user creates a new project | `dashboard/views.py` |
| `project_updated` | Fired when a user updates a project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to track key business metrics:

1. **Signup → Subscription funnel** — Funnel insight with steps: `user_registered` → `subscription_started` → `checkout_completed`. Reveals your activation conversion rate.
2. **New registrations over time** — Trend insight on `user_registered`. Track daily/weekly signup volume.
3. **Subscription churn** — Trend insight on `subscription_canceled`. Monitor cancellation rate and watch for spikes.
4. **Plan changes** — Trend insight on `plan_changed` broken down by `new_plan_name`. Understand upgrade vs downgrade behaviour.
5. **Project activity** — Trend insight comparing `project_created` and `project_deleted`. Signals user engagement depth.

Create the dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
