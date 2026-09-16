# PostHog AI Observability — Google ADK (Node)

## Variant

`ai-observability-google-adk`. The manifest declares `@google/adk` directly (no wrapping framework on top), so the framework variant wins over any provider-level instrumentation.

## What changed

- **`package.json`** — added `@posthog/ai` and `posthog-node` alongside the existing `@google/adk` and `zod`.
- **`src/index.ts`** — built a `PostHog` client from env vars and registered `PostHogADKPlugin` on the existing `Runner`. No other structure changed; `ask()`, the tool, and the agent are untouched.
- **`.env`** — set `POSTHOG_API_KEY` and `POSTHOG_HOST` to this project's real token/host (these keys already existed in the file, so the names were reused rather than introducing new ones).
- **`.env.example`** — added (didn't exist before) documenting `POSTHOG_API_KEY` / `POSTHOG_HOST` with empty values. `.gitignore` already ignores `.env`.

## The four facts

| Fact | Value |
|---|---|
| Conversation | `SESSION_ID = 'thread_abc'` → becomes `$ai_session_id` |
| User | `USER_ID = 'user_123'` → becomes the events' distinct ID |
| Turn | `ask(question)` — one call to `runner.runAsync(...)`, may invoke the model more than once |
| Tools | Yes — `get_weather` `FunctionTool`. ADK runs the tool loop itself; the plugin captures it as a span with no extra code needed. |

## Expected result

`main()` calls `ask()` twice in the same session (`thread_abc`), and the second question ("Boston") makes the model call the `get_weather` tool. One run should produce:

- one session (`thread_abc`) holding both turns
- a trace per `ask()` invocation
- a span for the `weather_assistant` agent run in each trace
- a span for the `get_weather` tool call, on the turn where the model uses it
- one `$ai_generation` per model call in that turn

## How to verify

```bash
npm run build   # already run — clean, no type errors
npm start
```

Then open **AI Observability → Traces** in PostHog (project 483112) and check the two newest traces:
- both should share `$ai_session_id = thread_abc`
- the "Boston" trace should show a tool span for `get_weather` under the agent span
- the person should resolve to `user_123`, not anonymous

Status: **wired, unverified** — the code builds and the ADK plugin import resolves, but the agent wasn't actually run (no live Gemini credentials in this environment), so no trace has been confirmed to land in PostHog yet.
