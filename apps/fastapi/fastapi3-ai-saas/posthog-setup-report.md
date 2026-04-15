<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. The integration covers all critical user flows: authentication (signup, login, logout), AI content generation (including credit failures), API key lifecycle management, and profile/settings updates.

**Changes made:**
- Added `posthog>=3.0.0` to `requirements.txt`
- Added `posthog_api_key` and `posthog_host` settings to `app/config.py`
- Created `app/posthog_client.py` — a singleton PostHog client initialized at startup, with `atexit` shutdown registration
- Updated `app/main.py` lifespan to call `init_posthog()` on startup and `shutdown_posthog()` on shutdown
- Instrumented 4 router files with 9 distinct events using the context-based API (`new_context()` + `identify_context()`) for user correlation
- Environment variables `POSTHOG_API_KEY` and `POSTHOG_HOST` set in `.env`

| Event | Description | File |
|---|---|---|
| `user signed up` | New user creates an account; sets `email` as person property | `app/routers/auth.py` |
| `user logged in` | User successfully authenticates | `app/routers/auth.py` |
| `user logged out` | User explicitly logs out | `app/routers/auth.py` |
| `content generated` | AI content successfully generated; includes `generation_type`, `credits_used`, `credits_remaining`, `prompt_length` | `app/routers/generate.py` |
| `insufficient credits` | Generation attempt blocked by low credits (churn signal); includes `generation_type`, `credits_needed`, `credits_available` | `app/routers/generate.py` |
| `api key created` | User creates a new API key | `app/routers/api_keys.py` |
| `api key revoked` | User deactivates an existing API key | `app/routers/api_keys.py` |
| `settings updated` | User successfully changes their email | `app/routers/settings.py` |
| `password changed` | User successfully changes their password | `app/routers/settings.py` |

## Next steps

We recommend building the following insights in your PostHog dashboard to monitor user behavior:

**Suggested dashboard: "Analytics basics"**

1. **Signup-to-generation funnel** — Funnel: `user signed up` → `content generated` — shows activation rate
2. **Content generation trend** — Trends: `content generated` broken down by `generation_type` — shows which content types drive usage
3. **Insufficient credits (churn signal)** — Trends: `insufficient credits` over time — users hitting this are at risk of churning; target for upsell
4. **New user signups over time** — Trends: `user signed up` — track growth
5. **API key adoption** — Trends: `api key created` vs `api key revoked` — shows developer engagement

To create the dashboard, visit: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
