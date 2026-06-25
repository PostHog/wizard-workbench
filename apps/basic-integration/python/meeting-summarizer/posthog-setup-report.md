# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer. A shared `posthog_client.py` module was added to initialize the PostHog instance using environment variables, with automatic shutdown registered via `atexit`. Event tracking was added to `server.py` for all critical user actions (login, logout, meeting creation, meeting deletion, and user creation), and to `user_service.py` for user registration and deactivation. Person properties are set on login, registration, and user creation so that each user's profile is populated in PostHog from the first interaction.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates via the login endpoint. | `server.py` |
| `user_login_failed` | Fired when a login attempt fails due to invalid credentials or inactive account. | `server.py` |
| `user_logged_out` | Fired when a user ends their session via the logout endpoint. | `server.py` |
| `meeting_created` | Fired when a meeting transcript is submitted and successfully analyzed by the AI summarizer. | `server.py` |
| `meeting_deleted` | Fired when a user deletes one of their meeting summaries. | `server.py` |
| `user_created` | Fired when a new user account is created via the admin API. | `server.py` |
| `user_registered` | Fired when a new user is registered through the UserService. | `user_service.py` |
| `user_deactivated` | Fired when a user account is deactivated through the UserService. | `user_service.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1760658)
- [User Logins Over Time](https://us.i.posthog.com/project/483112/insights/9586200)
- [Login Failures](https://us.i.posthog.com/project/483112/insights/9586201)
- [Meetings Created Over Time](https://us.i.posthog.com/project/483112/insights/9586205)
- [Meeting Deletions](https://us.i.posthog.com/project/483112/insights/9586207)
- [Login to Meeting Created Funnel](https://us.i.posthog.com/project/483112/insights/9586210)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
