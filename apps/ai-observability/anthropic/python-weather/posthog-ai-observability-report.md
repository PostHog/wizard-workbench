# PostHog AI Observability setup

## Integration

- Selected the **Anthropic Python** workflow because `requirements.txt` uses the direct `anthropic` SDK and no higher-level agent framework.
- Declared the `posthog` Python SDK alongside the existing Anthropic dependency in `requirements.txt`.
- Configured the supplied PostHog project token and host in the local `.env` file. `.env.example` documents `POSTHOG_API_KEY` and `POSTHOG_HOST` without values.
- Replaced the direct Anthropic client with `posthog.ai.anthropic.Anthropic` in `main.py`, backed by an instance-based `Posthog` client.
- Registered `posthog_client.shutdown` with `atexit` so this CLI flushes queued events before it exits.

## Trace structure

`ask()` is the single user turn. It creates one UUID trace ID per invocation and passes it to both Anthropic calls. A session UUID is also shared by both calls via `$ai_session_id`. The stable existing `USER_ID` is passed as `posthog_distinct_id`.

A weather request that triggers the tool should appear as one AI Observability trace with the initial Claude generation and its follow-up generation. The existing tool loop was preserved unchanged.

## Verification

The source was reviewed to confirm that:

- the `posthog` dependency is declared;
- the PostHog client reads `POSTHOG_API_KEY` and `POSTHOG_HOST` from environment variables;
- the Anthropic wrapper is constructed with that client;
- both possible generation calls share the per-turn trace and session IDs; and
- the CLI registers a shutdown flush.

This is wired but not runtime-verified: the repository has no build or test script, and no `ANTHROPIC_API_KEY` is configured locally. To verify after installing dependencies and providing an Anthropic API key, run:

```bash
python3 main.py
```

Then open **AI Observability → Traces** in PostHog and inspect the newest trace. It should contain one trace for the request, with both model calls grouped under the same session and identified by the existing user ID.

## Privacy mode

Privacy mode is explicitly **off** in `main.py` on the `Posthog` constructor (`privacy_mode=False`). As a result, PostHog captures SDK-provided prompt input and completion output for AI Observability.

Enable it before sending prompts or completions whose sensitive content must not be stored in PostHog. Change that constructor setting to `privacy_mode=True`, or apply the supported per-request `posthog_privacy_mode=True` option on an Anthropic call. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove arbitrary custom properties or previously stored events.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Remaining action

Set `ANTHROPIC_API_KEY` in the local environment before running the example. The PostHog environment variables are already configured locally.
