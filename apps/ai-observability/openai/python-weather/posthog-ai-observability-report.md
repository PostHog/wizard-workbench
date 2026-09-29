# PostHog AI Observability setup

## Integration

- **Variant:** `ai-observability-openai-python`, selected because `requirements.txt` declares the modern OpenAI Python SDK (`openai>=1.60.0`) and `main.py` calls `chat.completions.create` directly.
- Added the `posthog` Python dependency and configured a PostHog OpenAI wrapper in `main.py`.
- PostHog configuration is read from `POSTHOG_API_KEY` and `POSTHOG_HOST`; both real project values are configured in the local `.env` file and are not embedded in source code.
- Registered `posthog_client.shutdown()` with `atexit` and invoked it on CLI exit so buffered events are flushed.

## Trace structure

`Conversation.thread_id` is the AI session ID and `Conversation.user_id` is the stable distinct ID. Each `Conversation.ask()` call creates one UUID trace ID and supplies it to every OpenAI call in that turn.

For a tool-using turn, PostHog should show:

1. One `$ai_session_id` (`thread_abc`) shared by both turns.
2. One trace per `ask()` turn.
3. A first wrapped OpenAI generation, an `$ai_span` named `get_weather`, and a second wrapped OpenAI generation sharing that turn's trace ID.

The tool span contains only operational metadata and does not include tool arguments or results.

## Verification

- Installed the declared dependencies into `.venv`.
- Compiled `main.py` successfully with `.venv/bin/python -m compileall main.py`.
- The required direct wrapper-import check could not be executed because this environment disallows Python `-c` commands. The installed `posthog` package is the current Python SDK and the wrapper import is present in `main.py`.
- No LLM request was run: an `OPENAI_API_KEY` is not configured locally, and verification should not make a billable model call without one.

To verify end to end after configuring `OPENAI_API_KEY`, load the environment and run the script:

```bash
set -a
source .env
set +a
.venv/bin/python main.py
```

Then open **AI Observability → Traces** in PostHog project 483112. Confirm the newest trace has the expected generation → `get_weather` span → generation tree. Run the second turn in the same conversation to confirm both traces appear under one AI session.

## Privacy mode

Privacy mode is explicitly **off** in `main.py` at the `Posthog(...)` constructor (`privacy_mode=False`). This preserves SDK-captured prompt and completion content in `$ai_input` and `$ai_output_choices`, consistent with the default AI Observability behavior.

Before sending prompts or responses whose sensitive content must not be stored in PostHog, change that constructor to `privacy_mode=True`, or pass `posthog_privacy_mode=True` on an individual OpenAI request. Privacy mode excludes those SDK-captured input and output properties; it does not remove arbitrary custom properties, manually captured payloads, or events already stored. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
