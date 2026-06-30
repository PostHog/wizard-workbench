# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask microblog application. PostHog is initialized in `create_app()` using environment variables for the project token and host. Event tracking has been added across five files covering authentication, social interactions, content creation, search, messaging, and the REST API. Users are identified server-side via `identify_context(str(user.id))` on all key actions.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully completes registration. | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully authenticates with username and password. | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user submits the password reset request form. | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password via a reset token. | `app/auth/routes.py` |
| `post_created` | Fired when a user successfully creates and publishes a new post. | `app/main/routes.py` |
| `explore_viewed` | Fired when a user views the explore (global) post feed, marking the start of content discovery. | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user. | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user. | `app/main/routes.py` |
| `profile_edited` | Fired when a user saves changes to their profile. | `app/main/routes.py` |
| `search_performed` | Fired when a user submits a search query. | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a direct message to another user. | `app/main/routes.py` |
| `posts_exported` | Fired when a user initiates a post export task. | `app/main/routes.py` |
| `api_token_created` | Fired when a user obtains an API token via the REST API. | `app/api/tokens.py` |
| `api_user_created` | Fired when a new user is created via the REST API endpoint. | `app/api/users.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1777411)
- [Signup Funnel](https://us.posthog.com/project/483112/insights/AK30NTQx)
- [Daily Active Users](https://us.posthog.com/project/483112/insights/GoFCgxEo)
- [Content Engagement](https://us.posthog.com/project/483112/insights/liBmRaqW)
- [Feature Adoption](https://us.posthog.com/project/483112/insights/jmcwnkQ2)
- [Top Actions by Users](https://us.posthog.com/project/483112/insights/LAoc6mJe)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
