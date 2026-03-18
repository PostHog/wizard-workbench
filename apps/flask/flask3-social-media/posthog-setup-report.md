<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media application (Microblog). The `posthog` Python SDK was added as a dependency and a `Posthog` client instance is initialized globally in `create_app()` with exception autocapture enabled. The client is flushed cleanly on process exit via `atexit`. Environment variables `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are used for configuration — no tokens are hardcoded. Fourteen events are now tracked across five files, covering user authentication, social interactions, content creation, and API access. User identity is linked on login, signup, and API user creation using `posthog_client.set()`.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in via the web form | `app/auth/routes.py` |
| `user_signed_up` | Fired when a new user registers via the web form | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user requests a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password | `app/auth/routes.py` |
| `post_created` | Fired when a user submits a new post from the home feed | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a private message to another user | `app/main/routes.py` |
| `profile_edited` | Fired when a user saves changes to their profile | `app/main/routes.py` |
| `posts_exported` | Fired when a user launches the export posts background task | `app/main/routes.py` |
| `post_searched` | Fired when a user performs a search | `app/main/routes.py` |
| `api_user_created` | Fired when a new user is created via the REST API | `app/api/users.py` |
| `api_token_obtained` | Fired when a user authenticates via the API and receives a token | `app/api/tokens.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/900002)
- [Signup to First Post Funnel](https://us.posthog.com/project/2/insights/i08ka23c)
- [Daily Active Users](https://us.posthog.com/project/2/insights/zpsu2w97)
- [Post Creation Over Time](https://us.posthog.com/project/2/insights/a90e19gi)
- [Social Engagement](https://us.posthog.com/project/2/insights/tld1y98t)
- [Churn Signal: Logouts vs Logins](https://us.posthog.com/project/2/insights/n05tlbah)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
