# PostHog AI Observability setup

## Integration

Configured the **Anthropic Python** wrapper integration. `requirements.txt` now declares the `posthog` SDK alongside the existing Anthropic SDK, and `main.py` constructs an instance-based `Posthog` client from `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables. The wrapped `Anthropic` client uses that instance without changing the weather tool implementation or the existing model-call flow.

The PostHog token and host are configured in the local `.env` file. They are not embedded in source code.

## Trace structure

One process run is an AI Observability session, represented by a module-level UUID. Each `ask()` invocation creates one trace UUID shared by both Anthropic calls. The existing `USER_ID` is passed as the `posthog_distinct_id`.

When Claude requests `get_weather`, the existing tool invocation is captured as an `$ai_span` with the same trace and session identifiers. A tool-enabled request should therefore appear as:

`generation → get_weather span → generation`

The PostHog client is registered with `atexit` to flush buffered events before this CLI process exits.

## Verification

The integration is wired but not live-verified: this project has no build or test script, and no local `ANTHROPIC_API_KEY` is configured. Install the declared project dependencies using the project's normal Python environment, set a valid Anthropic credential in the process environment, source the local `.env` values, and run `python3 main.py`.

Then open **AI Observability → Traces** in PostHog and inspect the newest trace. Confirm that it contains the two Claude generations and the `get_weather` span under one trace, is attributed to the existing user ID, and has one process-run session ID. Running a second `ask()` turn in the same process should create a new trace in that same session.

## Privacy mode

Privacy mode is explicitly **off** through `privacy_mode=False` in `main.py` when the `Posthog` client is constructed. Prompt and completion content are therefore captured in the SDK-generated `$ai_input` and `$ai_output_choices` properties.

Before sending sensitive prompts or completions, change that client setting to `privacy_mode=True`; an individual Anthropic request can instead use `posthog_privacy_mode=True`. Privacy mode excludes those SDK-captured input and output properties; it does not remove already stored events or arbitrary custom properties. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
