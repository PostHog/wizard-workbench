<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this FastAPI SaaS app with PostHog. It added the Python PostHog SDK dependency, introduced environment-based PostHog configuration, initialized a shared PostHog client during app startup with exception autocapture enabled, and wrapped HTTP requests in request-scoped PostHog context middleware. It also instrumented key authenticated product flows for signup, login, logout, dashboard usage, content generation success and credit blocks, API key lifecycle changes, and account settings updates while keeping email on person properties instead of event payloads.

| Event name | Description | File |
| --- | --- | --- |
| user_signed_up | Tracks successful account creation from the signup flow. | `app/routers/auth.py` |
| user_logged_in | Tracks successful authentication for an existing account. | `app/routers/auth.py` |
| user_logged_out | Tracks when an authenticated user ends their session. | `app/routers/auth.py` |
| content_generation_requested | Tracks successful AI content generation requests by type and credit usage. | `app/routers/generate.py` |
| content_generation_blocked | Tracks generation attempts blocked because the user lacks credits. | `app/routers/generate.py` |
| api_key_created | Tracks creation of a new personal API key. | `app/routers/api_keys.py` |
| api_key_revoked | Tracks revocation of an existing API key. | `app/routers/api_keys.py` |
| settings_updated | Tracks successful account email updates from the settings page. | `app/routers/settings.py` |
| password_changed | Tracks successful password changes for authenticated users. | `app/routers/settings.py` |
| dashboard_viewed | Tracks authenticated dashboard visits and summarizes current account state. | `app/routers/pages.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825319
- Insight: Signups (wizard) — https://us.posthog.com/project/483112/insights/hntofPsK
- Insight: Signup to generation funnel (wizard) — https://us.posthog.com/project/483112/insights/mVlmQCmX
- Insight: Generations by type (wizard) — https://us.posthog.com/project/483112/insights/gDdn4sff
- Insight: API key lifecycle (wizard) — https://us.posthog.com/project/483112/insights/2NNMnZFj
- Insight: Blocked generations (wizard) — https://us.posthog.com/project/483112/insights/kyb90CG3

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
