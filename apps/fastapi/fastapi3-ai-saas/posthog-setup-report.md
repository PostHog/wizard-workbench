<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this FastAPI AI SaaS project. Here is a summary of all changes made:

- **`requirements.txt`** — Added `posthog>=3.0.0` dependency.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.
- **`app/config.py`** — Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` settings fields loaded from environment variables.
- **`app/main.py`** — Imported `posthog` and `PostHogMiddleware`; initialized PostHog in the lifespan startup (sets `api_key`, `host`, `debug`) and flushes events on shutdown. Added `PostHogMiddleware` to the app.
- **`app/middleware.py`** — Implemented `PostHogMiddleware` as a pure ASGI middleware that wraps every HTTP request in a `new_context()`, identifies authenticated users via their session cookie, and tags their current credit balance.
- **`app/routers/auth.py`** — Added `user_signed_up` (with `signup_method` and `initial_credits`), `user_logged_in` (with `login_method`), and `user_logged_out` events. New users are identified via `identify_context` and their person properties are set with `posthog.set` on signup.
- **`app/routers/generate.py`** — Added `content_generated` event (with `generation_type`, `credits_used`, `credits_remaining`, `prompt_length`) on successful AI generation, and `generation_failed_insufficient_credits` event (with `generation_type`, `credits_needed`, `credits_available`) when a request is rejected.
- **`app/routers/api_keys.py`** — Added `api_key_created` (with `active_key_count`) and `api_key_revoked` events.
- **`app/routers/settings.py`** — Added `settings_updated` (with `field_changed: "email"`) and `password_changed` events.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user completes registration | `app/routers/auth.py` |
| `user_logged_in` | Fired when a user successfully logs in | `app/routers/auth.py` |
| `user_logged_out` | Fired when a user logs out | `app/routers/auth.py` |
| `content_generated` | Fired when AI content is successfully generated; includes `generation_type` and `credits_used` | `app/routers/generate.py` |
| `generation_failed_insufficient_credits` | Fired when a generation request is rejected due to insufficient credits | `app/routers/generate.py` |
| `api_key_created` | Fired when the user creates a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when the user revokes an API key | `app/routers/api_keys.py` |
| `settings_updated` | Fired when the user updates their account email | `app/routers/settings.py` |
| `password_changed` | Fired when the user successfully changes their password | `app/routers/settings.py` |

## Next steps

We've set up the analytics contract. Head to your PostHog project to build insights and a dashboard based on the events we just instrumented. Here are five recommended insights to create:

1. **Signup → First generation funnel** — Funnel insight with steps: `user_signed_up` → `content_generated`. Tracks how many new users go on to use the core product feature.
   [Create insight](https://us.posthog.com/project/238460/insights/new?insight=FUNNELS)

2. **Content generated over time (by type)** — Trends insight for `content_generated`, broken down by `generation_type` (blog, email, social). Shows which content types are most popular.
   [Create insight](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

3. **Credit exhaustion rate** — Trends insight for `generation_failed_insufficient_credits` vs `content_generated`. High ratio signals users are hitting paywalls and may need a credit top-up nudge.
   [Create insight](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

4. **New signups over time** — Trends insight for `user_signed_up`. Core acquisition metric.
   [Create insight](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

5. **API key adoption** — Trends insight for `api_key_created` unique users. Tracks how many users integrate programmatically (a strong power-user signal).
   [Create insight](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

[Open PostHog project dashboard](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
