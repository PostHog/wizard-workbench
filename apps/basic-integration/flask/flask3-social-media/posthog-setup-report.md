<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask microblog social media application. PostHog is now initialized globally in `create_app()` using the `Posthog()` constructor with exception autocapture enabled. Module-level environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) are read from `.env` via `config.py`. Twelve business-critical events are now tracked across authentication, posting, social interactions, messaging, and the REST API.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully registered an account. | `app/auth/routes.py` |
| `user_logged_in` | A user successfully authenticated and logged in. | `app/auth/routes.py` |
| `user_logged_out` | A user logged out of their account. | `app/auth/routes.py` |
| `password_reset_requested` | A user submitted a request to reset their password. | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully completed a password reset. | `app/auth/routes.py` |
| `post_created` | A user published a new post to their feed. | `app/main/routes.py` |
| `user_followed` | A user followed another user. | `app/main/routes.py` |
| `user_unfollowed` | A user unfollowed another user. | `app/main/routes.py` |
| `message_sent` | A user sent a private message to another user. | `app/main/routes.py` |
| `profile_updated` | A user saved changes to their profile. | `app/main/routes.py` |
| `posts_export_started` | A user initiated an export of their posts as a background task. | `app/main/routes.py` |
| `api_user_created` | A new user account was created via the REST API. | `app/api/users.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Dashboard: Your starter dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- [New vs Returning User Activity](https://us.posthog.com/project/483112/insights/nCSSX7Aa)
- [Signup Conversion Funnel (user_signed_up → post_created)](https://us.posthog.com/project/483112/insights/auZ55mkj)
- [Core Engagement Actions (post_created, user_followed, message_sent)](https://us.posthog.com/project/483112/insights/BfBBvpuz)
- [Churn Signal (user_logged_out)](https://us.posthog.com/project/483112/insights/gx3qoDdU)
- [Support Load Indicator (password_reset_requested, password_reset_completed)](https://us.posthog.com/project/483112/insights/CqbB3nIN)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
