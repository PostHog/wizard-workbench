# PostHog AI Observability setup

## Status

**Wired, runtime unverified.** The project now uses PostHog's Anthropic Python wrapper for AI Observability. I did not invoke Claude because no Anthropic API key was provided.

## Integration

- **Selected variant:** `ai-observability-anthropic-python`, because `requirements.txt` declares the direct Python `anthropic` SDK and no higher-level LLM framework.
- **Dependency:** added `posthog<8` beside the existing Anthropic dependency in `requirements.txt`.
- **Client setup:** `main.py` constructs `Posthog` from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, then supplies it to `posthog.ai.anthropic.Anthropic`. The PostHog client is shut down through `atexit` so this CLI can flush queued events on exit.
- **Configuration:** `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are configured in the local `.env` file; `.gitignore` excludes that file.
- **Tree structure:** each process run has one generated `$ai_session_id`; each call to `ask()` creates one trace ID, shared by its initial and follow-up Claude calls. The existing `USER_ID` is attached as the distinct ID.
- **Tool spans:** if Claude requests `get_weather`, the tool execution is captured as an `$ai_span` on that same trace, with its duration, input, and output.
- **Run record:** `.posthog-wizard-cache/.posthog-ai.json` identifies the Anthropic wrapper integration for future setup reporting.

## Verify delivery

1. Install the declared dependencies in your Python environment.
2. Ensure `ANTHROPIC_API_KEY` is exported, then load the PostHog variables from `.env` and run the CLI:

   ```bash
   set -a; . ./.env; set +a; python3 main.py
   ```

3. In PostHog, open **AI Observability → Traces** and inspect the newest trace.
4. A tool-using request should contain, in order: an Anthropic generation, a `get_weather` span, and a second Anthropic generation. Both generations and the tool span should share one trace ID and one session ID, and be attributed to the application's existing user ID. Run a second `ask()` turn in the same process to confirm that its new trace appears in the same session.

## Privacy mode

- **Effective setting:** `privacy_mode=False` in `main.py:19`. Prompt and completion content will be captured by the SDK; no request-level privacy override is configured.
- **When to change it:** enable privacy mode before sending prompts or responses whose sensitive content must not be stored in PostHog.
- **How:** change that client option to `privacy_mode=True`, or pass `posthog_privacy_mode=True` to an individual `client.messages.create()` request.
- **Effect:** privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`. It does not remove arbitrary custom properties, manually captured payloads, or data already stored in PostHog.
- [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode)
