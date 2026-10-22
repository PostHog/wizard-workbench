# PostHog AI Observability setup

## Status

AI Observability is wired for the direct OpenAI Python client and is **ready for a real runtime verification**. The SDK dependency is declared, but no model call was made during setup.

## Integration

- Selected `ai-observability-openai-python` because the project uses the modern `openai>=1.60.0` Python SDK directly, without an agent or orchestration framework.
- Added the `posthog` dependency to `pyproject.toml` alongside the existing OpenAI dependency.
- Replaced the vendor `OpenAI` client in `main.py` with PostHog's drop-in `posthog.ai.openai.OpenAI` wrapper.
- Initialized the PostHog client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; both values are present in the local `.env` file.
- Registered `posthog.shutdown()` at process exit so the short-lived script flushes captured AI events.
- Wrote wrapper metadata to `.posthog-wizard-cache/.posthog-ai.json`.

## Trace design

- One process run is one AI session (`$ai_session_id`), because the sample application does not have a conversation/thread identifier.
- Index construction uses one trace for the startup embedding calls.
- Each `answer()` invocation creates one trace shared by its query embedding and response generation.
- The existing stable application user identifier is sent as `posthog_distinct_id`.
- The application has no registered tools or dispatch loop, so no `$ai_span` tool events were added.

## Verify

1. Install the declared project dependencies using the project's normal Python environment workflow.
2. Ensure `OPENAI_API_KEY` is configured in that runtime along with the PostHog environment values already stored in `.env`.
3. Run `python3 main.py`.
4. In PostHog, open **AI Observability → Traces** and inspect the newest records.

Expected result:

- The startup embedding calls appear together under one trace.
- Each of the two answer calls produces a separate trace containing both its embedding and response generation.
- All three traces belong to one AI session for the process run.
- Generations are attributed to the app's existing user identifier.

No automated import or live model request was run because this project has no configured verification script and the setup does not use model credentials.

## Privacy mode

`privacy_mode=False` is set in `main.py:14`. This captures prompt and completion content on SDK-captured AI events, which is the default behavior for this integration.

Before sending prompts or responses that must not be stored in PostHog, change that initialization setting to `privacy_mode=True`, or use `posthog_privacy_mode=True` on an individual OpenAI request. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove custom properties or already-ingested data.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
