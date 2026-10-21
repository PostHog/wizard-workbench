# PostHog AI Observability setup

## What changed

- Selected the **OpenAI Agents SDK (Python)** integration because the project declares `openai-agents` and makes its agent runs through `Runner.run_sync`.
- Declared the `posthog` Python SDK in `pyproject.toml` alongside the existing Agents SDK dependency.
- Added PostHog's native OpenAI Agents tracing hook in `main.py`. It automatically captures agent execution, model generations, handoffs, and the registered flight-price tool as a trace tree.
- Configured the tracing client from `POSTHOG_API_KEY` and `POSTHOG_HOST`; the supplied values were written only to the local `.env` file. `.env.example` documents the required keys without credentials.
- Added `.posthog-wizard-cache/.posthog-ai.json` for the setup handoff.

## Trace grouping and attribution

- `main.py` creates one generated `PROCESS_RUN_ID` per application process and passes it as `RunConfig(group_id=...)`. PostHog records this as the AI session ID, grouping all turns in that process together.
- The OpenAI Agents integration creates the trace hierarchy for the run, including the triage agent, booking-agent handoff, generation(s), and tool invocation.
- The sample app has no authenticated user identifier at the call site, so traces remain anonymous. No identifier was invented.

## Verification status

**Wired, runtime unverified.** Static verification confirmed the dependency declaration, environment-variable initialization, instrumentation hook, shutdown registration, and `RunConfig` session grouping. No model call was made because provider credentials and a user-triggered run are required to verify delivery.

To validate the integration:

1. Install the project dependencies using its normal Python environment workflow.
2. Ensure `POSTHOG_API_KEY` and `POSTHOG_HOST` from `.env` are exported into the process, and configure the provider credential required by the OpenAI Agents SDK.
3. Run `python3 main.py`.
4. In PostHog, open **AI Observability → Traces** and inspect the newest trace. It should contain the triage agent, booking agent, handoff, the flight-price tool span, and generation(s). A second run in the same process should appear in the same AI session.

## Privacy mode

Privacy mode is explicitly **off** at `main.py:16` through `instrument(..., privacy_mode=False)`. This is the default for this new integration and means SDK-captured prompts and completions are sent to PostHog.

Before sending prompts or responses whose sensitive content must not be stored in PostHog, change that call to `privacy_mode=True`. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove arbitrary custom properties or previously stored events. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
