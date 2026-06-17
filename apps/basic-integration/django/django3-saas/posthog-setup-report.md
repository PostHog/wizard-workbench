# PostHog Setup Report

PostHog was installed, initialized, and fully instrumented in this Django SaaS app with server-side event capture, user identification, and error tracking.

---

## What was installed and initialized

| Step | Detail |
|------|--------|
| **SDK** | `posthog>=3.0.0` added to `requirements.txt`; resolved to **posthog 7.19.1** |
| **Init** | PostHog JS snippet injected into `templates/base.html` via a Django context processor (`config/context_processors.py`) |
| **Credentials** | `POSTHOG_PUBLIC_TOKEN` and `POSTHOG_HOST` written to `.env` — never hardcoded |
| **Server client** | Shared Python SDK client created at `config/posthog_client.py`, reads env vars at import time |
| **Build check** | `python manage.py check` — 0 issues; `pip install` — no conflicts |

---

## Events instrumented

| Event | What it measures | File |
|-------|-----------------|------|
| `user_registered` | New user completes registration and is logged in | `accounts/views.py` |
| `user_logged_in` | User successfully authenticates | `accounts/views.py` |
| `password_reset_requested` | User submits password reset form with email | `accounts/views.py` |
| `password_reset_completed` | User sets a new password via reset link | `accounts/views.py` |
| `profile_updated` | User saves changes to profile/settings | `accounts/views.py` |
| `checkout_initiated` | User redirected to Stripe Checkout to subscribe | `billing/views.py` |
| `subscription_started` | Subscription created in demo mode (no Stripe) | `billing/views.py` |
| `plan_changed` | User changes their existing subscription plan | `billing/views.py` |
| `subscription_canceled` | User cancels their active subscription | `billing/views.py` |
| `billing_portal_accessed` | User redirected to Stripe billing portal | `billing/views.py` |
| `checkout_completed` | Stripe webhook: `checkout.session.completed` received | `billing/views.py` |
| `payment_failed` | Stripe webhook: `invoice.payment_failed` received | `billing/views.py` |
| `project_created` | User successfully creates a new project | `dashboard/views.py` |
| `project_updated` | User saves changes to an existing project | `dashboard/views.py` |
| `project_deleted` | User deletes a project | `dashboard/views.py` |

All 15 events are server-side captures that fire on real action (form POST success), not page load. `distinct_id` is the numeric user ID; no PII is passed in event properties.

---

## User identification

**Wired.** `posthog.identify()` fires on every authenticated page load in `templates/base.html`, immediately after `posthog.init()`.

- **Distinct ID**: `user.pk` (stable numeric ID)
- **Person properties**: `email`, `name`, `username`, `company_name`
- **Reset on logout**: A cookie (`ph_identified=1`) tracks the authenticated state. On the first anonymous page load after logout, `posthog.reset()` is called once and the cookie is cleared.

---

## Error tracking

Two layers of error tracking are active:

| Layer | How |
|-------|-----|
| **Server-side** | `config/posthog_middleware.py` — Django `process_exception` middleware captures all unhandled exceptions as `$exception` events (type, message, stack trace, distinct_id) |
| **Client-side** | `capture_exceptions: true` in `posthog.init()` — wraps `window.onerror` and `window.onunhandledrejection` |

The middleware is the last entry in `MIDDLEWARE` in `config/settings.py`.

---

## Dashboard

No dashboard was created as part of this run. See **Next steps** below.

---

## Build conflicts

None. `pip install -r requirements.txt` resolved cleanly. `python manage.py check` reported 0 issues.

---

## Next steps

1. **Start the app and verify events** — log in, create a project, trigger a subscription, then open [PostHog Live Events](https://us.posthog.com/project/2/activity/explore) to confirm events are arriving.

2. **Build a dashboard** — open [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) and create one for your key metrics: signups, subscription conversions (`checkout_initiated` → `subscription_started`), and churn (`subscription_canceled`).

3. **Set up a funnel** — use the events `checkout_initiated` → `checkout_completed` to measure Stripe conversion. Add `subscription_canceled` as a separate retention insight.

4. **Review error tracking** — visit [PostHog Error Tracking](https://us.posthog.com/project/2/error_tracking) after your first app errors to confirm the server-side middleware is delivering exceptions correctly.

5. **Set the `POSTHOG_HOST` in production** — ensure your production `.env` (or environment) has both `POSTHOG_PUBLIC_TOKEN=sTMFPsFhdP1Ssg` and `POSTHOG_HOST=https://us.i.posthog.com` set before deploying.
