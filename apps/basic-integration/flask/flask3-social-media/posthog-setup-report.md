<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media (Microblog) application. PostHog was initialized using the `Posthog()` class constructor in the application factory (`app/__init__.py`), with environment-based configuration and an `atexit` shutdown hook to ensure all events are flushed on exit. Fourteen custom events were instrumented across four files covering the core user journeys: authentication, content creation, social interactions, and API token management.

| Event Name | Description | File |
|---|---|---|
| `user_registered` | A new user successfully completes registration. | `app/auth/routes.py` |
| `user_logged_in` | A user successfully logs in with their credentials. | `app/auth/routes.py` |
| `user_logged_out` | A user logs out of their account. | `app/auth/routes.py` |
| `password_reset_requested` | A user requests a password reset email. | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully resets their password using a reset token. | `app/auth/routes.py` |
| `post_created` | A user creates and publishes a new post. | `app/main/routes.py` |
| `user_followed` | A user follows another user. | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user. | `app/main/routes.py` |
| `message_sent` | A user sends a direct message to another user. | `app/main/routes.py` |
| `posts_exported` | A user initiates a background task to export their posts. | `app/main/routes.py` |
| `search_performed` | A user performs a search query. | `app/main/routes.py` |
| `profile_updated` | A user saves changes to their profile information. | `app/main/routes.py` |
| `api_token_created` | A user creates an API authentication token. | `app/api/tokens.py` |
| `api_token_revoked` | A user revokes their API authentication token. | `app/api/tokens.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1792377)
  - [Registration to Login Funnel](https://us.posthog.com/project/483112/insights/9774319) — conversion from `user_registered` → `user_logged_in`
  - [Daily Active Users](https://us.posthog.com/project/483112/insights/9774320) — daily unique users from login events
  - [Content Creation Trend](https://us.posthog.com/project/483112/insights/9774321) — daily `post_created` events
  - [Social Engagement Trend](https://us.posthog.com/project/483112/insights/9774323) — `user_followed` and `message_sent` over time
  - [Churn Signals (Logouts)](https://us.posthog.com/project/483112/insights/9774324) — `user_logged_out` as a churn proxy

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current integration identifies on login/register, but returning users who resume an existing session (e.g., session cookie still valid) are not re-identified on page load.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
