# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer. The PostHog Python SDK (`posthog>=3.0.0`) was added as a dependency alongside `python-dotenv`. A shared `Posthog` client instance is initialized at module level in both `server.py` and `user_service.py`, reading credentials from environment variables. `atexit.register(posthog_client.shutdown)` ensures all queued events are flushed before the process exits. Exception autocapture is enabled globally, and `capture_exception()` is called explicitly in the POST and DELETE error handlers of `server.py`.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | A user successfully authenticated and started a session. | `server.py` |
| `user_login_failed` | A login attempt failed because the user was not found or is inactive. | `server.py` |
| `user_logged_out` | A user ended their session by logging out. | `server.py` |
| `meeting_created` | A user submitted a meeting transcript and received an AI-generated summary. | `server.py` |
| `meeting_deleted` | A user permanently deleted a meeting and its summary. | `server.py` |
| `user_created` | A new user account was created via the API. | `server.py` |
| `user_registered` | A new user was registered through the UserService. | `user_service.py` |
| `user_deactivated` | A user account was deactivated through the UserService. | `user_service.py` |

Person properties (`username`, `is_active`) are set via `posthog_client.set()` on login, user creation, and user registration.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1813058)
- [Meetings created over time](https://us.posthog.com/project/483112/insights/MBkM6lwU)
- [Daily active users](https://us.posthog.com/project/483112/insights/eq4E1ksT)
- [Login to meeting creation funnel](https://us.posthog.com/project/483112/insights/r9HiuKzL)
- [New user registrations](https://us.posthog.com/project/483112/insights/afdKKTXh)
- [User deactivation (churn) trend](https://us.posthog.com/project/483112/insights/sG80ZTWD)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls identifies the user — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
