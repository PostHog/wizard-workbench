# PostHog AI Observability setup

## Status

AI Observability is wired for the OpenAI Agents SDK and is **awaiting a live run** to verify ingestion. No model call was made during setup.

## What changed

- Selected the `ai-observability-openai-agents` workflow because `openai-agents` is the project's LLM framework. Framework instrumentation takes precedence over a provider-level integration.
- Declared `posthog>=7.0.0` alongside the existing `openai-agents` dependency in `pyproject.toml`.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the ignored local `.env` file. The application reads both values only from its environment; no PostHog credential or host is embedded in source.
- In `main.py`, constructed a `Posthog` client, registered its shutdown at process exit, and registered `posthog.ai.openai_agents.instrument()`.
- Added a unique `RunConfig.group_id` for each script run. This is the `$ai_session_id` for the run.
- Added `.posthog-wizard-cache/.posthog-ai.json` to record the provider, SDK package, and instrumentation location.

## Expected trace tree

Run one script invocation to produce one AI Observability session and one trace. The OpenAI Agents integration automatically captures the complete hierarchy:

- `TriageAgent` span and its generation
- handoff span to `BookingAgent`
- `BookingAgent` span and its generation
- `get_flight_price` tool span

The sample application has no user identity in scope, so runs are intentionally anonymous. No distinct ID was invented.

## Verify

1. Install the declared project dependencies using the project's normal Python environment workflow.
2. Make `POSTHOG_API_KEY` and `POSTHOG_HOST` available to the process (for example, load the local `.env` file in your shell or deployment environment). Also provide the OpenAI credential required by the Agents SDK.
3. Run `python3 main.py`.
4. In PostHog, open **AI Observability → Traces** and inspect the newest trace. Confirm the spans and generations above appear under one trace and one session.

A second invocation creates a new script-run session because this small CLI has no persistent conversation identifier. If the application later gains multi-turn conversations, use that conversation or thread ID as `RunConfig.group_id` so multiple turns are grouped in one session.

No automated build or import command was available in this project, and the model was not called during setup. Therefore, delivery is wired but not yet runtime-verified.

## Privacy mode

- **Effective setting:** `privacy_mode=False` at `main.py:18` in the OpenAI Agents instrumentation registration. There are no per-run overrides.
- **Effect:** prompt inputs and completion outputs are captured on SDK-generated AI Observability events. Privacy mode excludes `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties, manually captured payloads, or already stored events.
- **When to change it:** enable privacy mode before sending prompts or responses whose content must not be stored in PostHog.
- **How to change it:** change the tracing registration in `main.py` to `privacy_mode=True`. The OpenAI wrapper's per-request control, `posthog_privacy_mode=True`, does not apply to this framework-hook integration.
- **Reference:** [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
