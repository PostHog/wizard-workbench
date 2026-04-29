<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI application. Here is a summary of what was done:

**New files created or modified:**

- `app/config.py` — Added `posthog_api_key` and `posthog_host` settings fields sourced from environment variables.
- `app/middleware.py` — Implemented `PostHogMiddleware`, a pure ASGI middleware that wraps every HTTP request in a `new_context()`. For authenticated users, it calls `identify_context(str(user.id))` so that all events captured within a request are automatically linked to the correct user.
- `app/main.py` — Initialized PostHog (`posthog.api_key`, `posthog.host`) in the FastAPI lifespan startup hook and added `posthog.flush()` on shutdown. Registered `PostHogMiddleware` with the application.
- `app/routers/auth.py` — Added `user signed up`, `user logged in`, `login failed`, and `user logged out` events with `new_context()` + `identify_context()` calls on login and signup for proper user correlation.
- `app/routers/generate.py` — Added `content generated` (with generation type, credits used/remaining, and prompt length) and `content generation failed` (with credits needed/available) events.
- `app/routers/api_keys.py` — Added `api key created` (with active key count) and `api key revoked` events.
- `app/routers/settings.py` — Added `settings updated` (email field) and `password changed` events.
- `requirements.txt` — Added `posthog>=3.0.0`.
- `.env` — Set `POSTHOG_API_KEY` and `POSTHOG_HOST`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user signed up` | User created a new account via the signup form | `app/routers/auth.py` |
| `user logged in` | User authenticated successfully via the login form | `app/routers/auth.py` |
| `login failed` | User attempted login with invalid credentials | `app/routers/auth.py` |
| `user logged out` | User explicitly ended their session | `app/routers/auth.py` |
| `content generated` | AI content was successfully generated (blog, email, or social) | `app/routers/generate.py` |
| `content generation failed` | Generation blocked due to insufficient credits | `app/routers/generate.py` |
| `api key created` | User created a new programmatic API key | `app/routers/api_keys.py` |
| `api key revoked` | User deactivated an existing API key | `app/routers/api_keys.py` |
| `settings updated` | User changed their email address in settings | `app/routers/settings.py` |
| `password changed` | User successfully changed their password | `app/routers/settings.py` |

## Next steps

Build an **"Analytics basics"** dashboard in PostHog with these five recommended insights to monitor user behavior and conversion:

1. **Signup → Generate funnel** — Funnel insight: `user signed up` → `content generated`. Tracks how many new users go on to generate their first piece of content.
2. **Content generations by type** — Trends insight: `content generated` broken down by `generation_type` property. Shows the popularity of blog, email, and social posts over time.
3. **Credit exhaustion rate** — Trends insight: `content generation failed`. Tracks users hitting credit limits — a leading indicator of upgrade intent.
4. **API key lifecycle** — Trends insight: `api key created` and `api key revoked` on the same chart. Monitors developer engagement.
5. **Login health** — Trends insight: `user logged in` vs `login failed`. A spike in `login failed` events can indicate a brute-force attempt or UX friction.

Create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
