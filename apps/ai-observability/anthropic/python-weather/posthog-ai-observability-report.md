# PostHog AI Observability setup

## Integration summary

Instrumented the Anthropic Python weather assistant using the `ai-observability-anthropic-python` workflow. The project directly uses the Anthropic SDK, so the PostHog Anthropic wrapper is the appropriate integration path.

### Changes made

- Added `posthog>=7.70.0` to `requirements.txt`.
- Added `.env.example` with documented, empty `POSTHOG_API_KEY` and `POSTHOG_HOST` entries.
- Configured those keys in the local `.env` file using the supplied project configuration. No token or ingestion host is embedded in source code.
- Replaced the direct Anthropic client with `posthog.ai.anthropic.Anthropic` in `main.py` and attached a `Posthog` client configured from environment variables.
- Enabled exception autocapture and registered `posthog.shutdown` with `atexit` so this short-lived CLI flushes buffered observability events when it exits.
- Added a process-run `$ai_session_id`, one `posthog_trace_id` per `ask()` turn, and the existing application user ID to both Anthropic calls.
- Captured the existing weather-tool execution as an `$ai_span` in the same trace. The weather module and tool loop behavior were otherwise preserved.
- Wrote the integration run record to `.posthog-wizard-cache/.posthog-ai.json`.

## Expected trace tree

Running one `ask()` turn that invokes the weather tool should produce:

```text
session (one process run)
└─ trace (one ask() turn)
   ├─ Anthropic generation
   ├─ get_weather span
   └─ Anthropic follow-up generation
```

All items share the same AI session and trace IDs, and generations/spans are attributed to the existing application user ID. If the model does not call the tool, the trace correctly contains only one generation.

## Verify in PostHog

1. Install the declared dependencies in the environment that runs the app.
2. Ensure `ANTHROPIC_API_KEY`, `POSTHOG_API_KEY`, and `POSTHOG_HOST` are configured.
3. Run `python3 main.py`.
4. Open **AI Observability → Traces** and inspect the newest trace.
5. Confirm that the trace contains the generation → `get_weather` span → follow-up generation sequence, with both generations sharing a trace ID and the process-run session ID.

This setup has been statically reviewed: the SDK dependency, wrapper import and initialization, session/trace propagation, tool span, shutdown hook, and required environment keys are present. A live model call and import execution were not run because this workflow declares dependencies for the project environment rather than installing or invoking provider credentials during setup. The integration is therefore **wired, pending live verification**.

## Privacy mode

Privacy mode is explicitly disabled at `main.py:18` (`privacy_mode=False`). This is the default integration behavior and means the SDK can capture LLM prompt and completion content in `$ai_input` and `$ai_output_choices`.

Before processing prompts or responses that must not be stored in PostHog, change that client option to `privacy_mode=True`. For an individual Anthropic request, use `posthog_privacy_mode=True` instead. Privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not retroactively remove previously ingested events or automatically scrub arbitrary custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
