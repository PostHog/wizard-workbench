<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. A dedicated `app/analytics.py` module was created to hold the `Posthog` client instance (initialized with `project_api_key`, `host`, and `enable_exception_autocapture=True`), with `atexit.register` ensuring all events are flushed on process exit. The app's lifespan handler in `app/main.py` calls `posthog_client.flush()` on shutdown. Environment variables (`POSTHOG_API_KEY` and `POSTHOG_HOST`) are loaded via Pydantic Settings in `app/config.py` and are never hardcoded. Nine business-critical events were instrumented across four router files covering the full user lifecycle: signup/login (with person property identification), AI content generation, credit exhaustion, API key management, and profile settings changes.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully completes registration | `app/routers/auth.py` |
| `user_logged_in` | Fired when a user successfully authenticates | `app/routers/auth.py` |
| `user_logged_out` | Fired when a user explicitly logs out | `app/routers/auth.py` |
| `content_generated` | Fired when AI content is successfully generated, with generation type and credits used | `app/routers/generate.py` |
| `credits_exhausted` | Fired when a generation fails due to insufficient credits — churn signal | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user revokes an API key | `app/routers/api_keys.py` |
| `settings_updated` | Fired when a user successfully updates their profile settings | `app/routers/settings.py` |
| `password_changed` | Fired when a user successfully changes their password | `app/routers/settings.py` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor user behavior:

1. **Signup & Login Trends** — Trends chart with `user_signed_up` and `user_logged_in` over time (daily, last 30 days)
2. **Signup → First Generation Funnel** — Funnel: `user_signed_up` → `content_generated`, to measure activation rate
3. **Content Generation by Type** — Trends chart of `content_generated` broken down by `generation_type` property
4. **Credits Exhausted (Churn Signal)** — Trends chart of `credits_exhausted` — users who hit the paywall
5. **API Key Adoption** — Trends chart of `api_key_created` and `api_key_revoked` to track developer engagement

You can create this dashboard at: https://us.i.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
