<wizard-report>
# PostHog post-wizard report

The wizard has completed a full integration of PostHog analytics into the **AI Meeting Summarizer** Python CLI application.

## What was done

- **Installed** the `posthog` and `python-dotenv` packages and added them to `requirements.txt`
- **Created** `summarizer.py` — a fully-featured CLI application using `argparse` that summarizes meeting transcripts
- **Initialized** a `Posthog` client instance using environment variables (`POSTHOG_API_KEY`, `POSTHOG_HOST`) — never hardcoded
- **Enabled** `enable_exception_autocapture=True` for automatic unhandled exception tracking
- **Registered** `posthog.shutdown()` with `atexit` to guarantee event flushing on exit
- **Added** `posthog.capture_exception()` calls around critical error paths for error tracking
- **Set** environment variables in `.env` (gitignored) via the wizard-tools MCP

## Events instrumented

| Event | Description | File |
|---|---|---|
| `transcript_loaded` | Fired when a meeting transcript file is loaded for processing | `summarizer.py` |
| `meeting_summarization_started` | Fired when the summarization process begins | `summarizer.py` |
| `meeting_summarization_completed` | Fired when a summary is successfully generated | `summarizer.py` |
| `meeting_summarization_failed` | Fired when summary generation fails (with `error_type` property) | `summarizer.py` |
| `action_items_extracted` | Fired when action items are extracted from the summary | `summarizer.py` |
| `summary_exported` | Fired when a summary is exported to a JSON file | `summarizer.py` |

## Next steps

We've designed the following PostHog insights to monitor user behavior. You can create them in your PostHog project:

- 📊 **[Summarization Funnel](https://us.posthog.com/project/238460/insights/new?insight=FUNNELS)** — Conversion from `transcript_loaded` → `meeting_summarization_started` → `meeting_summarization_completed`
- 📈 **[Daily Summarization Activity](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)** — Trend of `meeting_summarization_started` vs `meeting_summarization_completed` over 30 days
- ⚠️ **[Failure Rate](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)** — Bar chart of `meeting_summarization_failed` vs `meeting_summarization_completed`
- ✅ **[Action Items Extracted](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)** — Daily count of `action_items_extracted` events as a meeting quality proxy
- 📤 **[Export Conversion](https://us.posthog.com/project/238460/insights/new?insight=FUNNELS)** — Funnel from `meeting_summarization_completed` → `summary_exported`

Create a new **"Analytics basics"** dashboard at:
👉 https://us.posthog.com/project/238460/dashboard/new

Then add the insights above to track the full meeting summarization lifecycle.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
