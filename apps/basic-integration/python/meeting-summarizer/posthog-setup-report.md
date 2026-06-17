# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python web application. The `posthog` and `python-dotenv` packages were added to `requirements.txt` and installed. A `Posthog` client instance is initialised at startup in `server.py` using environment variables, with `enable_exception_autocapture=True` so unhandled exceptions are tracked automatically. `atexit.register(posthog_client.shutdown)` ensures all queued events are flushed before the process exits. Ten events covering the full user lifecycle (auth, meeting management, and AI usage) were added to the server-side request handlers, along with `posthog_client.capture_exception()` calls in every top-level exception handler. On successful login, `posthog_client.set()` is called to attach non-PII person properties to the user's profile.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | A user successfully authenticated and started a session | `server.py` |
| `user_login_failed` | A login attempt was rejected (user not found or inactive) | `server.py` |
| `user_logged_out` | A user ended their session | `server.py` |
| `meeting_created` | A meeting transcript was submitted and saved after AI processing | `server.py` |
| `transcript_analyzed` | The AI summarizer completed analysis of a meeting transcript | `server.py` |
| `meeting_viewed` | A user opened the detail view for a specific meeting | `server.py` |
| `meeting_deleted` | A user permanently deleted one of their meetings | `server.py` |
| `meeting_stats_viewed` | A user viewed their meeting statistics dashboard | `server.py` |
| `user_registered` | A new user account was created in the system | `server.py` |
| `user_deleted` | A user account was permanently removed | `server.py` |

## Next steps

The PostHog MCP's dashboard and insight creation tools require additional API key scopes (`dashboard:write`, `insight:write`, `query:read`) that are not currently granted. To build the recommended "Analytics basics (wizard)" dashboard, visit PostHog and create the following insights manually:

- **User login trend** — Trends of `user_logged_in` over time, to track daily active users.
- **Login failure rate** — Trends comparing `user_logged_in` vs `user_login_failed`, to identify auth friction.
- **Meeting creation funnel** — Funnel from `user_logged_in` → `transcript_analyzed` → `meeting_created`, to measure conversion from login to meeting creation.
- **Meeting engagement** — Trends of `meeting_viewed` and `meeting_deleted`, to track engagement and churn signals.
- **Stats dashboard usage** — Trends of `meeting_stats_viewed`, to see how often users check their analytics.

- [Create a new insight](https://us.posthog.com/project/2/insights/new)
- [View all dashboards](https://us.posthog.com/project/2/dashboard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` (or equivalent bootstrap docs) so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `posthog_client.set()` — currently identification only fires on fresh login, which means returning sessions may not always update person properties.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
