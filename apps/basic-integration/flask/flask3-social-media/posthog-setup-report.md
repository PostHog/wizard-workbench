<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media (Microblog) application. The `posthog` Python SDK was installed and initialized globally in the application factory using the instance-based `Posthog()` API. An `atexit` shutdown hook ensures all buffered events are flushed when the server stops. User identity is tracked using `str(user.id)` as the stable distinct ID across all events, with `new_context()` + `identify_context()` used to associate events with the correct user within each request. Fifteen events were captured across five files covering authentication, content creation, social engagement, search, and the REST API.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user completed registration on the platform. | `app/auth/routes.py` |
| `user_logged_in` | An existing user successfully logged in. | `app/auth/routes.py` |
| `user_logged_out` | A user logged out of the platform. | `app/auth/routes.py` |
| `password_reset_requested` | A user requested a password reset email. | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully reset their password via the reset link. | `app/auth/routes.py` |
| `post_created` | A user published a new post to the feed. | `app/main/routes.py` |
| `user_followed` | A user followed another user on the platform. | `app/main/routes.py` |
| `user_unfollowed` | A user unfollowed another user on the platform. | `app/main/routes.py` |
| `profile_updated` | A user saved changes to their profile information. | `app/main/routes.py` |
| `message_sent` | A user sent a private message to another user. | `app/main/routes.py` |
| `post_search_performed` | A user searched for posts using the search feature. | `app/main/routes.py` |
| `posts_exported` | A user initiated a background export of their posts. | `app/main/routes.py` |
| `api_user_created` | A new user account was created via the REST API. | `app/api/users.py` |
| `api_token_obtained` | A user obtained an API authentication token. | `app/api/tokens.py` |
| `api_token_revoked` | A user revoked their API authentication token. | `app/api/tokens.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824458)
- **Insight**: [User signups and logins over time](https://us.posthog.com/project/483112/insights/dzBYKWnc)
- **Insight**: [Signup to first post conversion funnel](https://us.posthog.com/project/483112/insights/Lu0EtaAg)
- **Insight**: [Social engagement: follows and messages](https://us.posthog.com/project/483112/insights/R9Ldzp9f)
- **Insight**: [Post creation volume](https://us.posthog.com/project/483112/insights/mDfsKb5F)
- **Insight**: [Password reset funnel](https://us.posthog.com/project/483112/insights/VK2X9xgx)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
