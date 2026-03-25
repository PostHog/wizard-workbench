<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media (Microblog) application. The `posthog` Python SDK is now installed and wired into the Flask app factory. A `Posthog` client is initialized in `create_app()` using environment variables, stored on `app.posthog`, and flushed on exit via `atexit`. Fourteen business-critical events are captured across authentication, social interactions, messaging, and the REST API, with person properties set on registration and API sign-up. Server-side exceptions are captured automatically via the 500 error handler.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated via login form | `app/auth/routes.py` |
| `user_registered` | New user completed registration | `app/auth/routes.py` |
| `user_logged_out` | User explicitly logged out | `app/auth/routes.py` |
| `password_reset_requested` | User requested a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | User reset their password via token | `app/auth/routes.py` |
| `post_created` | User submitted a new post | `app/main/routes.py` |
| `user_followed` | User followed another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollowed another user | `app/main/routes.py` |
| `message_sent` | User sent a direct message | `app/main/routes.py` |
| `profile_updated` | User saved profile changes | `app/main/routes.py` |
| `posts_export_started` | User initiated a posts export task | `app/main/routes.py` |
| `api_user_created` | New user created via REST API | `app/api/users.py` |
| `api_token_issued` | API auth token issued to a user | `app/api/tokens.py` |
| `api_token_revoked` | API auth token revoked by user | `app/api/tokens.py` |

## Next steps

Visit your PostHog project to explore the data and build insights:

- [PostHog project](https://us.posthog.com/project/238460)
- [Events explorer](https://us.posthog.com/project/238460/events)
- [Create a new dashboard](https://us.posthog.com/project/238460/dashboard)

Suggested insights to build:

1. **Signup trend** — `user_registered` over time (line chart)
2. **Registration → engagement funnel** — `user_registered` → `user_logged_in` → `post_created` (funnel)
3. **Social activity** — `user_followed` + `message_sent` stacked over time
4. **Churn signal** — `user_logged_out` without a follow-up `user_logged_in` in 7 days
5. **API adoption** — `api_token_issued` vs `api_user_created` over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
