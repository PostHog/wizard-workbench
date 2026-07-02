<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. Changes include:

- **`requirements.txt`** — Added `posthog>=3.0.0` dependency.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` environment variables.
- **`app/config.py`** — Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` fields to the `Settings` Pydantic model, loaded from environment variables.
- **`app/middleware.py`** — Implemented `PostHogMiddleware` (pure ASGI) that wraps every HTTP request in a `new_context()` and calls `identify_context()` for authenticated users, so all route handlers automatically have user context.
- **`app/main.py`** — Initialized PostHog (`posthog.api_key`, `posthog.host`) in the lifespan startup, calls `posthog.flush()` on shutdown, and registers `PostHogMiddleware`.
- **`app/routers/auth.py`** — Added `posthog.identify()` + `posthog.capture()` on login and signup; added `capture("user_logged_out")` on logout.
- **`app/routers/generate.py`** — Added `capture("content_generated")` on successful generation with type/credit metadata; added `capture("generation_failed")` when a user runs out of credits.
- **`app/routers/api_keys.py`** — Added `capture("api_key_created")` and `capture("api_key_revoked")`.
- **`app/routers/settings.py`** — Added `capture("settings_updated")` and `capture("password_changed")` on successful updates.
- **`app/routers/pages.py`** — Added `capture("dashboard_viewed")` with usage stats when the dashboard is loaded.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully creates an account. | `app/routers/auth.py` |
| `user_logged_in` | Fired when a user successfully authenticates with email and password. | `app/routers/auth.py` |
| `user_logged_out` | Fired when a user logs out of their session. | `app/routers/auth.py` |
| `content_generated` | Fired when AI content is successfully generated, recording type and credits used. | `app/routers/generate.py` |
| `generation_failed` | Fired when content generation fails due to insufficient credits. | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key. | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user deactivates an API key. | `app/routers/api_keys.py` |
| `settings_updated` | Fired when a user successfully updates their account settings. | `app/routers/settings.py` |
| `password_changed` | Fired when a user successfully changes their password. | `app/routers/settings.py` |
| `dashboard_viewed` | Fired when a user visits the main dashboard. | `app/routers/pages.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.i.posthog.com/project/483112/dashboard/1792362)
- [Signup & onboarding funnel](https://us.i.posthog.com/project/483112/insights/WeMKqc10)
- [Content generation volume by type](https://us.i.posthog.com/project/483112/insights/SNvFTKFK)
- [Generation failure rate](https://us.i.posthog.com/project/483112/insights/3XPwN0yC)
- [Active users (DAU)](https://us.i.posthog.com/project/483112/insights/KRxK0SCQ)
- [API key adoption](https://us.i.posthog.com/project/483112/insights/LB4tsj1t)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
