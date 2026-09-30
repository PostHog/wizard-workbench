# PostHog AI Observability setup

## Status

Wired, but live delivery is unverified because this environment has no `OPENAI_API_KEY` configured and no model request was made.

## Integration

- Selected `ai-observability-openai-python`: `pyproject.toml` contains the direct `openai>=1.60.0` SDK and the app constructs a standard OpenAI client without a gateway base URL or higher-level framework.
- Added the `posthog` dependency and installed the project dependencies into `.venv`.
- `main.py` now constructs `Posthog` from `POSTHOG_API_KEY` and `POSTHOG_HOST`, then supplies it to PostHog’s wrapped `OpenAI` client.
- The client is registered for shutdown via `atexit` so buffered observability events flush when the script ends.
- No existing product-analytics initialization, identity calls, event capture, or dashboards were changed.

## Trace structure

- One UUID `$ai_session_id` is created per `main()` process run, representing this script’s conversation scope.
- Corpus indexing uses one startup trace within that session.
- Each `answer()` invocation creates one UUID trace shared by its query embedding and response-generation calls.
- The existing stable `USER_ID` is attached as `posthog_distinct_id` to all OpenAI calls.
- This project registers no OpenAI tools, so no `$ai_span` tool captures were added.

## Configuration

The supplied PostHog public token and host were saved to `.env` as `POSTHOG_API_KEY` and `POSTHOG_HOST`. Add a valid `OPENAI_API_KEY` to your local environment before running the script; it was intentionally not created or changed.

## Verification

- `pip install .` completed successfully in the new `.venv`, resolving the declared OpenAI and PostHog dependencies.
- `.venv/bin/python -m compileall main.py` completed successfully.
- No live OpenAI request was sent, so confirm delivery after configuring your OpenAI credential. Run the script with its environment loaded, then open **AI Observability → Traces** in PostHog. The two `answer()` calls should appear as separate traces under the same session, each containing an embedding and a response generation.

## Privacy mode

`privacy_mode=False` is set in the `Posthog` constructor in `main.py`. This is the SDK default and captures prompt and completion content for wrapped calls. Before handling prompts or responses that must not be stored in PostHog, change that constructor to `privacy_mode=True`, or use the supported per-request `posthog_privacy_mode=True` override. Privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove previously stored events or arbitrary custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
