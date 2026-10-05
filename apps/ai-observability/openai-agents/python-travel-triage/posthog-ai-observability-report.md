# PostHog AI Observability setup

## Integration

- Selected the **OpenAI Agents SDK (Python)** variant because `pyproject.toml` declares `openai-agents` and `main.py` runs its agents directly.
- Declared the `posthog` Python SDK in `pyproject.toml` alongside the existing agent SDK. No OpenTelemetry packages or manual `$ai_*` capture calls were added.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env` file using the supplied project configuration. Runtime code reads both values from the environment; no token or host is embedded in source.
- Initialized `Posthog` and registered `posthog.ai.openai_agents.instrument()` in `main.py`. The OpenAI Agents SDK now automatically emits agent, handoff, tool, and LLM-generation spans.
- Registered shutdown handling and explicitly shuts down the client in the CLI `finally` block so buffered telemetry is flushed.

## Trace grouping and attribution

- `main()` creates one `RunConfig.group_id` per process run (`travel-triage-<uuid>`). This becomes one `$ai_session_id` for the travel-triage run.
- The Agents SDK supplies the trace hierarchy for the one `Runner.run_sync()` turn, including the triage agent, handoff, booking agent, tool invocation, and generations.
- This fixture has no authenticated user identifier at the call site, so no `posthog_distinct_id` is invented. Events remain anonymous.

## Privacy mode

- **Effective setting:** `privacy_mode=False` at `main.py:18`.
- Prompt and completion content captured by the Agents SDK can therefore be sent to PostHog. This is the default configuration selected because the project contains no existing privacy requirement.
- Before sending sensitive prompts or responses, change the `instrument()` call to `privacy_mode=True` (or use the SDK's supported per-request control where applicable). Privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties or previously stored events.
- Documentation: [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Verification

The integration is **wired but not end-to-end verified**: this project defines no build, test, or type-check script, and no model call was run because credentials are not available to the setup process.

To verify after installing the declared dependencies and setting the application's OpenAI credentials, run:

```bash
python3 main.py
```

Then open **AI Observability → Traces** in PostHog and inspect the newest trace. Expect one session for the script run, one trace containing the triage and booking-agent hierarchy, and automatic spans for the handoff and `get_flight_price` tool. Run the script again to observe a separate session for the new process run.

## Scope

No existing PostHog initialization, identify calls, event capture, or dashboards were modified. No dashboard was created or changed.
