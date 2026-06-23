<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media (microblog) application. PostHog is now initialized globally in `create_app()`, and 15 events covering key user actions — authentication, social interactions, content creation, messaging, and API usage — are captured across 5 files.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user completed registration via the signup form. | `app/auth/routes.py` |
| `user_logged_in` | A user successfully authenticated and logged in. | `app/auth/routes.py` |
| `user_logged_out` | A user logged out of their session. | `app/auth/routes.py` |
| `password_reset_requested` | A user submitted a request to reset their password. | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully reset their password via the reset token link. | `app/auth/routes.py` |
| `post_created` | A user published a new post to their feed. | `app/main/routes.py` |
| `user_followed` | A user followed another user on the platform. | `app/main/routes.py` |
| `user_unfollowed` | A user unfollowed another user on the platform. | `app/main/routes.py` |
| `profile_updated` | A user saved changes to their profile information. | `app/main/routes.py` |
| `message_sent` | A user sent a private message to another user. | `app/main/routes.py` |
| `post_searched` | A user performed a search query across posts. | `app/main/routes.py` |
| `post_translated` | A user requested a translation of a post. | `app/main/routes.py` |
| `posts_export_started` | A user triggered a background task to export all their posts. | `app/main/routes.py` |
| `api_user_created` | A new user account was created via the REST API. | `app/api/users.py` |
| `api_token_issued` | An API authentication token was issued to a user. | `app/api/tokens.py` |

## Next steps

We've built some insights and a dashboard to keep an eye on user behavior:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/2/dashboard/1720023)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on login and signup, but sessions that are restored from cookies (i.e., `remember_me=True`) skip the `identify` call on subsequent visits.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
