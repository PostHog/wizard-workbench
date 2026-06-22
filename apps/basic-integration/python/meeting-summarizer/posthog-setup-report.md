<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for the AI Meeting Summarizer Python web application. The `posthog` and `python-dotenv` packages were installed and added to `requirements.txt`. A `Posthog` client instance (instance-based API, `enable_exception_autocapture=True`) is initialized at module load in both `server.py` and `user_service.py`, with credentials read from environment variables and `atexit.register(posthog_client.shutdown)` registered to ensure all queued events are flushed before either process exits.

Ten events were added across both files covering the full user lifecycle and meeting workflow: user authentication (login success and failure), session termination, meeting transcript submission, meeting viewing, meeting listing, meeting deletion, stats review, user registration, and user deactivation. User identity is persisted on both login (in `server.py`) and registration (in `user_service.py`) via `posthog_client.set(distinct_id=..., properties={...})`, setting `username` and `email` as person properties. No PII is sent in `capture()` event properties.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated and a session was created. | server.py |
| `login_failed` | A login attempt was rejected due to invalid credentials or inactive account. | server.py |
| `user_logged_out` | User explicitly ended their session by logging out. | server.py |
| `meeting_submitted` | User submitted a meeting transcript for AI summarization. | server.py |
| `meeting_viewed` | User opened a specific meeting to review its summary and action items. | server.py |
| `meetings_listed` | User viewed their list of past meetings. | server.py |
| `meeting_deleted` | User permanently deleted a meeting record. | server.py |
| `stats_viewed` | User viewed their meeting statistics dashboard. | server.py |
| `user_registered` | A new user account was created in the system. | user_service.py |
| `user_deactivated` | A user account was deactivated (soft-deleted). | user_service.py |

## Next steps

Create a dashboard in PostHog to monitor these key metrics. Suggested insights:

1. **Meeting submissions over time** — Trends chart on `meeting_submitted` to track product usage growth.
2. **Auth funnel** — Funnel from `user_registered` → `user_logged_in` → `meeting_submitted` to measure activation.
3. **Login failure rate** — Trends comparing `user_logged_in` and `login_failed` side-by-side.
4. **Churn signal** — Trend on `user_deactivated` to monitor account cancellations.
5. **Meeting engagement** — Breakdown of `meeting_viewed` and `meeting_deleted` to understand content value.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` (or any bootstrap scripts) so collaborators know what values to set.
- [ ] Confirm the returning-visitor path also calls `set()` to update person properties — the current implementation only identifies on fresh login and registration; returning sessions on existing sessions may not have up-to-date person properties if user details change.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
