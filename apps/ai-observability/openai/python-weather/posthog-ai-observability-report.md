# PostHog AI Observability setup

## Status

AI Observability is wired for the project's OpenAI Python client. The setup is **wired, unverified in PostHog**: no model request was made during setup, so you can confirm the resulting trace tree with your own OpenAI credentials.

## Changes made

- Added `posthog<8` alongside the existing `openai>=1.60.0` dependency in `requirements.txt`.
- Replaced the direct OpenAI client in `main.py` with `posthog.ai.openai.OpenAI`, backed by an instance-based `Posthog` client.
- Configured the client from `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables, with exception autocapture enabled and an `atexit` shutdown handler so this CLI flushes queued events before exit.
- Added one generated `posthog_trace_id` per `Conversation.ask()` call. Both model calls in a tool-using turn share that trace ID.
- Added `$ai_session_id` from `Conversation.thread_id` and the existing user ID to every model call.
- Captured each `get_weather` execution as an `$ai_span` sharing the active turn's trace and conversation session.
- Wrote the provided PostHog project configuration to the uncommitted local `.env` file and added empty placeholders to `.env.example`. No PostHog credentials are stored in source code.
- Recorded the integration in `.posthog-wizard-cache/.posthog-ai.json`.

## Verify it

1. Install the declared dependencies in your Python environment:
   ```bash
   pip3 install -r requirements.txt
   ```
2. Provide a valid `OPENAI_API_KEY` to the process (the repository's `.env.example` documents the required variable). Ensure your runtime also loads the configured `POSTHOG_API_KEY` and `POSTHOG_HOST` values from `.env` or exports them in the shell.
3. Run the smallest end-to-end path:
   ```bash
   python3 main.py
   ```
4. In **AI Observability → Traces**, open the newest trace. The two questions in `main.py` should appear under one AI session (`Conversation.thread_id`) as two traces. A turn where OpenAI invokes `get_weather` should contain generation → `get_weather` span → generation, all associated with the existing conversation user ID.

## Privacy mode

Privacy mode is currently **off** via `privacy_mode=False` in `main.py`. This captures prompt and completion content on SDK-captured AI events, which is the default behavior for this new integration.

Enable privacy mode before sending prompts or responses whose sensitive content must not be stored in PostHog. Change the client setting in `main.py` to `privacy_mode=True`, or add `posthog_privacy_mode=True` to an individual OpenAI call. Privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties, manually captured payloads, or data already stored in PostHog.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the full behavior.
