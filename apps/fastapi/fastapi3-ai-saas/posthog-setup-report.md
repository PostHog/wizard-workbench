<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. The integration adds server-side event tracking, user identification via middleware, and captures the key business actions across authentication, AI content generation, API key management, and user settings.

## Changes made

| File | Change |
|------|--------|
| `app/main.py` | PostHog initialized in lifespan (startup/shutdown with `posthog.flush()`); `PostHogMiddleware` added |
| `app/middleware.py` | New `PostHogMiddleware` class wrapping each request in `new_context()`, identifying authenticated users by ID |
| `app/config.py` | Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` settings |
| `app/routers/auth.py` | `user_signed_up` and `user_logged_in` events with `identify_context` and `$set` person properties |
| `app/routers/generate.py` | `content_generated` and `content_generation_failed` events with generation type and credit metadata |
| `app/routers/api_keys.py` | `api_key_created` and `api_key_revoked` events |
| `app/routers/settings.py` | `settings_updated` (email change) and `password_changed` events |
| `requirements.txt` | Added `posthog>=3.0.0` |
| `.env` | Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` |

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user successfully creates an account | `app/routers/auth.py` |
| `user_logged_in` | Fired when a user successfully logs in | `app/routers/auth.py` |
| `content_generated` | Fired when AI content is successfully generated; tracks `generation_type` and `credits_used` | `app/routers/generate.py` |
| `content_generation_failed` | Fired when content generation fails due to insufficient credits | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user revokes/deactivates an API key | `app/routers/api_keys.py` |
| `settings_updated` | Fired when a user successfully updates their email address | `app/routers/settings.py` |
| `password_changed` | Fired when a user successfully changes their password | `app/routers/settings.py` |

## Next steps

We've linked you to an analytics dashboard for keeping an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1344803) — tracks user signups, logins, and key funnel metrics

To get the most out of your instrumentation, consider adding these additional insights to the dashboard in PostHog:

1. **Content Generation Funnel** — `user_logged_in` → `content_generated`: measures how many logged-in users actually generate content
2. **Credit Exhaustion Rate** — daily trend of `content_generation_failed` events: identifies users at risk of churn due to running out of credits
3. **API Key Adoption** — trend of `api_key_created` vs `api_key_revoked`: shows developer engagement
4. **Retention by Generation Type** — `content_generated` breakdown by `generation_type` (blog/email/social): reveals which content type is most popular

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
