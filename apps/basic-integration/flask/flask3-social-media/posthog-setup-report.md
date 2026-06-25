<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media application (Microblog). PostHog is initialized in `create_app()` using the module-level `posthog.api_key` and `posthog.host` configuration, reading values from environment variables. Event tracking covers all major user actions: authentication flows (login, registration, logout, password reset), content creation (posts), social interactions (follows, unfollows, private messages), profile management, data exports, and API usage. Person properties (username, email) are set with `tag()` inside `new_context()` blocks to avoid sending PII in event payloads.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in with username and password. | `app/auth/routes.py` |
| `user_registered` | Fired when a new user completes registration and creates an account. | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out of their session. | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user submits the forgot-password form to request a reset email. | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password via the token link. | `app/auth/routes.py` |
| `post_created` | Fired when a user submits a new post on the home feed. | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user. | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user. | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a private message to another user. | `app/main/routes.py` |
| `profile_updated` | Fired when a user saves changes to their profile. | `app/main/routes.py` |
| `posts_exported` | Fired when a user triggers the background job to export their posts. | `app/main/routes.py` |
| `api_user_created` | Fired when a new user account is created via the REST API. | `app/api/users.py` |
| `api_token_obtained` | Fired when a user authenticates and obtains an API token. | `app/api/tokens.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.i.posthog.com/project/483112/dashboard/1761064)
- [New User Registrations](https://us.i.posthog.com/project/483112/insights/9588364)
- [Daily Login Activity](https://us.i.posthog.com/project/483112/insights/9588376)
- [Post Creation Activity](https://us.i.posthog.com/project/483112/insights/9588379)
- [Onboarding to Engagement Funnel](https://us.i.posthog.com/project/483112/insights/9588380)
- [Social Engagement (Follows and Messages)](https://us.i.posthog.com/project/483112/insights/9588382)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
