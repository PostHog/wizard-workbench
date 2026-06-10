# PostHog Setup Report — Django 3 SaaS

PostHog server-side analytics has been fully integrated into this Django 3 SaaS application with event capture, user identification, and global error tracking.

---

## What was installed and initialized

| Step | Detail |
|---|---|
| **Package** | `posthog>=3.0.0` added to `requirements.txt`; installed as `posthog 7.18.1` via pip |
| **Initialization** | `config/posthog.py` — single PostHog client instance, loaded on startup via `config/wsgi.py` |
| **Credentials** | `POSTHOG_API_KEY` and `POSTHOG_API_HOST` written to `.env` (never hardcoded) |

Import the shared client anywhere in the app:

```python
from config.posthog import posthog
```

---

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_registered` | User completed registration and was logged in | `accounts/views.py` |
| `profile_updated` | User saved changes to their profile/settings | `accounts/views.py` |
| `password_reset_requested` | User submitted the password reset form | `accounts/views.py` |
| `checkout_started` | User initiated a Stripe checkout session | `billing/views.py` |
| `subscription_created` | Subscription created in demo mode | `billing/views.py` |
| `plan_changed` | User changed their subscription plan | `billing/views.py` |
| `subscription_canceled` | User canceled their active subscription | `billing/views.py` |
| `billing_portal_accessed` | User redirected to Stripe billing portal | `billing/views.py` |
| `checkout_completed` | Stripe webhook confirmed successful checkout | `billing/views.py` |
| `payment_failed` | Stripe webhook reported a failed invoice payment | `billing/views.py` |
| `project_created` | User created a new project | `dashboard/views.py` |
| `project_updated` | User saved edits to an existing project | `dashboard/views.py` |
| `project_deleted` | User deleted a project | `dashboard/views.py` |

---

## User identification

**Wired.** `posthog.identify` is called at two identity-establishment points in `accounts/views.py`:

- **Login** — `CustomLoginView.form_valid`, fires after successful authentication
- **Registration** — `register` view, fires immediately after `login(request, user)`

Both calls use `distinct_id=str(user.id)` and pass `email`, `name`, and `company_name` as person properties. No logout reset was added — `reset()` is a client-side concept; the server-side SDK has no equivalent.

---

## Error tracking

Global exception tracking is handled by a Django middleware class: `config.middleware.PostHogExceptionMiddleware`.

- Registered as the **last entry** in `MIDDLEWARE` in `config/settings.py`
- Calls `posthog.capture_exception(exception, distinct_id)` for every unhandled exception
- Uses the authenticated user's ID as `distinct_id`, falling back to `"anonymous"`
- No per-view changes were needed — one middleware covers the entire application

---

## Dashboard

[B2B SaaS Product Metrics](https://us.posthog.com/project/2/dashboard/278481) — a pre-built template covering signup volumes, subscription conversion, and key feature usage, well-matched to the events instrumented here.

[All dashboards](https://us.posthog.com/project/2/dashboard)

---

## Build notes

One bug was found and fixed during the build verification step:

> **`config/posthog.py`** — the `Posthog` constructor was called with `api_key=` but the PostHog Python SDK (v7+) requires `project_api_key=`. This was corrected before verification.

No other conflicts. All 7 modified files passed Python syntax checks. All PostHog-touched modules import without errors. Django system check reported no issues.

---

## Next steps

1. **Run the app and trigger events.** Register a user, change a plan, create a project — then open the [Live Events](https://us.posthog.com/project/2/activity/explore) view to confirm events are arriving.

2. **Set credentials in production.** Ensure `POSTHOG_API_KEY` and `POSTHOG_API_HOST` are set in your production environment (the `.env` file is for local development only).

3. **Add frontend analytics (optional).** This integration is server-side only. To capture page views, clicks, and session recordings, add the [PostHog JS snippet](https://posthog.com/docs/libraries/js) to your base template.

4. **Configure session replay (optional).** Enable session recordings in [Project Settings](https://us.posthog.com/project/2/settings/environment-replay) to capture user sessions alongside your server events.

5. **Build a custom dashboard.** The instrumented events (auth, billing, projects) map cleanly to funnels and trends. Use the [B2B SaaS template](https://us.posthog.com/project/2/dashboard/278481) as a starting point or build from scratch at [Insights](https://us.posthog.com/project/2/insights).
