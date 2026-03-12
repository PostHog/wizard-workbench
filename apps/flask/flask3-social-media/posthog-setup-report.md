<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Microblog Flask social media application. PostHog is now initialized globally in `create_app()` using environment variables, and 13 analytics events have been instrumented across authentication, social, messaging, and API flows. Users are identified by their username (`identify_context`) at every key event, enabling full user-level analytics in PostHog. The `posthog` package has been added to `requirements.txt` and environment variables are stored in `.env`.

| Event Name | Description | File |
|---|---|---|
| `user_registered` | User completed registration form and account was created | `app/auth/routes.py` |
| `user_logged_in` | User successfully logged in with username and password | `app/auth/routes.py` |
| `user_logged_out` | User explicitly logged out | `app/auth/routes.py` |
| `password_reset_requested` | User submitted a password reset request | `app/auth/routes.py` |
| `password_reset_completed` | User successfully completed a password reset | `app/auth/routes.py` |
| `post_created` | User created and submitted a new post | `app/main/routes.py` |
| `user_followed` | User followed another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollowed another user | `app/main/routes.py` |
| `message_sent` | User sent a private message to another user | `app/main/routes.py` |
| `profile_updated` | User saved changes to their profile (username or about_me) | `app/main/routes.py` |
| `posts_export_started` | User initiated a posts export task | `app/main/routes.py` |
| `api_user_created` | New user created via API endpoint | `app/api/users.py` |
| `api_token_revoked` | User revoked their API token | `app/api/tokens.py` |

## Next steps

We recommend building the following insights on a new **"Analytics basics"** dashboard in your PostHog project:

1. **Signup → Login conversion funnel** — Funnel: `user_registered` → `user_logged_in` — tracks how many new registrants return to log in.
2. **Daily active posters** — Trend of unique users firing `post_created` per day — your core engagement signal.
3. **Social engagement** — Trend comparing `user_followed` vs `user_unfollowed` over time — measures network growth health.
4. **Messaging activity** — Trend of `message_sent` per day — measures community communication.
5. **Password reset funnel** — Funnel: `password_reset_requested` → `password_reset_completed` — helps identify friction in account recovery.

You can create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
