<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Acme AI, a FastAPI-based AI SaaS application. The following changes were made:

- **`requirements.txt`** — Added `posthog>=3.0.0` dependency.
- **`app/config.py`** — Added three new settings: `posthog_project_token`, `posthog_host`, and `posthog_disabled`, loaded from environment variables.
- **`app/posthog_client.py`** — New module that initializes a `Posthog` instance at module load time with `enable_exception_autocapture=True`. Registers `posthog_client.shutdown` with `atexit` for graceful flush on process exit.
- **`app/middleware.py`** — New `PostHogMiddleware` (pure ASGI) wraps every HTTP request in a `new_context()`. Authenticates the user from the session cookie and calls `identify_context(user.email)` so all downstream route events are attributed to the correct user automatically.
- **`app/main.py`** — Registered `PostHogMiddleware` on the app. Added `posthog_client.flush()` call in the lifespan shutdown to ensure all queued events are sent before the app exits.
- **`app/routers/auth.py`** — Added `user_signed_up` (with `$set` person properties and `credits_granted`), `user_logged_in`, and `user_logged_out` events. Login and signup use `new_context()` + `identify_context()` to associate events with the user at the moment of auth.
- **`app/routers/generate.py`** — Added `content_generated` (with `generation_type`, `credits_used`, `credits_remaining`, `prompt_length`) and `content_generation_failed` (with `reason: insufficient_credits`) events.
- **`app/routers/api_keys.py`** — Added `api_key_created` and `api_key_revoked` events.
- **`app/routers/settings.py`** — Added `settings_updated` (with `field_changed`) and `password_changed` events.
- **`app/routers/usage.py`** — Added `usage_stats_viewed` event with period and aggregate stats.
- **`app/routers/pages.py`** — Added `dashboard_viewed` event with `total_generations` and `api_key_count`.
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED`.
- **`.env.example`** — Added PostHog env var placeholders for collaborators.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully creates an account. | `app/routers/auth.py` |
| `user_logged_in` | Fired when a user successfully logs in with email and password. | `app/routers/auth.py` |
| `user_logged_out` | Fired when a user logs out of their session. | `app/routers/auth.py` |
| `content_generated` | Fired when a user successfully generates AI content, capturing type and credits used. | `app/routers/generate.py` |
| `content_generation_failed` | Fired when a content generation attempt fails due to insufficient credits. | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key. | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user revokes (deactivates) an API key. | `app/routers/api_keys.py` |
| `settings_updated` | Fired when a user successfully updates their account settings. | `app/routers/settings.py` |
| `password_changed` | Fired when a user successfully changes their password. | `app/routers/settings.py` |
| `usage_stats_viewed` | Fired when a user fetches their usage statistics and generation history. | `app/routers/usage.py` |
| `dashboard_viewed` | Fired when a user loads the dashboard page, marking the top of the retention funnel. | `app/routers/pages.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793484)
- [New Signups Over Time](https://us.posthog.com/project/483112/insights/VowQWhKo)
- [Content Generation by Type](https://us.posthog.com/project/483112/insights/9w6d48g9)
- [Credit Failures (Churn Signal)](https://us.posthog.com/project/483112/insights/secjpVd1)
- [Daily Active Users](https://us.posthog.com/project/483112/insights/yF6nAHPm)
- [API Key Adoption](https://us.posthog.com/project/483112/insights/LBxKLOgv)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`) to any monorepo bootstrap scripts or CI secrets so collaborators and CI runners know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
