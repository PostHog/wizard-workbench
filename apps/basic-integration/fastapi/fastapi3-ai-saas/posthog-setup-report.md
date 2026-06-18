<wizard-report>
# PostHog post-wizard report

The wizard has completed a full integration of PostHog analytics into this FastAPI AI SaaS application. PostHog is initialized in the app lifespan using environment variables, and a pure-ASGI middleware wraps every request in a PostHog context, automatically identifying authenticated users from their session cookie. Ten business-critical events are captured across authentication, AI content generation, API key management, account settings, and the core dashboard view.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully creates an account. | `app/routers/auth.py` |
| `user_logged_in` | An existing user successfully logs in. | `app/routers/auth.py` |
| `user_logged_out` | A user logs out of their account. | `app/routers/auth.py` |
| `content_generated` | A user successfully generates AI content and credits are deducted. | `app/routers/generate.py` |
| `generation_failed_insufficient_credits` | A content generation request failed because the user had too few credits. | `app/routers/generate.py` |
| `api_key_created` | A user creates a new API key for programmatic access. | `app/routers/api_keys.py` |
| `api_key_revoked` | A user revokes (deactivates) an existing API key. | `app/routers/api_keys.py` |
| `settings_updated` | A user updates their account settings such as email. | `app/routers/settings.py` |
| `password_changed` | A user successfully changes their account password. | `app/routers/settings.py` |
| `dashboard_viewed` | A user views their dashboard — the entry point to the core product experience. | `app/routers/pages.py` |

## Files changed

- `requirements.txt` — added `posthog>=3.0.0`
- `app/config.py` — added `posthog_project_token`, `posthog_host`, and `posthog_disabled` settings
- `app/main.py` — PostHog initialization in lifespan startup/shutdown; added `PostHogMiddleware`
- `app/middleware.py` — new `PostHogMiddleware` that wraps each request in a PostHog context and identifies authenticated users from their session cookie
- `app/routers/auth.py` — user identification and `user_signed_up`, `user_logged_in`, `user_logged_out` events
- `app/routers/generate.py` — `content_generated` and `generation_failed_insufficient_credits` events
- `app/routers/api_keys.py` — `api_key_created` and `api_key_revoked` events
- `app/routers/settings.py` — `settings_updated` and `password_changed` events
- `app/routers/pages.py` — `dashboard_viewed` event
- `.env` — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` written

## Next steps

Recommended insights to build in PostHog for this project:

1. **Signup → Dashboard funnel** — funnel from `user_signed_up` → `dashboard_viewed` → `content_generated` to measure activation rate.
2. **Content generation trend** — trend of `content_generated` broken down by `generation_type` (blog / email / social).
3. **Credit exhaustion rate** — trend of `generation_failed_insufficient_credits` — a leading churn indicator.
4. **API key adoption** — trend of `api_key_created` to track power-user growth.
5. **Login/signup over time** — trends of `user_signed_up` and `user_logged_in` side by side for acquisition and retention.

To build the dashboard, open PostHog → Dashboards → New dashboard named "Analytics basics (wizard)", then add these insights.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` (and any bootstrap scripts) so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the middleware identifies users on every authenticated request, but verify that sessions resumed after a server restart re-identify correctly on the first request.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
