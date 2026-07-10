# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this FastAPI AI SaaS application (Acme AI). The following changes were made:

- **`app/config.py`** — Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` settings, loaded from environment variables via Pydantic Settings.
- **`app/middleware.py`** — Implemented a pure ASGI `PostHogMiddleware` class that wraps each request in a `new_context()`, automatically identifies authenticated users via their session cookie, and sets person properties (`is_active`, `credits`).
- **`app/main.py`** — Initializes PostHog (`posthog.api_key`, `posthog.host`, `posthog.debug`) on startup in the lifespan context manager, calls `posthog.flush()` on shutdown, and registers `PostHogMiddleware`.
- **`app/routers/auth.py`** — Captures `user_signed_up` (with `$set` person properties and `signup_method`), `user_logged_in` (with `$set` person properties), and `user_logged_out` events; users are identified via `identify_context` on login and signup.
- **`app/routers/generate.py`** — Captures `content_generated` (with `generation_type`, `credits_used`, `credits_remaining`, `prompt_length`) on success, and `content_generation_failed` (with `generation_type`, `credits_needed`, `credits_available`, `reason`) when a user runs out of credits.
- **`app/routers/api_keys.py`** — Captures `api_key_created` and `api_key_revoked` events with the key name.
- **`app/routers/settings.py`** — Captures `settings_updated` (with `field_changed: "email"`) and `password_changed` events.
- **`app/routers/pages.py`** — Captures `dashboard_viewed` with `credits_remaining` to mark the top of the engagement funnel.
- **`requirements.txt`** — Added `posthog>=3.0.0`.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user successfully registers an account. | `app/routers/auth.py` |
| `user_logged_in` | Fired when a user successfully authenticates via the login form. | `app/routers/auth.py` |
| `user_logged_out` | Fired when a user explicitly logs out of their session. | `app/routers/auth.py` |
| `content_generated` | Fired when AI content generation succeeds, capturing type and credit cost. | `app/routers/generate.py` |
| `content_generation_failed` | Fired when a generation attempt fails due to insufficient credits. | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key. | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user deactivates an existing API key. | `app/routers/api_keys.py` |
| `settings_updated` | Fired when a user successfully updates their account email. | `app/routers/settings.py` |
| `password_changed` | Fired when a user successfully changes their password. | `app/routers/settings.py` |
| `dashboard_viewed` | Fired when an authenticated user views their dashboard. | `app/routers/pages.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1829203)
- [Signup to first generation funnel (wizard)](https://us.posthog.com/project/483112/insights/Hnc1gtas) — Conversion funnel from signup to first content generation (30-day window)
- [Content generations by type (wizard)](https://us.posthog.com/project/483112/insights/XI93dSMd) — Daily bar chart of `content_generated` broken down by `generation_type` (blog / email / social)
- [New user signups over time (wizard)](https://us.posthog.com/project/483112/insights/FFOyUbbM) — Daily `user_signed_up` trend for the last 30 days
- [Credit exhaustion rate (wizard)](https://us.posthog.com/project/483112/insights/18AIsHCZ) — Daily count of `content_generation_failed` events — a spike here signals users hitting credit limits and a potential upgrade/churn opportunity
- [Daily active users (wizard)](https://us.posthog.com/project/483112/insights/Vn60rFvm) — Unique users logging in per day (DAU) over the last 30 days

Dashboard subscription and alerts were skipped — the interactive prompt tool was unavailable. To set these up yourself, visit the dashboard and use the "Subscribe" and "Alerts" options in PostHog.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the middleware handles this for authenticated requests, but verify that session cookie parsing works correctly in all deployment environments.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
