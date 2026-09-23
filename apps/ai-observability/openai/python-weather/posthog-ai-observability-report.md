# PostHog AI Observability setup

## Integration

- Selected `ai-observability-openai-python` because `requirements.txt` declares the modern OpenAI Python SDK (`openai>=1.60.0`) and `main.py` uses `chat.completions.create` directly.
- Added the `posthog` dependency without changing the OpenAI SDK version.
- Replaced the direct `openai.OpenAI` client with `posthog.ai.openai.OpenAI`, backed by an instance-based `Posthog` client.
- Configured the wrapper from `POSTHOG_API_KEY` and `POSTHOG_HOST`; no PostHog token or host is embedded in source code.
- Registered shutdown handling and explicitly shuts down the client on CLI exit so queued generations and spans flush.

## Trace model

- `Conversation.thread_id` is the AI session ID, so both sample questions belong to one session.
- Each `Conversation.ask()` call mints one UUID trace ID and passes that same ID to every OpenAI generation in the turn.
- `Conversation.user_id` is passed as the PostHog distinct ID.
- The existing `get_weather` dispatch now emits an `$ai_span` with the same trace and session IDs. Its input/output fields describe the tool operation.

## Environment

- Created a local `.env` with the configured PostHog public project token and host.
- Added `.env.example` with the required variable names but no values, and added `.env` to `.gitignore`.
- The application also requires `OPENAI_API_KEY` at runtime. Export the environment variables (or have your process manager load `.env`) before running the script.

## Verification

Static verification confirms that `main.py` imports the PostHog wrapper, creates the PostHog client from environment variables, adds a stable per-turn trace ID to both model calls, and records the tool span in the same trace.

No live model request or SDK import check was run: this project has no configured Python environment or verification script, and no OpenAI credential was supplied. The setup is therefore **wired but unverified**.

To verify with a real OpenAI credential:

1. Install the declared dependencies in your managed Python environment.
2. Export `POSTHOG_API_KEY`, `POSTHOG_HOST`, and `OPENAI_API_KEY` (or load `.env` through your usual environment loader).
3. Run `python3 main.py`.
4. In PostHog, open **AI Observability → Traces** and inspect the newest session. Expect one session with two traces: each trace has a generation; the weather turn has `generation → get_weather span → generation`.
