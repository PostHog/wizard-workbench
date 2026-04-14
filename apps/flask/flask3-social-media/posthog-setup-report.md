<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Flask microblog application. The `posthog` Python SDK was added as a dependency and initialized globally in `create_app()` using environment variables. Event tracking was added to 5 files covering authentication, social interactions, direct messaging, profile management, and the REST API.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user completes registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully logs in with username and password | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user submits a password reset request | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password via token | `app/auth/routes.py` |
| `post_created` | Fired when a user submits a new post on the index/home feed | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a direct message to another user | `app/main/routes.py` |
| `profile_edited` | Fired when a user saves changes to their profile | `app/main/routes.py` |
| `posts_export_started` | Fired when a user triggers the export posts background task | `app/main/routes.py` |
| `api_token_created` | Fired when an API token is issued via the REST API | `app/api/tokens.py` |
| `api_user_created` | Fired when a new user is created via the REST API | `app/api/users.py` |

## Next steps

We recommend building the following insights in your PostHog project to keep an eye on user behaviour:

- **Signup → Login conversion funnel** — Steps: `user_signed_up` → `user_logged_in`. Shows how many newly registered users complete their first login.
- **User engagement trend** — Trend of `post_created` over time, broken down by `language`. Highlights content creation activity.
- **Social engagement** — Trend of `user_followed` and `user_unfollowed` side-by-side. Tracks growth in the follow graph and potential churn signals.
- **Messaging activity** — Trend of `message_sent` filtered by `message_length`. Useful for understanding communication depth.
- **Password reset funnel** — Steps: `password_reset_requested` → `password_reset_completed`. Identifies friction in the password recovery flow.

Create these as an "Analytics basics" dashboard inside PostHog at:
**https://us.posthog.com/project/2/insights**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
