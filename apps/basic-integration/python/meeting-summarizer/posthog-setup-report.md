# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer. The `posthog` and `python-dotenv` packages were added to `requirements.txt`. A shared `Posthog` client instance was initialised at module level in both `server.py` and `user_service.py`, reading credentials from environment variables. `atexit` is used to register `posthog_client.shutdown()` so that all buffered events are flushed before the process exits. `enable_exception_autocapture=True` is set on both clients so unhandled exceptions are automatically reported to PostHog. Eight events were captured in `server.py` (covering all critical authentication and content-management actions), and two events were captured in `user_service.py` (covering user lifecycle management in that standalone service). User identification (`posthog_client.set`) is called at login and registration to enrich person profiles.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates via the login endpoint. | `server.py` |
| `user_login_failed` | Fired when a login attempt fails because the user is not found or inactive. | `server.py` |
| `user_logged_out` | Fired when a user explicitly logs out and their session is destroyed. | `server.py` |
| `meeting_created` | Fired when a user submits a transcript and a new meeting summary is created. | `server.py` |
| `meeting_deleted` | Fired when a user permanently deletes one of their meeting records. | `server.py` |
| `user_registered` | Fired when a new user account is created via the API. | `server.py` |
| `user_profile_updated` | Fired when an existing user's profile fields are changed. | `server.py` |
| `user_account_deleted` | Fired when a user account is permanently removed from the system. | `server.py` |
| `user_registered` | Fired when a new user is registered through the UserService. | `user_service.py` |
| `user_deactivated` | Fired when a user account is deactivated (soft-deleted) through the UserService. | `user_service.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behaviour, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1777450)
- [User Logins Over Time](https://us.i.posthog.com/project/483112/insights/McWw6Iou/)
- [Login Failures](https://us.i.posthog.com/project/483112/insights/yppEtjwf/)
- [Meetings Created Over Time](https://us.i.posthog.com/project/483112/insights/i7Ct1q0M/)
- [Login to Meeting Creation Funnel](https://us.i.posthog.com/project/483112/insights/5P73Vz4N/)
- [User Registrations Over Time](https://us.i.posthog.com/project/483112/insights/w6oOzv1s/)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls identify — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
