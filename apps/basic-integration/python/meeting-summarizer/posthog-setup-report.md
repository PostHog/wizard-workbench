# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for the AI Meeting Summarizer Python application. The `posthog` and `python-dotenv` packages were added to `requirements.txt` and installed. A single shared `Posthog` client instance is created in `server.py` at startup using environment variables, with exception autocapture enabled and an `atexit` shutdown hook so events are always flushed on exit. Event capture was added to every significant user action in `server.py`, and the `AISummarizer.analyze_transcript` method was updated to accept and use the shared client so transcript analysis is also tracked. User identity (username, active status) is set on every successful login via `posthog_client.set()`.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates via the login endpoint. | `server.py` |
| `user_login_failed` | Fired when a login attempt fails because the user is not found or is inactive. | `server.py` |
| `user_logged_out` | Fired when a user ends their session via the logout endpoint. | `server.py` |
| `meeting_created` | Fired when a user submits a meeting transcript and it is successfully saved. | `server.py` |
| `meeting_deleted` | Fired when a user permanently deletes one of their meetings. | `server.py` |
| `meeting_viewed` | Fired when a user fetches a specific meeting by ID. | `server.py` |
| `meetings_listed` | Fired when a user loads their full list of meetings from the dashboard. | `server.py` |
| `user_created` | Fired when an authenticated user creates a new user account in the system. | `server.py` |
| `user_deleted` | Fired when an authenticated user permanently deletes another user account. | `server.py` |
| `transcript_analyzed` | Fired when the AI summarizer finishes processing a meeting transcript. | `server.py` (via `ai_summarizer.py`) |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824563)
- **Login funnel** — conversion from login → meeting_created: [View insight](https://us.posthog.com/project/483112/insights/5qKizGoe)
- **Meetings created over time** — daily volume trend: [View insight](https://us.posthog.com/project/483112/insights/oiRw8sMz)
- **Daily active users** — unique users logging in per day: [View insight](https://us.posthog.com/project/483112/insights/QajBG36l)
- **Login failures vs successes** — side-by-side bar chart: [View insight](https://us.posthog.com/project/483112/insights/CDYEO5UK)
- **Meeting deletion rate** — created vs deleted per week: [View insight](https://us.posthog.com/project/483112/insights/JnUyehGV)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `posthog_client.set()` — the current implementation only identifies users on fresh login, which can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
