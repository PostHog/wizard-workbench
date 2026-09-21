# PostHog AI Observability setup

## Integration summary

- **Variant:** OpenAI Python (`ai-observability-openai-python`)
- **Why:** `requirements.txt` declares `openai>=1.60.0`, and `main.py` makes direct `chat.completions.create` calls without a framework or OpenAI-compatible gateway override.
- **Status:** Wired, with runtime delivery unverified. The SDK dependency is declared but this run did not invoke the model or execute an ad-hoc import check.

## Changes made

- Added the `posthog` Python SDK to `requirements.txt`.
- Configured `main.py` with an instance-based `Posthog` client, exception autocapture, and an `atexit` shutdown hook.
- Replaced the active client constructor with `posthog.ai.openai.OpenAI`, while preserving the existing OpenAI call shape and tool loop.
- Added one UUID trace ID per `Conversation.ask()` turn and passed it to both generation calls.
- Attached the conversation's stable `thread_id` as `$ai_session_id` and the existing `user_id` as `posthog_distinct_id` on every generation.
- Captured the `get_weather` execution as a `$ai_span` with the same trace and session identifiers.
- Stored the supplied PostHog project token and host in the local `.env` file as `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; no credentials were written to source code.
- Added `.posthog-wizard-cache/.posthog-ai.json` pointing to the wrapper construction in `main.py`.

## Expected event tree

For the existing two-turn script, PostHog AI Observability should receive:

- one session for `thread_abc`;
- two traces—one for each `ask()` call;
- for a tool-using turn, two OpenAI generations and one `get_weather` span sharing that trace ID;
- attribution to the conversation's `user_id` (`user_123` in the sample entry point).

## Verify delivery

1. Ensure dependencies are installed from `requirements.txt` and `OPENAI_API_KEY` is configured in your shell.
2. Run `python3 main.py`.
3. In PostHog, open **LLM Analytics → Traces** and inspect the newest trace.
4. Confirm both turns share the `$ai_session_id`, each turn has its own trace ID, and any tool turn contains the `get_weather` span between its two generations.

If no events arrive, first confirm that `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are available to the process and that the process exits normally so the registered shutdown hook flushes buffered events.
