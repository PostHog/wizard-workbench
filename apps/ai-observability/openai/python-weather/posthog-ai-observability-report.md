# PostHog AI Observability setup

## Status

Wired and statically verified. A live trace has not been sent because this workflow does not run the model or use an OpenAI credential.

## Integration

- Selected `ai-observability-openai-python`: the project uses the modern direct `openai>=1.60.0` Python client and has no framework or gateway override.
- Added `posthog>=7.0.0` to `requirements.txt` without changing the OpenAI dependency.
- Replaced the direct OpenAI client in `main.py` with `posthog.ai.openai.OpenAI`, backed by an instance-based `Posthog` client.
- The PostHog project token and host are read from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; the provided values were added to the local `.env` file. `.env.example` documents these keys plus `OPENAI_API_KEY` without credentials.
- The PostHog client enables exception autocapture and registers shutdown handling. The CLI also explicitly shuts it down so queued observability events are flushed before exit.

## Trace structure

- `Conversation.thread_id` is the AI session ID, grouping the two sample questions into one session.
- Each `Conversation.ask()` call creates one UUID trace ID. Both model calls in a tool-assisted response share that trace ID.
- `Conversation.user_id` is passed as the PostHog distinct ID for both generations and the weather-tool span.
- The existing `get_weather` dispatch now emits an `$ai_span` with the same session and trace IDs, tool input/output state, span ID, and elapsed latency.
- The existing response-message append and weather implementation were preserved.

## Privacy mode

`main.py` creates the PostHog client with `privacy_mode=False`. This captures the prompt and completion content in SDK-captured AI events, matching the default AI Observability behavior.

Before sending prompts or responses whose sensitive content must not be stored in PostHog, change that constructor setting to `privacy_mode=True` (or pass `posthog_privacy_mode=True` on an individual OpenAI call). Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove arbitrary custom properties or previously stored data.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Verify live delivery

1. Install the declared dependencies in the project’s Python environment.
2. Make `OPENAI_API_KEY`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST` available to the process. The local `.env` file is not loaded automatically by this standalone script, so export/source its values through your usual environment-loading mechanism.
3. Run `python3 main.py` to execute both questions in the same conversation.
4. In PostHog, open **AI Observability → Traces** and inspect the newest traces. Expect one `thread_abc` session containing two traces. A tool-assisted trace should contain generation → `get_weather` span → generation, all attributed to `user_123`.

No project build script or virtual environment is present, so no automated import, build, or model invocation was run during this setup.
