<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. PostHog event tracking, user identification, and exception autocapture were added to `server.py` and `user_service.py`. The PostHog SDK is initialized using environment variables and shuts down cleanly on exit to ensure all queued events are flushed.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully authenticates and a session is created | `server.py` |
| `user_login_failed` | Fired when a login attempt fails due to invalid credentials or inactive account | `server.py` |
| `user_logged_out` | Fired when a user explicitly logs out and the session is deleted | `server.py` |
| `user_registered` | Fired when a new user account is created via the API | `server.py` |
| `meeting_created` | Fired when a meeting transcript is submitted and a meeting record is saved | `server.py` |
| `meeting_summarized` | Fired after AI analysis completes on a transcript, capturing word count and result counts | `server.py` |
| `meeting_deleted` | Fired when a user deletes a meeting record | `server.py` |
| `user_deactivated` | Fired when a user account is deactivated (soft delete) via the user service | `user_service.py` |
| `user_deleted` | Fired when a user account is permanently deleted via the user service | `user_service.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [PostHog Project Dashboard](https://us.posthog.com/project/238460/dashboard)
- [Insights: Login to Meeting Created Funnel](https://us.posthog.com/project/238460/insights#insight=FUNNELS&events=%5B%7B%22id%22%3A%22user_logged_in%22%7D%2C%7B%22id%22%3A%22meeting_created%22%7D%5D)
- [Insights: Daily Meeting Creations Trend](https://us.posthog.com/project/238460/insights#insight=TRENDS&events=%5B%7B%22id%22%3A%22meeting_created%22%7D%5D&interval=day)
- [Insights: AI Summarization Usage](https://us.posthog.com/project/238460/insights#insight=TRENDS&events=%5B%7B%22id%22%3A%22meeting_summarized%22%7D%5D&interval=day)
- [Insights: User Churn (Deactivated + Deleted)](https://us.posthog.com/project/238460/insights#insight=TRENDS&events=%5B%7B%22id%22%3A%22user_deactivated%22%7D%2C%7B%22id%22%3A%22user_deleted%22%7D%5D&interval=week)
- [Insights: Login Failures](https://us.posthog.com/project/238460/insights#insight=TRENDS&events=%5B%7B%22id%22%3A%22user_login_failed%22%7D%5D&interval=day)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
