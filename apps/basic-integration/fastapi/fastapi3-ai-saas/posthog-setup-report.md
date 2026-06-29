# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Acme AI. The following changes were made:

- **`requirements.txt`** — Added `posthog>=3.0.0` as a dependency.
- **`app/config.py`** — Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` fields to the Pydantic `Settings` class, loaded from environment variables.
- **`app/main.py`** — Initialized PostHog (`posthog.api_key`, `posthog.host`) in the FastAPI lifespan startup handler and added `posthog.flush()` on shutdown. Added `PostHogMiddleware` to the app.
- **`app/middleware.py`** — Implemented a pure ASGI `PostHogMiddleware` that wraps each HTTP request in a `new_context()`. Authenticated users are identified via `identify_context(user.email)` and tagged with `email` and `credits` so all route-level `capture()` calls carry the user context automatically.
- **`app/routers/auth.py`** — Added `user_signed_up` (with `identify_context` + `tag` in a fresh context), `user_logged_in` (with `posthog.identify`), and `user_logged_out` events.
- **`app/routers/generate.py`** — Added `content_generated` (with `generation_type`, `credits_used`, `credits_remaining`, `prompt_length`) and `generation_failed_insufficient_credits` (with `generation_type`, `credits_needed`, `credits_available`) events.
- **`app/routers/api_keys.py`** — Added `api_key_created` (with `key_name`, `active_key_count`) and `api_key_revoked` (with `key_name`) events.
- **`app/routers/settings.py`** — Added `settings_updated` (with `changed_field`) and `password_changed` events.
- **`app/routers/pages.py`** — Added `dashboard_viewed` (with `total_generations`, `credits_remaining`, `api_key_count`) event.
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` values.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account via the signup form. | `app/routers/auth.py` |
| `user_logged_in` | User successfully authenticated and started a new session. | `app/routers/auth.py` |
| `user_logged_out` | User ended their session by logging out. | `app/routers/auth.py` |
| `content_generated` | User successfully generated AI content, consuming credits. | `app/routers/generate.py` |
| `generation_failed_insufficient_credits` | Content generation was blocked because the user lacked sufficient credits. | `app/routers/generate.py` |
| `api_key_created` | User created a new API key for programmatic access. | `app/routers/api_keys.py` |
| `api_key_revoked` | User deactivated an existing API key. | `app/routers/api_keys.py` |
| `settings_updated` | User updated their account settings such as email address. | `app/routers/settings.py` |
| `password_changed` | User successfully changed their account password. | `app/routers/settings.py` |
| `dashboard_viewed` | User viewed the main dashboard showing their credits and generation history. | `app/routers/pages.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.i.posthog.com/project/483112/dashboard/1775064)
- [Signup to First Generation Funnel](https://us.i.posthog.com/project/483112/insights/15pOc5oz)
- [Content Generation Volume](https://us.i.posthog.com/project/483112/insights/suySDYeW)
- [Credit Exhaustion Events (Churn Signal)](https://us.i.posthog.com/project/483112/insights/L3EE7M7u)
- [Content Generations by Type](https://us.i.posthog.com/project/483112/insights/UzVYBmYT)
- [API Key Adoption (Power Users)](https://us.i.posthog.com/project/483112/insights/pby6Fzt5)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. The middleware handles this for subsequent requests, but verify that the `posthog.identify` call in the login handler fires before the session cookie is set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
