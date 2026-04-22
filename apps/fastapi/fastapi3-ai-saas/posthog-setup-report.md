<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Acme AI FastAPI application. Here is a summary of all changes made:

**New files:**
- `app/analytics.py` — Initializes the PostHog `Posthog` client instance using environment variables, with `enable_exception_autocapture=True` and `atexit` shutdown registration.

**Modified files:**
- `requirements.txt` — Added `posthog>=3.0.0` dependency.
- `app/config.py` — Added `posthog_api_key` and `posthog_host` Pydantic settings fields.
- `app/main.py` — Imported the PostHog client and added `posthog_client.flush()` in the lifespan shutdown handler to ensure all queued events are sent on app exit.
- `app/routers/auth.py` — Tracks `user_logged_in`, `login_failed`, `user_signed_up`, and `user_logged_out` events with user identification.
- `app/routers/generate.py` — Tracks `content_generated` (with generation type, credits used, and prompt length) and `generation_failed` (with failure reason and credits state).
- `app/routers/api_keys.py` — Tracks `api_key_created` (with key name and active count) and `api_key_revoked`.
- `app/routers/settings.py` — Tracks `profile_updated` (when email changes) and `password_changed`.

All events use `new_context()` + `identify_context(str(user.id))` to link server-side events to the correct user profile. The `posthog` package is added to `requirements.txt` and the PostHog credentials are stored in `.env`.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully completes registration | `app/routers/auth.py` |
| `user_logged_in` | Fired when a user successfully authenticates | `app/routers/auth.py` |
| `login_failed` | Fired when a login attempt fails due to invalid credentials | `app/routers/auth.py` |
| `user_logged_out` | Fired when a user explicitly logs out | `app/routers/auth.py` |
| `content_generated` | Fired when AI content is successfully generated; tracks generation_type and credits_used | `app/routers/generate.py` |
| `generation_failed` | Fired when generation fails due to insufficient credits | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user revokes/deactivates an API key | `app/routers/api_keys.py` |
| `password_changed` | Fired when a user successfully changes their password | `app/routers/settings.py` |
| `profile_updated` | Fired when a user successfully updates their profile email | `app/routers/settings.py` |

## Next steps

To monitor user behavior using the events just instrumented, create an "Analytics basics" dashboard in PostHog with insights like these:

- **Signup to Generation Funnel** — Funnel from `user_signed_up` → `content_generated` to measure activation rate
- **Content Generated Over Time** — Trend of `content_generated` broken down by `generation_type` property
- **Failed Generation Rate** — Trend of `generation_failed` alongside `content_generated` to track credit exhaustion
- **API Key Adoption** — Trend of `api_key_created` to understand developer engagement
- **Authentication Events** — Combined trend of `user_signed_up`, `user_logged_in`, and `login_failed`

You can create this dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
