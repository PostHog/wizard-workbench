<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. The following changes were made:

- **`app/config.py`** — Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` settings to Pydantic Settings, loaded from environment variables.
- **`app/middleware.py`** — Created a pure ASGI `PostHogMiddleware` that wraps every HTTP request in a `new_context()`. If a session cookie is present, it identifies the user via `identify_context()` and tags their `is_active` status, so all downstream `capture()` calls are automatically attributed to the right user.
- **`app/main.py`** — Initializes PostHog on startup (`posthog.api_key`, `posthog.host`, `posthog.debug`) and calls `posthog.flush()` on shutdown. Registers `PostHogMiddleware` on the app.
- **`app/routers/auth.py`** — Calls `posthog.identify()` and `posthog.capture()` on successful login and signup; calls `capture("user_logged_out")` on logout.
- **`app/routers/generate.py`** — Captures `content_generated` on successful AI content generation; captures `generation_failed_insufficient_credits` when users are blocked by insufficient credits (key churn signal).
- **`app/routers/api_keys.py`** — Captures `api_key_created` when a new key is provisioned; captures `api_key_revoked` when a key is deactivated.
- **`app/routers/settings.py`** — Captures `settings_updated` when the user changes their email; captures `password_changed` on a successful password change.
- **`app/routers/pages.py`** — Captures `dashboard_viewed` with credit and generation counts as properties.
- **`requirements.txt`** — Added `posthog>=3.0.0`.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (gitignored).

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `app/routers/auth.py` |
| `user_logged_in` | User successfully authenticated and logged in | `app/routers/auth.py` |
| `user_logged_out` | User explicitly logged out | `app/routers/auth.py` |
| `content_generated` | User successfully generated AI content (blog, email, or social post) | `app/routers/generate.py` |
| `generation_failed_insufficient_credits` | User attempted to generate content but had insufficient credits | `app/routers/generate.py` |
| `api_key_created` | User created a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | User deactivated an API key | `app/routers/api_keys.py` |
| `settings_updated` | User updated their account email in settings | `app/routers/settings.py` |
| `password_changed` | User successfully changed their password | `app/routers/settings.py` |
| `dashboard_viewed` | User viewed the dashboard — top of engagement funnel | `app/routers/pages.py` |

## Next steps

To create a dashboard for these events, navigate to [PostHog Dashboards](/dashboards) and create a new dashboard named "Analytics basics" with these recommended insights:

1. **Signup conversion funnel** — `user_signed_up` → `content_generated` (funnel insight)
2. **Content generation trend** — `content_generated` over time, broken down by `generation_type`
3. **Credit exhaustion** — `generation_failed_insufficient_credits` trend (churn early warning)
4. **API key adoption** — `api_key_created` trend (developer engagement)
5. **Daily active users** — `dashboard_viewed` unique users per day

> Note: Dashboard creation via the MCP was not possible because the current PostHog API key is missing the `dashboard:write`, `insight:write`, and `query:read` scopes. Add these scopes to your personal API key in [PostHog API Keys settings](/settings/user-api-keys) to enable automated dashboard creation.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
