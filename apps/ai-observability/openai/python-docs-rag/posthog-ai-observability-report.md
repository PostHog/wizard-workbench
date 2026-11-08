# PostHog AI Observability setup

## What changed

- Selected the **OpenAI Python** workflow because `pyproject.toml` declares the modern `openai>=1.60.0` SDK and no higher-level LLM framework or gateway override is present.
- Added the `posthog` Python dependency to `pyproject.toml` while preserving the existing OpenAI version.
- Replaced the direct OpenAI client with PostHog's `posthog.ai.openai.OpenAI` wrapper in `main.py`.
- Created a `Posthog` client from `POSTHOG_API_KEY` and `POSTHOG_HOST`, with exception autocapture enabled and an `atexit` shutdown hook to flush queued events.
- Added the supplied PostHog project token and host to the local `.env` file. Neither value is embedded in source code.
- Added the required wizard integration record at `.posthog-wizard-cache/.posthog-ai.json`.

## Trace model

- **AI session:** `AI_SESSION_ID` is created once per process run, which is this script's conversation scope.
- **AI trace:** `answer()` creates one UUID per question. Its query embedding and `responses.create()` call share that trace ID, so each question forms one trace.
- **Startup embeddings:** corpus-index embeddings receive their own trace IDs because they run outside an answer turn.
- **Person attribution:** the existing `USER_ID` is passed as the PostHog distinct ID.
- **Tools:** the app does not register or dispatch LLM tools, so no `$ai_span` events were added.

## Verification

Static verification passed: `main.py` imports the documented wrapper, initializes it with environment-backed PostHog configuration, registers shutdown, and provides `$ai_session_id`, `posthog_trace_id`, and `posthog_distinct_id` to all OpenAI calls. The project does not define a package manager, lockfile, build script, or typecheck command, so no build or import command was available to run. The model was not called because no OpenAI credential was provided for a live request.

To validate delivery, install the dependencies using this project's normal Python environment, make `POSTHOG_API_KEY`, `POSTHOG_HOST`, and `OPENAI_API_KEY` available to the process, then run:

```bash
python3 main.py
```

Open **AI Observability → Traces** in PostHog and inspect the newest traces. The two answer turns should appear as separate traces in one `rag-*` session; each answer trace should contain the query embedding and response generation. Indexing produces separate embedding traces during startup.

## Privacy mode

`privacy_mode=False` is configured in `main.py` on the `Posthog` constructor. This is the default requested setup and means SDK-captured prompt and completion content is included in AI Observability.

Before sending prompts or responses whose content should not be stored in PostHog, change that constructor setting to `privacy_mode=True`, or pass `posthog_privacy_mode=True` on a specific OpenAI request. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove previously stored events or arbitrary custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the current behavior and controls.
