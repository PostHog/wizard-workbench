# PostHog AI Observability setup

## Integration

- Selected the **Anthropic Python** wrapper because `requirements.txt` declares the direct `anthropic` SDK and the model calls are made in `main.py`.
- Added the `posthog` dependency to `requirements.txt`.
- Configured the PostHog project token and host in the local `.env` as `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`. The application reads both values from the environment; no PostHog credential is embedded in source.
- Replaced the direct Anthropic client with `posthog.ai.anthropic.Anthropic`, backed by an instance-based `Posthog` client in `main.py`.
- Registered `posthog_client.shutdown` with `atexit` so this short-lived CLI flushes queued observability events on exit.

## Trace structure

The integration preserves the weather assistant's existing tool loop and produces the following tree for a tool-using request:

- One AI session per script process (`SESSION_ID`).
- One trace per `ask()` invocation (`trace_id`).
- One `$ai_generation` for the initial Claude call.
- One `$ai_span` for the `get_weather` execution, with the same trace and session IDs.
- One `$ai_generation` for the Claude follow-up, sharing the same trace and session IDs.
- Calls and the tool span are attributed to the existing stable `USER_ID`.

## Verification

Source-level verification confirmed:

- Both Claude calls use the wrapped client and receive the same per-turn `posthog_trace_id`.
- Both calls receive the process-scoped `$ai_session_id`.
- The existing weather tool dispatch emits an `$ai_span` with matching trace and session IDs.
- `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are present in `.env`.
- `.posthog-wizard-cache/.posthog-ai.json` records this Anthropic wrapper integration.

No model request was made during setup, so delivery is **wired but unverified**. Install the declared dependencies in your Python environment, ensure `ANTHROPIC_API_KEY` is configured, then run:

```bash
python3 main.py
```

Open **AI Observability → Traces** in PostHog and inspect the newest trace. A tool-using response should contain two Claude generations and one `get_weather` span under one trace. Run another question in the same process to confirm both traces appear in the same AI session.

## Privacy mode

`privacy_mode=False` is set in `main.py` on the `Posthog` constructor. This means SDK-captured prompt and completion content is sent to PostHog by default. Enable privacy mode before sending prompts or responses whose sensitive content must not be stored by changing that setting to `privacy_mode=True`, or by passing `posthog_privacy_mode=True` to an individual Anthropic call. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not alter already-stored events or arbitrary custom payloads.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
