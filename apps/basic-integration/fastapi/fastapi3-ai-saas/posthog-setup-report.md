<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. The following changes were made:

- **`requirements.txt`** — Added `posthog>=3.0.0` dependency.
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` environment variables.
- **`app/config.py`** — Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` fields to the `Settings` Pydantic model so all PostHog config is loaded from environment variables.
- **`app/main.py`** — Imported `PostHogMiddleware` and registered it on the app. In the `lifespan` context manager, PostHog is initialized on startup (`posthog.api_key`, `posthog.host`) and flushed on shutdown (`posthog.flush()`).
- **`app/middleware.py`** — Implemented `PostHogMiddleware` (pure ASGI) that wraps every HTTP request in a PostHog context (`new_context()`). When the session cookie is valid, it calls `identify_context(user.email)` so all route-level `capture()` calls are automatically attributed to the authenticated user.
- **`app/routers/auth.py`** — Added `posthog.identify()` and `capture("user_signed_up")` on signup, `posthog.identify()` and `capture("user_logged_in")` on successful login, and `capture("user_logged_out")` on logout.
- **`app/routers/generate.py`** — Added `capture("content_generated")` after a successful AI generation (with `generation_type`, `credits_used`, `credits_remaining`, `prompt_length` properties) and `capture("insufficient_credits")` when the user lacks credits (with `generation_type`, `credits_needed`, `credits_available` properties). Added `posthog.capture_exception()` around the capture call for error tracking.
- **`app/routers/api_keys.py`** — Added `capture("api_key_created")` after key creation (with `active_key_count`) and `capture("api_key_revoked")` after revocation.
- **`app/routers/settings.py`** — Added `capture("settings_updated")` when the user's email changes (with `fields_changed`) and `capture("password_changed")` on successful password change.
- **`app/routers/pages.py`** — Added `capture("dashboard_viewed")` when the dashboard loads (with `total_generations`, `credits_remaining`, `api_key_count`).

## Events

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user completes the signup form and creates an account. | `app/routers/auth.py` |
| `user_logged_in` | An existing user successfully authenticates and logs in. | `app/routers/auth.py` |
| `user_logged_out` | A user ends their session by logging out. | `app/routers/auth.py` |
| `content_generated` | A user successfully generates AI content, consuming credits. | `app/routers/generate.py` |
| `insufficient_credits` | A generation attempt fails because the user does not have enough credits. | `app/routers/generate.py` |
| `api_key_created` | A user creates a new API key for programmatic access. | `app/routers/api_keys.py` |
| `api_key_revoked` | A user revokes (deactivates) an existing API key. | `app/routers/api_keys.py` |
| `settings_updated` | A user updates their account settings such as email address. | `app/routers/settings.py` |
| `password_changed` | A user successfully changes their account password. | `app/routers/settings.py` |
| `dashboard_viewed` | A user views their dashboard, the top of the core engagement funnel. | `app/routers/pages.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- [Signup Conversion Funnel](https://us.posthog.com/project/483112/insights/zfMstq2U) — Funnel from `user_signed_up` → `content_generated`
- [Content Generation Trend](https://us.posthog.com/project/483112/insights/hz7bJD5K) — Daily total of `content_generated` events
- [Credit Exhaustion Events](https://us.posthog.com/project/483112/insights/8RZm4LVe) — `insufficient_credits` vs `content_generated` to monitor failure rate
- [API Key Adoption](https://us.posthog.com/project/483112/insights/AhECEGjv) — `api_key_created` vs `api_key_revoked` over time
- [Active User Engagement](https://us.posthog.com/project/483112/insights/cLkDPtV) — DAU trend across `dashboard_viewed`, `user_logged_in`, and `content_generated`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`) to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the middleware calls `identify_context` on every request for authenticated users, but verify this covers all session states including remember-me or token refresh flows.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
