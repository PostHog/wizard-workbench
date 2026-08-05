# wb-aio-openai-agents-travel-triage

Travel desk on the OpenAI Agents SDK: triage agent, handoff, one function tool.
PostHog-less fixture for `wizard ai-observability`.

```
the agent run                           ← $ai_session_id
└─ Runner.run_sync(triage_agent, ...)   ← trace
   ├─ TriageAgent                       ← span
   │  └─ generation
   ├─ handoff → BookingAgent            ← span
   └─ BookingAgent                      ← span
      ├─ generation
      └─ get_flight_price               ← span
```

The SDK's tracing layer emits the whole tree. An `OpenAIInstrumentor` here
installs cleanly and captures nothing.

## Expected outcome

- one session, one trace holding the SDK's own tree, on a real distinct id
- instrumented via `posthog.ai.openai_agents.instrument()` — not OTel
- `$ai_session_id` set for the run via `instrument(properties={...})`
- flushed before exit (CLI); agents, tool, and handoff untouched

Fail: OTel instrumentation of any kind; falling through to manual capture;
manual spans around agents or the tool; success reported with no processor
registered.
