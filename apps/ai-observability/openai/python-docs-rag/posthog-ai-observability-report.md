# PostHog AI Observability setup

## Status

**Wired, awaiting a live verification.** The application now uses PostHog's OpenAI wrapper and has not made an LLM request during this setup.

## What changed

- Added the `posthog` Python dependency in `pyproject.toml` without changing the existing OpenAI dependency.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in `.env`; no token or host is hardcoded in source.
- Replaced the direct OpenAI client in `main.py` with `posthog.ai.openai.OpenAI` backed by a `Posthog` client.
- Registered `posthog_client.shutdown` at process exit so buffered events are delivered by this command-line application.
- Added context to each OpenAI embedding and response call:
  - one AI session for each process run;
  - one trace for each `answer()` turn, shared by that turn's query embedding and response generation;
  - the application's existing user identifier as the PostHog distinct ID.
- The index-building embedding calls receive their own traces in the same process session. The application does not register or execute LLM tools, so no `$ai_span` captures were added.

## Verify

1. Install the declared project dependencies using this project's normal Python environment workflow.
2. Make the values in `.env` available to the process, and set `OPENAI_API_KEY` with a valid provider credential.
3. Run `python3 main.py`.
4. In PostHog AI Observability, open the newest trace. Each `answer()` call should contain its embedding and response generation under one trace. Both answers from one program invocation should share a session. The initial corpus embedding calls should appear as separate traces within that same session.

## Privacy mode

Privacy mode is **off** at `main.py` in the `Posthog(..., privacy_mode=False)` initialization. Consequently, SDK-captured prompts and completions are sent to PostHog. Enable `privacy_mode=True` at that initialization, or use `posthog_privacy_mode=True` on an individual OpenAI request, before sending prompts or responses whose content must not be stored in PostHog. Privacy mode removes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove previously captured data or arbitrary custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Notes

No existing PostHog initialization, identify calls, product analytics events, or dashboards were changed.
