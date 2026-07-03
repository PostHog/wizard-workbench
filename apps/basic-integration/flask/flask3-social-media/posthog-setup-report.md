<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Flask Microblog application. The `posthog` Python SDK was added as a dependency and initialized via the `Posthog()` class constructor in `create_app()`, stored on `app.posthog` for access via `current_app.posthog` in all blueprints. Events are captured using context managers (`new_context()` + `identify_context()`) so every event is tied to the authenticated user's ID. User identification is performed at login, registration, and on all API auth endpoints. `atexit.register(posthog_client.shutdown)` ensures events are flushed before the process exits.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully registers an account via the web form. | `app/auth/routes.py` |
| `user_logged_in` | An existing user successfully logs in with their credentials. | `app/auth/routes.py` |
| `user_logged_out` | A user logs out of their session. | `app/auth/routes.py` |
| `password_reset_requested` | A user submits a request to reset their password. | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully completes a password reset. | `app/auth/routes.py` |
| `post_created` | A user publishes a new microblog post. | `app/main/routes.py` |
| `user_followed` | A user follows another user on the platform. | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user on the platform. | `app/main/routes.py` |
| `profile_edited` | A user saves changes to their profile information. | `app/main/routes.py` |
| `message_sent` | A user sends a private message to another user. | `app/main/routes.py` |
| `posts_exported` | A user initiates an export of their posts. | `app/main/routes.py` |
| `api_user_created` | A new user account is created via the REST API. | `app/api/users.py` |
| `api_token_obtained` | A user obtains an API authentication token. | `app/api/tokens.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793480)
- [Signups & Logins](https://us.posthog.com/project/483112/insights/sTF5VhUK)
- [Post Creation Activity](https://us.posthog.com/project/483112/insights/AQ7VZAle)
- [Social Engagement](https://us.posthog.com/project/483112/insights/SYkwrIYv)
- [Password Reset & Churn Signals](https://us.posthog.com/project/483112/insights/yY15KPBz)
- [API & Profile Activity](https://us.posthog.com/project/483112/insights/u8n9cCew)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
