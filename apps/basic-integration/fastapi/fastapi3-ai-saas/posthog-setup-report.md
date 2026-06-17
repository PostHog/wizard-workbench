<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. Changes include initializing PostHog in the app lifespan, a pure ASGI middleware that wraps every request in a PostHog context and identifies authenticated users, and event capture at all critical business touchpoints — authentication, AI content generation, API key management, settings updates, and the dashboard funnel entry.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `app/routers/auth.py` |
| `user_logged_in` | User successfully authenticated and logged in | `app/routers/auth.py` |
| `user_logged_out` | User logged out of their session | `app/routers/auth.py` |
| `content_generated` | User successfully generated AI content (blog, email, or social) | `app/routers/generate.py` |
| `generation_failed_insufficient_credits` | Content generation failed because the user had insufficient credits | `app/routers/generate.py` |
| `api_key_created` | User created a new API key for programmatic access | `app/routers/api_keys.py` |
| `api_key_revoked` | User revoked (deactivated) an API key | `app/routers/api_keys.py` |
| `settings_updated` | User updated their account settings (e.g. email) | `app/routers/settings.py` |
| `password_changed` | User successfully changed their account password | `app/routers/settings.py` |
| `dashboard_viewed` | User viewed their dashboard — top of the main product funnel | `app/routers/pages.py` |

## Files created / modified

- **`app/middleware.py`** — Pure ASGI `PostHogMiddleware` that calls `new_context()` per request and identifies authenticated users via session cookie.
- **`app/main.py`** — PostHog initialized in lifespan (`posthog.api_key`, `posthog.host`); flushed on shutdown; middleware registered.
- **`app/config.py`** — Added `posthog_project_token`, `posthog_host`, `posthog_disabled` Pydantic settings fields.
- **`requirements.txt`** — Added `posthog>=3.0.0`.
- **`.env`** — Written `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`.

## Next steps

We recommend building a dashboard to monitor these events. Here is a suggested set of five insights:

1. **Signup → First generation funnel** — Track `user_signed_up` → `content_generated` conversion to measure activation. [Create insight](https://us.posthog.com/project/2/insights/new)
2. **Credit exhaustion rate** — Trend of `generation_failed_insufficient_credits` over time to identify churn signals. [Create insight](https://us.posthog.com/project/2/insights/new)
3. **Content type breakdown** — Trend of `content_generated` broken down by `generation_type` (blog / email / social). [Create insight](https://us.posthog.com/project/2/insights/new)
4. **API key adoption** — Count of `api_key_created` vs. `api_key_revoked` to track developer API usage growth. [Create insight](https://us.posthog.com/project/2/insights/new)
5. **Daily active users** — Unique users who triggered `dashboard_viewed` per day. [Create insight](https://us.posthog.com/project/2/insights/new)

[Open dashboards in PostHog](https://us.posthog.com/project/2/dashboard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`) to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the middleware calls `identify_context` on every authenticated request, so returning sessions should be covered, but verify a logged-in session shows up as a known user in PostHog Live Events.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
