<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI application. The integration follows the official PostHog FastAPI pattern using the context-based API with a pure ASGI middleware for automatic per-request user identification.

**Changes made:**

- `requirements.txt` — added `posthog>=3.0.0`
- `.env` — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables
- `app/config.py` — added `posthog_project_token`, `posthog_host`, and `posthog_disabled` settings fields
- `app/middleware.py` — implemented `PostHogMiddleware` (pure ASGI) that wraps every HTTP request in a `new_context()`, identifies authenticated users via session cookie, and sets person properties (`email`, `credits`)
- `app/main.py` — initializes PostHog (`posthog.api_key`, `posthog.host`, `posthog.debug`) on startup and calls `posthog.flush()` on shutdown; registers `PostHogMiddleware`
- `app/routers/auth.py` — `posthog.identify()` + `user_signed_up` on signup; `posthog.identify()` + `user_logged_in` on login; `user_logged_out` on logout
- `app/routers/generate.py` — `content_generated` on successful AI generation; `insufficient_credits` when a user lacks credits
- `app/routers/api_keys.py` — `api_key_created` on key creation; `api_key_revoked` on key deletion
- `app/routers/settings.py` — `settings_updated` when email changes; `password_changed` on successful password change
- `app/routers/pages.py` — `dashboard_viewed` when the main dashboard is loaded

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `app/routers/auth.py` |
| `user_logged_in` | User successfully authenticated and started a session | `app/routers/auth.py` |
| `user_logged_out` | User ended their session | `app/routers/auth.py` |
| `content_generated` | User successfully generated AI content (blog, email, or social) | `app/routers/generate.py` |
| `insufficient_credits` | Content generation failed because the user did not have enough credits | `app/routers/generate.py` |
| `api_key_created` | User created a new API key for programmatic access | `app/routers/api_keys.py` |
| `api_key_revoked` | User deactivated an existing API key | `app/routers/api_keys.py` |
| `settings_updated` | User updated their account settings (e.g. email address) | `app/routers/settings.py` |
| `password_changed` | User successfully changed their password | `app/routers/settings.py` |
| `dashboard_viewed` | User viewed the main dashboard (top of engagement funnel) | `app/routers/pages.py` |

## Next steps

The PostHog MCP API key used during setup was missing the `dashboard:write`, `insight:write`, and `query:read` scopes required to auto-create a dashboard. You can build the recommended insights manually in PostHog:

1. **Signup funnel** — Funnel insight: `user_signed_up` → `content_generated`. Shows how many new users actually use the product after registering. Navigate to [Insights → New insight → Funnel](/insights/new).

2. **Content generation volume** — Trends insight: `content_generated` broken down by `generation_type` (blog / email / social). Shows which content type is most popular. Navigate to [Insights → New insight → Trends](/insights/new).

3. **Insufficient credits (conversion blocker)** — Trends insight: `insufficient_credits`. Spikes here indicate users hitting the paywall — a signal to prompt upgrades. Navigate to [Insights → New insight → Trends](/insights/new).

4. **API key adoption** — Trends insight: `api_key_created` over time. Developer activation metric — users who create API keys are likely to integrate deeply. Navigate to [Insights → New insight → Trends](/insights/new).

5. **Retention** — Retention insight with returning event `content_generated`. Shows how often users return to generate content after their first session. Navigate to [Insights → New insight → Retention](/insights/new).

Once created, group them all into a new dashboard named **"Analytics basics"** at [Dashboards → New dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
