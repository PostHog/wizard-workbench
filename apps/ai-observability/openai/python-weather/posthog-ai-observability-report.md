# PostHog AI Observability setup

## Integration

- **Selected workflow:** `ai-observability-openai-python`, selected because `requirements.txt` contains the modern `openai>=1.60.0` SDK and the app makes direct `chat.completions.create` calls.
- **Dependency:** Added `posthog>=7.0.0` to `requirements.txt` and installed the declared dependencies in the project-local `.venv`.
- **Configuration:** `POSTHOG_API_KEY` and `POSTHOG_HOST` are configured in the local `.env` file. The application reads both values from the environment; no PostHog credentials are embedded in source.
- **Wrapper:** `main.py` creates a `Posthog` client and uses `posthog.ai.openai.OpenAI` as the drop-in OpenAI client. It is registered for shutdown and explicitly shut down for this CLI so queued events flush before the process exits.

## Trace structure

`Conversation.thread_id` is the AI session identifier and `Conversation.user_id` is the distinct ID. Each `Conversation.ask()` creates exactly one UUID trace ID. Both OpenAI calls in the tool path receive that same trace ID, session ID, and distinct ID.

When the model invokes `get_weather`, the existing dispatch loop emits an `$ai_span` with the same trace and session IDs. This produces the expected tree for a tool turn:

```text
session: thread_abc
└─ trace: one Conversation.ask()
   ├─ generation: initial chat completion
   ├─ span: get_weather (when called)
   └─ generation: follow-up chat completion
```

## Privacy mode

Privacy mode is **off** via `privacy_mode=False` in `main.py:20`. Prompt and completion content captured by the wrapper will therefore be sent to PostHog. Before sending prompts or responses whose content must not be stored in PostHog, change that setting to `privacy_mode=True`; supported individual calls may instead pass `posthog_privacy_mode=True`.

Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events. It does not retroactively remove existing data or necessarily filter unrelated custom properties. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Verification

- Installed dependencies successfully with `.venv/bin/pip install -r requirements.txt`.
- Syntax verification passed with `.venv/bin/python3 -m compileall main.py`.
- No OpenAI request was sent during setup because no OpenAI credential was supplied.
- The runtime disallowed the workflow's prescribed one-line wrapper-import check, so this integration is **wired, but unverified in PostHog**.

To verify it, supply `OPENAI_API_KEY`, make the `.env` variables available to the process, then run the example:

```bash
set -a
. ./.env
set +a
OPENAI_API_KEY=your_openai_api_key .venv/bin/python3 main.py
```

Then open **AI Observability → Traces** in PostHog. Confirm that the two sample questions share the `thread_abc` session, each question has a separate trace, and any tool-using turn shows the initial generation, `get_weather` span, and follow-up generation under one trace.
