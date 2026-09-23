# PostHog AI Observability setup

## Implemented

- Selected the `ai-observability-openai-python` workflow because the project uses the modern Python `openai` SDK directly (`openai>=1.60.0`).
- Declared the `posthog` Python SDK alongside the existing OpenAI dependency in `pyproject.toml`.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env` file using the supplied project values. No credentials were written to source code.
- Replaced the existing OpenAI client constructor in `main.py` with PostHog's compatible `posthog.ai.openai.OpenAI` wrapper and a `Posthog` client constructed from environment variables.
- Registered `posthog_client.shutdown` with `atexit` so buffered observability data is flushed when this CLI exits.
- Added the workflow run record at `.posthog-wizard-cache/.posthog-ai.json`.

## AI tree shape

The script has no persistent conversation field, so one UUID is generated per script run as `$ai_session_id`.

- The corpus-startup embeddings, first question embedding, and first response share the first answer's trace ID.
- The second question embedding and response share a newly generated trace ID.
- Both traces share the run's session ID and are attributed to the existing `USER_ID` value.
- No `$ai_span` events were added: `retrieve()` is local Python retrieval, not an LLM tool dispatch loop.

This produces the documented topology of one session containing two `embedding → generation` traces.

## Verification status

Static verification passed: the wrapper import and client construction are present, every OpenAI embedding and response call carries the same session ID for the run, and all calls within each answer trace share one trace ID.

Runtime delivery is **wired but unverified**. This workflow intentionally only declares dependencies in the manifest; it does not install them. The project also has no build or test script to run. `OPENAI_API_KEY` is not configured in the local environment, so the script was not executed.

## Verify delivery

1. Install/sync the dependencies declared in `pyproject.toml` using the project's normal Python environment.
2. Ensure the process receives `POSTHOG_API_KEY`, `POSTHOG_HOST`, and a valid `OPENAI_API_KEY`. The script reads environment variables directly; a `.env` file must be exported or loaded by the launch environment.
3. Run `python3 main.py` from that configured environment.
4. In PostHog project 483112, open **AI Observability → Traces** and inspect the newest session. Confirm it contains two traces, each with an embedding and response generation, all attributed to the existing user ID.
