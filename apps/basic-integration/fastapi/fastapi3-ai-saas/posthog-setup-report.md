<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this FastAPI AI SaaS application. The SDK is initialized in the application lifespan context manager and a custom ASGI middleware (`PostHogMiddleware`) wraps every incoming HTTP request in a PostHog context, automatically identifying authenticated users by their database ID and tagging their email as a person property. Client-side tracing headers (`X-POSTHOG-DISTINCT-ID`, `X-POSTHOG-SESSION-ID`) are also extracted so frontend and backend events can be correlated in session replays. Nine business-critical events were instrumented across four routers covering auth, content generation, API key management, and account settings.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `app/routers/auth.py` |
| `user_logged_in` | User successfully authenticated and logged in | `app/routers/auth.py` |
| `user_logged_out` | User ended their session | `app/routers/auth.py` |
| `content_generated` | User successfully generated AI content (blog, email, or social post) | `app/routers/generate.py` |
| `generation_failed` | Content generation failed due to insufficient credits | `app/routers/generate.py` |
| `api_key_created` | User created a new API key for programmatic access | `app/routers/api_keys.py` |
| `api_key_revoked` | User revoked (deactivated) an API key | `app/routers/api_keys.py` |
| `settings_updated` | User updated their account settings (e.g. email address) | `app/routers/settings.py` |
| `password_changed` | User successfully changed their password | `app/routers/settings.py` |

## Next steps

Create a dashboard named **"Analytics basics (wizard)"** in PostHog and add the following insights:

[PostHog Dashboards](https://us.posthog.com/project/2/dashboard)

Suggested insights for the dashboard:

1. **Signup → Generation funnel** — Funnel insight with steps: `user_signed_up` → `content_generated`. Shows what percentage of new users generate their first piece of content.
2. **Content generation volume by type** — Trends insight on `content_generated` broken down by `generation_type` (blog / email / social). Reveals which content types are most popular.
3. **Credit exhaustion rate** — Trends insight comparing `generation_failed` (reason: insufficient_credits) over time. Leading indicator for churn and upsell opportunities.
4. **API key adoption** — Trends insight on `api_key_created` and `api_key_revoked` over time. Shows developer engagement and potential churn signals.
5. **Daily active authenticated users** — Trends insight on `user_logged_in` with unique user count. Tracks daily engagement.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the middleware identifies users on every authenticated request, but verify this covers all authenticated entry points (e.g. deep links with a valid session cookie).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
