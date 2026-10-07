# PostHog AI Observability setup

## What changed

- Selected the **OpenAI Python** wrapper integration because `pyproject.toml` declares the modern `openai>=1.60.0` SDK and the application calls the OpenAI embeddings and Responses APIs directly.
- Added the `posthog` dependency to `pyproject.toml` without changing the existing OpenAI dependency.
- Replaced the direct OpenAI client with `posthog.ai.openai.OpenAI` in `main.py`, backed by an instance-based `Posthog` client. The project token and host are read only from `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables.
- Configured those two PostHog values in the local `.env` file and documented empty keys in `.env.example`. No credential is embedded in source code.
- Added process-exit flushing with both `atexit` and the CLI `finally` block so buffered observability events are delivered before the script exits.

## Trace model

The script has no conversation identifier, so a UUID created once per process run is used as `$ai_session_id`. The fixed `USER_ID` is passed as the distinct ID.

- The first answer turn receives a new trace ID before index construction. The corpus embeddings, the question embedding, and the resulting Responses API generation share that trace.
- The second `answer()` call mints a second trace ID. Its question embedding and generation share that trace.
- Both traces share the same process-run session ID, producing one AI session with two answer traces.
- The wrapper automatically emits `$ai_embedding` for embedding calls and `$ai_generation` for Responses API calls. Retrieval is plain Python rather than a registered tool, so no `$ai_span` event was added.

## Verification and trigger

Static verification confirms the wrapper import and construction, dependency declaration, configured PostHog environment keys, per-call session properties, shared per-turn trace IDs, and explicit shutdown path. The integration is **wired but not runtime-verified**: no model request was sent because an OpenAI API key was not provided and this setup does not invoke vendor calls during verification.

To verify it, install the declared project dependencies, make `POSTHOG_API_KEY`, `POSTHOG_HOST`, and `OPENAI_API_KEY` available in the process environment, then run:

```bash
python3 main.py
```

Open **AI Observability → Traces** in PostHog and inspect the newest session. It should show two traces for the two printed answers, with embeddings and a generation grouped under each respective trace. Confirm the same `$ai_session_id` appears on both traces and that the person is attributed to `user_123`.

## Privacy mode

Privacy mode is explicitly disabled in `main.py` on the `Posthog` constructor (`privacy_mode=False`). This is the effective default configuration, so SDK-captured prompt inputs and model completion content are sent to PostHog AI Observability.

Enable `privacy_mode=True` on that constructor before sending prompts or responses whose content must not be stored in PostHog. OpenAI requests can also set `posthog_privacy_mode=True` for a supported per-request override. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not retroactively alter previously stored events or guarantee removal of arbitrary custom/manual properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
