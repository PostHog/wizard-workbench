<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. Two files were instrumented: `server.py` (the main HTTP server) and `user_service.py` (the background user management service). A `Posthog` instance is initialised at module level in each file using environment variables, with `enable_exception_autocapture=True` for automatic exception tracking and `atexit.register(posthog_client.shutdown)` to guarantee all queued events are flushed before the process exits. User identity is set via `posthog_client.set()` on login and registration so person profiles are populated with username, email, and full name. `python-dotenv` was added to load `.env` values at startup.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates via the login endpoint. | `server.py` |
| `user_logged_out` | Fired when a user ends their session via the logout endpoint. | `server.py` |
| `meeting_created` | Fired when a user submits a transcript and a new meeting summary is generated. | `server.py` |
| `meeting_viewed` | Fired when a user fetches a specific meeting by ID. | `server.py` |
| `meetings_listed` | Fired when a user retrieves their full list of meetings. | `server.py` |
| `meeting_deleted` | Fired when a user permanently deletes one of their meetings. | `server.py` |
| `stats_viewed` | Fired when a user requests their aggregate meeting statistics. | `server.py` |
| `user_registered` | Fired when a new user account is successfully created. | `server.py` |
| `user_deactivated` | Fired when a user account is deactivated through the user service. | `user_service.py` |
| `user_deleted` | Fired when a user account is permanently deleted. | `user_service.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1792520)
- [Registration to Meeting Creation Funnel](https://us.posthog.com/project/483112/insights/Ny7cwfs9)
- [Meetings Created Over Time](https://us.posthog.com/project/483112/insights/jXv08Srk)
- [User Logins Over Time](https://us.posthog.com/project/483112/insights/8vlPVJ8Y)
- [Meeting Deletions Over Time](https://us.posthog.com/project/483112/insights/gDCtRbnA)
- [Active Users (Meeting Creators)](https://us.posthog.com/project/483112/insights/rJ3yxd3B)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
