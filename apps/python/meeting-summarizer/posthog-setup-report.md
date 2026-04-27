<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the AI Meeting Summarizer with PostHog. Two files were created (`posthog_client.py` and updates to `requirements.txt`) and `server.py` was instrumented with 10 events covering the full user journey: authentication, meeting lifecycle, and server-side error tracking. The PostHog client is initialized via environment variable (`POSTHOG_PROJECT_TOKEN`) and is safe to run without the variable set — the app degrades gracefully with a warning log.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated | `server.py` |
| `user_login_failed` | Login attempt failed (user not found or inactive) | `server.py` |
| `user_logged_out` | User ended their session | `server.py` |
| `user_registered` | New user account created by an admin/authenticated user | `server.py` |
| `user_deactivated` | User account permanently deleted — churn signal | `server.py` |
| `meeting_created` | User submitted a transcript and AI summary was generated — core conversion | `server.py` |
| `meeting_viewed` | User retrieved a specific meeting | `server.py` |
| `meeting_deleted` | User deleted a meeting | `server.py` |
| `meetings_listed` | User fetched their meeting list | `server.py` |
| `stats_viewed` | User viewed their meeting statistics | `server.py` |

## Next steps

We recommend building an **Analytics basics** dashboard in PostHog with these five insights — use the links below to open a pre-filled new insight for each:

- **Login → Meeting created conversion funnel** — track how many users who log in go on to create a meeting: [Create funnel insight](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_logged_in","type":"events","order":0},{"id":"meeting_created","type":"events","order":1}]})
- **Meeting creation trend** — daily volume of `meeting_created` to track product usage growth: [Create trends insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"meeting_created","math":"dau"}]})
- **Active users (DAU)** — daily active users via `user_logged_in`: [Create trends insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_logged_in","math":"dau"}]})
- **User churn events** — track `user_deactivated` over time as a leading indicator of churn: [Create trends insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_deactivated"}]})
- **Error rate** — automatically captured exceptions via `$exception` (enabled via `enable_exception_autocapture=True`): [Create trends insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"$exception"}]})

You can also [create a new dashboard](https://us.posthog.com/project/2/dashboard/new) named **Analytics basics** and add these insights to it.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
