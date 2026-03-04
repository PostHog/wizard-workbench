<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your FastAPI SaaS application.

## What was done

- **`posthog` SDK installed** and added to `requirements.txt`
- **Environment variables** set in `.env`: `POSTHOG_API_KEY` and `POSTHOG_HOST`
- **`app/config.py`** — added `posthog_api_key`, `posthog_host`, and `posthog_disabled` settings loaded from environment
- **`app/main.py`** — PostHog initialized in the lifespan startup (sets `posthog.api_key` and `posthog.host`), flushed on shutdown; `PostHogMiddleware` registered
- **`app/middleware.py`** — implemented a pure ASGI `PostHogMiddleware` that wraps every request in a `new_context()` and identifies authenticated users by their user ID
- **`app/routers/auth.py`** — added `user_signed_up`, `user_logged_in`, and `user_logged_out` events; login/signup use `new_context()` + `identify_context()` so the events are correctly tied to the user
- **`app/routers/generate.py`** — added `content_generated` (with generation_type, credits_used, credits_remaining, prompt_length) and `generation_failed_insufficient_credits` events
- **`app/routers/api_keys.py`** — added `api_key_created` and `api_key_revoked` events
- **`app/routers/settings.py`** — added `settings_updated` and `password_changed` events

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Triggered when a new user successfully creates an account | `app/routers/auth.py` |
| `user_logged_in` | Triggered when a user successfully logs in | `app/routers/auth.py` |
| `user_logged_out` | Triggered when a user logs out | `app/routers/auth.py` |
| `content_generated` | Triggered when AI content is successfully generated; includes generation_type and credits_used | `app/routers/generate.py` |
| `generation_failed_insufficient_credits` | Triggered when a generation request fails due to insufficient credits | `app/routers/generate.py` |
| `api_key_created` | Triggered when a user creates a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | Triggered when a user revokes an API key | `app/routers/api_keys.py` |
| `settings_updated` | Triggered when a user successfully updates their email in settings | `app/routers/settings.py` |
| `password_changed` | Triggered when a user successfully changes their password | `app/routers/settings.py` |

## Next steps

We've set up the events. To visualize them, create an **"Analytics basics"** dashboard in PostHog with these 5 recommended insights:

1. **User Signups Trend** — Trends insight on `user_signed_up` over time. Tracks new user acquisition.
2. **Login Trend** — Trends insight on `user_logged_in` over time. Monitors active engagement.
3. **Conversion Funnel** — Funnel insight: `user_signed_up` → `content_generated`. Shows how many new users go on to generate content.
4. **Churn Signal — Insufficient Credits** — Trends insight on `generation_failed_insufficient_credits`. High values indicate users hitting credit limits (upgrade opportunity).
5. **Content Generation by Type** — Trends insight on `content_generated` broken down by `generation_type` property. Shows which content types (blog, email, social) are most popular.

Create your dashboard here: [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
