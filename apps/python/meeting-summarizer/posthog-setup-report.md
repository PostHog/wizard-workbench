<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. PostHog is now initialized as an instance-based client (`Posthog()`) in both `server.py` and `user_service.py`, loaded from environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`). `python-dotenv` is used to load these from `.env`. Exception autocapture is enabled on both clients, and `posthog_client.shutdown()` is registered with `atexit` to ensure all queued events are flushed before the process exits.

User identification (`posthog_client.set()`) is called on login and registration to keep person profiles up to date with non-PII metadata (username, full_name). Exception capture (`capture_exception()`) has been added to all four HTTP verb handlers (`do_GET`, `do_POST`, `do_PUT`, `do_DELETE`) to automatically record unhandled server errors.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully authenticates via the login endpoint | `server.py` |
| `user_logged_out` | User ends their session via the logout endpoint | `server.py` |
| `user_registered` | A new user account is created via the API | `server.py` |
| `meeting_created` | A new meeting is submitted and AI summarization is completed | `server.py` |
| `meeting_viewed` | A user fetches a specific meeting's details | `server.py` |
| `meeting_deleted` | A user deletes one of their meetings | `server.py` |
| `stats_viewed` | A user requests their meeting statistics summary | `server.py` |
| `user_profile_updated` | A user's profile fields are updated via the API | `server.py` |
| `user_deleted` | A user account is permanently removed via the API | `server.py` |
| `user_deactivated` | A user account is deactivated (soft delete) via the user service | `user_service.py` |

## Next steps

We've identified key insights to build for this project on the Analytics basics dashboard. Head there to add these insights based on your newly instrumented events:

- **Meeting Creation Funnel** — `user_logged_in` → `meeting_created`: tracks how many logged-in users go on to create a meeting
- **Meeting Activity Trend** — `meeting_created` over time: understand how often meetings are being summarized
- **User Retention** — `user_logged_in` unique users over time: track daily/weekly active users
- **Churn Signals** — `user_deactivated` + `user_deleted` over time: spot early signs of account churn
- **Engagement Depth** — `meeting_viewed` + `stats_viewed` over time: see how deeply users explore their data

Dashboard: [Analytics basics](https://us.posthog.com/project/2/dashboard/1344803)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
