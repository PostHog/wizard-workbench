# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media application (Microblog). The `posthog` Python SDK was installed, the app factory was updated to initialize PostHog globally in `create_app()`, and 14 events were instrumented across 5 files covering the full user lifecycle: authentication, content creation, social interactions, direct messaging, and REST API usage. User identification is performed on every event using the user's integer ID as the distinct ID, with username set as a person property via `tag()`. Server-side exceptions are captured automatically on 500 errors.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | A registered user successfully authenticates with username and password. | `app/auth/routes.py` |
| `user_registered` | A new user completes the registration form and creates an account. | `app/auth/routes.py` |
| `user_logged_out` | An authenticated user ends their session by logging out. | `app/auth/routes.py` |
| `password_reset_requested` | A user requests a password reset email to be sent. | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully resets their password via the reset token link. | `app/auth/routes.py` |
| `post_created` | A user submits a new post to their feed. | `app/main/routes.py` |
| `user_followed` | A user follows another user on the platform. | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user on the platform. | `app/main/routes.py` |
| `message_sent` | A user sends a private message to another user. | `app/main/routes.py` |
| `posts_exported` | A user initiates a background task to export all their posts. | `app/main/routes.py` |
| `search_performed` | A user submits a search query for posts. | `app/main/routes.py` |
| `api_user_created` | A new user account is created through the REST API. | `app/api/users.py` |
| `api_token_created` | A user authenticates via the API and obtains an access token. | `app/api/tokens.py` |
| `api_token_revoked` | A user revokes their active API access token. | `app/api/tokens.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1818150)
- [New user registrations (wizard)](https://us.posthog.com/project/483112/insights/hVo1olvV) — daily bar chart of web + API registrations
- [Registration to first post funnel (wizard)](https://us.posthog.com/project/483112/insights/Srg7GKdY) — conversion funnel: registered → logged in → created post
- [Post creation volume (wizard)](https://us.posthog.com/project/483112/insights/cRGR8LOT) — daily post volume broken down by detected language
- [Social engagement trends (wizard)](https://us.posthog.com/project/483112/insights/sTk5hE7j) — follows, unfollows, and messages over time
- [Login vs logout ratio (wizard)](https://us.posthog.com/project/483112/insights/alzvrdzZ) — logins vs logouts as a daily activity signal

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify_context()` is called only at login/registration events; returning users who resume sessions without logging in will have their events linked by Flask-Login's session cookie but PostHog won't receive a server-side identify call for those sessions.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
