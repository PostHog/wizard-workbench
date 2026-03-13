<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS project. The following changes were made:

- **`app/config.py`**: Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` settings to the Pydantic Settings class, loaded from environment variables.
- **`app/middleware.py`**: Added `PostHogMiddleware` — a pure ASGI middleware that wraps every HTTP request in a PostHog context. If the user is authenticated (via session cookie), it calls `identify_context(user.id)` and tags their credit balance so all `capture()` calls in route handlers are automatically attributed to the right user.
- **`app/main.py`**: Added PostHog initialization in the lifespan startup (`posthog.api_key`, `posthog.host`, `posthog.debug`) and a flush on shutdown. Added `PostHogMiddleware` to the application.
- **`app/routers/auth.py`**: Added `user_logged_in` event on successful login and `user_signed_up` event on successful signup, with `identify_context` calls to link events to users.
- **`app/routers/generate.py`**: Added `content_generated` event after successful AI content generation (with type, credits used/remaining, prompt length) and `insufficient_credits` event when a generation attempt is blocked.
- **`app/routers/api_keys.py`**: Added `api_key_created` event (with active key count) and `api_key_revoked` event.
- **`app/routers/settings.py`**: Added `settings_updated` event when email is changed and `password_changed` event when password is updated.
- **`requirements.txt`**: Added `posthog>=3.0.0` dependency.
- **`.env`**: Set `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED`.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `app/routers/auth.py` |
| `user_logged_in` | User successfully authenticated with email and password | `app/routers/auth.py` |
| `content_generated` | User successfully generated AI content (blog, email, or social) | `app/routers/generate.py` |
| `insufficient_credits` | User attempted to generate content but lacked sufficient credits | `app/routers/generate.py` |
| `api_key_created` | User created a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | User revoked an existing API key | `app/routers/api_keys.py` |
| `settings_updated` | User updated their account settings (email) | `app/routers/settings.py` |
| `password_changed` | User successfully changed their password | `app/routers/settings.py` |

## Next steps

To visualize these events, create an **"Analytics basics"** dashboard in your PostHog project with the following suggested insights:

- **Signup funnel**: `user_signed_up` → `content_generated` (conversion from sign-up to first use)
- **Content generation volume**: Trend of `content_generated` broken down by `generation_type` property
- **Credit exhaustion rate**: Trend of `insufficient_credits` (churn risk signal)
- **API key adoption**: Trend of `api_key_created` (power user indicator)
- **Retention**: `user_logged_in` unique users over time (daily/weekly active users)

Visit your PostHog project to create this dashboard: [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
