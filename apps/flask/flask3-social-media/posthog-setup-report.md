<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Microblog Flask social media application. PostHog is now initialized globally in the app factory and events are captured across authentication, content creation, social interactions, messaging, and API flows. User identification is established at login and signup using `new_context()` / `identify_context()` so all server-side events are linked to the correct user. Server-side exception capture is wired into the 500 error handler.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User completed registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | User successfully logged in with username and password | `app/auth/routes.py` |
| `user_logged_out` | User explicitly logged out of the application | `app/auth/routes.py` |
| `password_reset_requested` | User submitted a password reset request | `app/auth/routes.py` |
| `password_reset_completed` | User successfully reset their password using a reset token | `app/auth/routes.py` |
| `post_created` | User created and published a new post on the feed | `app/main/routes.py` |
| `user_followed` | User followed another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollowed another user | `app/main/routes.py` |
| `message_sent` | User sent a direct message to another user | `app/main/routes.py` |
| `profile_updated` | User saved changes to their profile (username or bio) | `app/main/routes.py` |
| `post_search_performed` | User performed a search query for posts | `app/main/routes.py` |
| `export_posts_started` | User initiated an export of their posts as a background task | `app/main/routes.py` |
| `api_user_created` | A new user account was created via the REST API | `app/api/users.py` |

## Next steps

To explore insights in PostHog, navigate to your project and create the following recommended analyses based on the events above:

- **Signup-to-first-post funnel** — `user_signed_up` → `post_created`: reveals drop-off between registration and engagement
- **User engagement trend** — `post_created` over time: tracks how active your community is
- **Social graph growth** — `user_followed` count over time: measures network effect and user connections
- **Messaging adoption** — `message_sent` over time: shows direct-message feature uptake
- **Search usage** — `post_search_performed` with `result_count` breakdown: identifies search effectiveness

Visit your PostHog project at **https://us.i.posthog.com/project/2** to build these insights and create an "Analytics basics" dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
