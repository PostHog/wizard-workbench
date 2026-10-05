# PostHog AI Observability setup

## Integration

- Selected `ai-observability-openai-python` because `pyproject.toml` declares the modern OpenAI Python SDK (`openai>=1.60.0`) and the application makes direct OpenAI embeddings and Responses API calls.
- Added the `posthog` Python SDK to `pyproject.toml` without changing the existing OpenAI dependency.
- Replaced the direct OpenAI client with `posthog.ai.openai.OpenAI` in `main.py`. The wrapper is backed by a `Posthog` client configured from `POSTHOG_API_KEY` and `POSTHOG_HOST`.
- Registered `posthog_client.shutdown` with `atexit` so this CLI flushes buffered events before exit.
- Saved the configured PostHog public project token and host to the local `.env`; `.env.example` documents their names with empty values. No credentials are embedded in source.

## Trace model

- A process run creates one `$ai_session_id` (`docs-rag-...`) shared by index construction and both questions.
- `build_index()` uses one trace ID for its startup embedding calls.
- Each `answer()` invocation creates one trace ID shared by its question embedding and Responses API generation. Both calls also carry the existing stable `USER_ID` as `posthog_distinct_id`.
- The application has no registered OpenAI tools. The existing local `retrieve()` calculation remains unchanged and does not create an AI span.

## Verification

Static verification confirmed the wrapper imports, PostHog initialization, lifecycle shutdown registration, per-call session attribution, and shared per-turn trace IDs in `main.py`. This project defines no build, typecheck, or lint command, so no project verification command was available to run. Live delivery is **wired but unverified** because `OPENAI_API_KEY` is not configured in this workspace and model calls were not made.

To verify delivery after installing the declared dependencies in the project’s normal Python environment and configuring `OPENAI_API_KEY`, run:

```bash
python3 main.py
```

Then open **AI Observability → Traces** in PostHog. Confirm that the two answer traces each contain an embedding followed by a generation, share the process-run session ID, and are attributed to `user_123`. The one-time index build also appears as a separate embedding-only trace in that same session.

## Privacy mode

`privacy_mode=False` is set on the `Posthog` client in `main.py`, so SDK-captured prompts and completions are included in AI Observability by default. Enable privacy mode before sending prompts or responses whose sensitive content must not be stored in PostHog by changing that setting to `privacy_mode=True`, or by passing `posthog_privacy_mode=True` on an individual OpenAI call. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove arbitrary custom properties, manually captured payloads, or events already stored.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
