<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. The following changes were made:

- **`app/config.py`** — Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` settings loaded from environment variables via Pydantic Settings.
- **`app/main.py`** — Initializes PostHog in the lifespan startup using `posthog.api_key` and `posthog.host`, flushes on shutdown, and registers the `PostHogMiddleware`.
- **`app/middleware.py`** — New pure-ASGI `PostHogMiddleware` wraps every HTTP request in a PostHog context (`new_context()`). If the user is authenticated (via session cookie), it calls `identify_context(user_id)` and tags the email so all downstream `capture()` calls are attributed automatically.
- **`app/routers/auth.py`** — Added `user_logged_in` (with `login_method` property) and `user_signed_up` (with `signup_method` property) events on successful auth, plus `posthog.set()` to store the user's email as a person property. Added `user_logged_out` event on logout.
- **`app/routers/generate.py`** — Added `content_generated` event (with `generation_type`, `credits_used`, `credits_remaining`) on successful AI generation, and `content_generation_failed` event (with `generation_type`, `credits_needed`, `credits_available`, `reason`) when a user lacks credits.
- **`app/routers/api_keys.py`** — Added `api_key_created` (with `active_key_count`) and `api_key_revoked` events.
- **`app/routers/settings.py`** — Added `settings_updated` (with `field_changed`) when email is changed successfully, and `password_changed` when password is updated.
- **`requirements.txt`** — Added `posthog>=3.0.0`.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully registers | `app/routers/auth.py` |
| `user_logged_in` | Fired when a user successfully logs in | `app/routers/auth.py` |
| `user_logged_out` | Fired when a user logs out | `app/routers/auth.py` |
| `content_generated` | Fired on successful AI content generation; includes generation_type and credits_used | `app/routers/generate.py` |
| `content_generation_failed` | Fired when generation fails due to insufficient credits | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user revokes an API key | `app/routers/api_keys.py` |
| `settings_updated` | Fired when a user updates their account settings | `app/routers/settings.py` |
| `password_changed` | Fired when a user changes their password | `app/routers/settings.py` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these insights:

1. **Signup → Login conversion funnel** — Funnel from `user_signed_up` → `user_logged_in`
2. **Content generation volume** — Trend of `content_generated` broken down by `generation_type`
3. **Generation failures** — Trend of `content_generation_failed` to monitor credit exhaustion
4. **API key adoption** — Trend of `api_key_created` vs `api_key_revoked`
5. **User retention** — DAU/WAU based on `user_logged_in`

Visit your PostHog project to build these insights: https://us.posthog.com/project/238460/insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
