# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Acme AI FastAPI SaaS application. The following changes were made:

- **`requirements.txt`** — Added `posthog>=3.0.0` dependency.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.
- **`app/config.py`** — Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` Pydantic Settings fields.
- **`app/main.py`** — Initialized PostHog (`posthog.api_key`, `posthog.host`) in the lifespan startup, calls `posthog.flush()` on shutdown, and wired in `PostHogMiddleware`.
- **`app/middleware.py`** — Implemented a pure ASGI `PostHogMiddleware` that wraps every HTTP request in a PostHog context (`new_context()`) and automatically identifies authenticated users via `identify_context()` and `tag()` using the session cookie.
- **`app/routers/auth.py`** — Identifies users on login and signup with `identify_context()` + `tag()`, and captures `user_signed_up`, `user_logged_in`, and `user_logged_out`.
- **`app/routers/generate.py`** — Captures `content_generated` (with type, credits used, and prompt length) and `credits_exhausted` (when a user has insufficient credits). Wraps the generation logic with `posthog.capture_exception()` for error tracking.
- **`app/routers/api_keys.py`** — Captures `api_key_created` and `api_key_revoked`.
- **`app/routers/settings.py`** — Captures `settings_updated` and `password_changed`.
- **`app/routers/pages.py`** — Captures `dashboard_viewed` with credits remaining and total generation count.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully created an account. | `app/routers/auth.py` |
| `user_logged_in` | An existing user successfully authenticated. | `app/routers/auth.py` |
| `user_logged_out` | A user ended their session. | `app/routers/auth.py` |
| `content_generated` | A user successfully generated AI content. | `app/routers/generate.py` |
| `credits_exhausted` | A generation request was rejected because the user had insufficient credits. | `app/routers/generate.py` |
| `api_key_created` | A user created a new API key. | `app/routers/api_keys.py` |
| `api_key_revoked` | A user deactivated an existing API key. | `app/routers/api_keys.py` |
| `settings_updated` | A user successfully updated their account settings. | `app/routers/settings.py` |
| `password_changed` | A user successfully changed their password. | `app/routers/settings.py` |
| `dashboard_viewed` | A user viewed their main dashboard. | `app/routers/pages.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1807601)
- [New Signups & Logins](https://us.posthog.com/project/483112/insights/dUzJeGBi)
- [Content Generations by Type](https://us.posthog.com/project/483112/insights/EIs0T03m)
- [Signup to First Generation Funnel](https://us.posthog.com/project/483112/insights/1lfG53Vi)
- [Credits Exhausted (Churn Signal)](https://us.posthog.com/project/483112/insights/oMRMUrg4)
- [API Key Activity](https://us.posthog.com/project/483112/insights/8QA9Z0m7)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the middleware handles this for all authenticated requests, but verify session cookie parsing works correctly in your deployment environment.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
