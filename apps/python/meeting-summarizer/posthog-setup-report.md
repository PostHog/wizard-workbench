<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **AI Meeting Summarizer** Python CLI application.

## Summary of changes

A new file `meeting_summarizer.py` was created as the main CLI application. It includes:

- **PostHog initialization** using the instance-based `Posthog()` constructor with `enable_exception_autocapture=True` for automatic exception tracking.
- **`atexit` shutdown registration** to ensure all events are flushed before the process exits.
- **User identification** via `posthog.set()` and `posthog.set_once()` on the `register` command, setting person properties (display name, registration timestamps) without PII in event properties.
- **6 tracked events** covering the full user journey — from first registration through daily meeting summarization to export and deletion.
- **Manual exception capture** (`posthog.capture_exception()`) in error-prone paths such as transcript processing and file I/O.
- **Environment variable configuration** — all PostHog credentials are loaded from `.env` via `python-dotenv`.

`requirements.txt` was updated to add `posthog>=3.0.0` and `python-dotenv>=1.0.0`.

`.env` was created with `POSTHOG_API_KEY` and `POSTHOG_HOST` values (covered by `.gitignore`).

## Instrumented events

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user profile is created; also calls `posthog.set()` to identify the user | `meeting_summarizer.py` |
| `meeting_summarized` | Fired when a meeting transcript is successfully processed and summarized | `meeting_summarizer.py` |
| `meetings_listed` | Fired when a user lists all saved meetings — indicates ongoing engagement | `meeting_summarizer.py` |
| `summary_viewed` | Fired when a user views a saved summary — top of the review & sharing funnel | `meeting_summarizer.py` |
| `summary_exported` | Fired when a user exports a summary to a file — key conversion action | `meeting_summarizer.py` |
| `meeting_deleted` | Fired when a user deletes a saved meeting record — potential churn signal | `meeting_summarizer.py` |

## Next steps

We've prepared the following **"Analytics basics"** dashboard and insights for you to keep an eye on user behavior. Visit your PostHog project to create them:

- 🏠 **Project overview**: [PostHog project 238460](https://us.posthog.com/project/238460)
- 📊 **Dashboards**: [Create new dashboard](https://us.posthog.com/project/238460/dashboard)

### Recommended insights for your "Analytics basics" dashboard

1. **Meetings Summarized Over Time** — Trend of `meeting_summarized` events. Tracks core product usage.
   [Create insight](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"meeting_summarized"}]})

2. **Summary Export Funnel** — Funnel: `meeting_summarized` → `summary_viewed` → `summary_exported`. Measures how many users complete the review-and-export flow.
   [Create insight](https://us.posthog.com/project/238460/insights/new#{"insight":"FUNNELS","events":[{"id":"meeting_summarized"},{"id":"summary_viewed"},{"id":"summary_exported"}]})

3. **New User Registrations** — Trend of `user_registered` events. Tracks user acquisition.
   [Create insight](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"user_registered"}]})

4. **Meeting Deletion Rate (Churn Signal)** — Trend of `meeting_deleted` events. Elevated deletion rates may indicate dissatisfaction.
   [Create insight](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"meeting_deleted"}]})

5. **User Engagement Overview** — Stacked trend of `meetings_listed`, `summary_viewed`, and `summary_exported`. Shows breadth of engagement.
   [Create insight](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"meetings_listed"},{"id":"summary_viewed"},{"id":"summary_exported"}]})

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
