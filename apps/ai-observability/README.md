# AI Observability test apps

PostHog-less apps for testing `wizard ai-observability`. Each app calls an LLM
in a shape with real structure — a conversation, a tool call, a multi-step
answer — so the wizard has to produce the
[session → trace → span → generation](https://posthog.com/docs/ai-observability/basics)
tree, not just wrap a single call.

Layout: `<docs-installation-slug>/<runtime>-<app-name>`. The top-level
directory matches the app's page under
[installation docs](https://posthog.com/docs/ai-observability/installation),
so `ls` answers "which docs pages have coverage".

## The apps

Each app exists to test one thing the others don't:

- `anthropic/python-weather` — the baseline: tool span, single-trace inferred session
- `anthropic/node-weather` — multi-turn: one trace per turn, one session across turns
- `openai/python-weather` — same flow, OpenAI shape; canary for stale SDK resolves
- `openai/node-weather` — same flow, single-turn Node
- `openai/python-docs-rag` — embeddings; hardest session (no field to read)
- `groq/node-chat` — provider named by `baseURL`, not package
- `openai-agents/python-travel-triage` — tracing processor; the SDK emits the tree
- `vercel-ai/nextjs-support-chat` — per-request identity; framework bootstrap
- `manual-capture/node-http-chat` — hand-built tree; must reuse the existing client
- `google-adk/node-weather` — framework plugin; identity comes from ADK's own ids
- `opentelemetry/go-weather` — Go; no wrapper SDK exists, so the posthog-go OTel bridge

The five weather apps implement the identical `get_weather` round trip from
[Anthropic's tool-use docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview#how-tool-use-works),
so a diff between any two isolates one variable: the SDK, the language, or the
conversation structure.

## Conventions

- **Wrapper-first.** The expected mechanism is the PostHog SDK wrapper
  (`posthog.ai.*` / `@posthog/ai`) with per-call `posthog_distinct_id`,
  `posthog_trace_id`, and `posthog_properties`, as shown in the docs. OTel is
  acceptable only where the same structure lands. Exceptions:
  `openai-agents` (tracing processor), `vercel-ai` (`experimental_telemetry`),
  `google-adk` (Runner plugin), `manual-capture` (no SDK to wrap).
  `manual-capture` (no SDK to wrap),
  `opentelemetry/go-weather` (Go has no wrapper SDK; the posthog-go OTel bridge).
- **Every app gets a session** — single-trace apps included. The graded
  property is **cardinality**: one id shared by the traces that belong
  together. A fresh id per call groups nothing and is worse than none.
- **Spans come from tool registration** (or explicit `$ai_span` capture on the
  manual path). Never from hand-authored wrappers around helper functions.
- Static fixtures in the style of [`../mcp-analytics`](../mcp-analytics): not
  executed, no lockfiles, no keys. Node type-checks with `tsc --noEmit`.
- Each README states the tree the app must produce and grades **emitted
  events, not the diff** — every observed failure mode so far produced
  plausible code and a broken tree.
- `manual-capture/node-http-chat` alone ships PostHog product analytics, to
  test the additive-only rule (reuse the client; never a second instance).

## Running

```bash
pnpm wizard-ci --app ai-observability/<app> --evaluate --local
```

The command id (and so the `ai-observability` evaluator rubric) is inferred
from the app path. After a run, confirm which skill version was installed
before trusting results:

```bash
ls apps/ai-observability/<app>/.claude/skills/*/references/
```
