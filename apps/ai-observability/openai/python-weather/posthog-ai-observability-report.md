# PostHog AI Observability setup

## Integration

- Selected **OpenAI Python** (`ai-observability-openai-python`) because this project directly uses `openai>=1.60.0` and its `chat.completions.create` API, with no framework or gateway override.
- Added `posthog>=7.0.0` to `requirements.txt`. The dependency is declared but not installed; the workflow intentionally leaves installation to the project build environment.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env` file using the supplied project configuration. No token or host is embedded in source code.
- Replaced the OpenAI client in `main.py` with `posthog.ai.openai.OpenAI`, backed by an instance-based `Posthog` client.
- The PostHog client enables exception autocapture, is registered with `atexit`, and is shut down explicitly by the CLI so buffered AI events are sent before exit.

## Trace model

`Conversation.thread_id` is the AI session ID and `Conversation.user_id` is the distinct ID. Every `Conversation.ask()` call creates one UUID trace ID, which is passed to every OpenAI call in that turn.

When the model runs `get_weather`, the application captures an `$ai_span` in the same trace with the tool input, output, and latency. The original tool and message loop behavior remains unchanged.

Expected hierarchy after running the sample conversation:

- One session for `thread_abc`
- One trace for each `ask()` turn
- One or two OpenAI generations per trace, depending on whether the model requests the tool
- A `get_weather` span between the two generations when the tool is called
- All events attributed to `user_123`

## Verification

Static verification completed:

- The wrapped client is used for both `chat.completions.create` calls.
- Both calls in a turn receive the same `posthog_trace_id` and `$ai_session_id`.
- The tool span receives that same trace and session ID.
- Environment keys are present in `.env`.

Runtime delivery is **wired but unverified**. No project build, test, or supported package-manager command is defined, and this setup does not have an OpenAI credential to trigger a real model request.

To verify delivery, install the declared dependencies in your normal build environment, configure `OPENAI_API_KEY`, then run:

```bash
python3 main.py
```

Open **AI Observability → Traces** in PostHog and inspect the newest trace. Run both sample turns to confirm that they share one AI session while each has its own trace. If a tool call occurs, confirm its `get_weather` span appears between the corresponding generations.

## Privacy mode

Privacy mode is explicitly disabled with `privacy_mode=False` in `main.py` (the `Posthog` client constructor). This means SDK-captured prompt and completion content is sent to PostHog, consistent with the default AI Observability setup.

Before sending prompts or responses whose sensitive content must not be stored in PostHog, set `privacy_mode=True` in that constructor, or set `posthog_privacy_mode=True` on an individual OpenAI call. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not retroactively modify stored events or automatically filter arbitrary custom or manually captured properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
