# Default integration on an app with LLM calls

Scenario leg for the default `posthog-integration` run on the orchestrator
sequence, against an app that already calls an LLM
(`ai-observability/vercel-ai/nextjs-support-chat` via `sourceApp` — no second
copy of the fixture).

The run must complete without aborting: the queue's `ai-observability` task
should find the Vercel AI SDK calls and instrument them, with `review` and
`report` finishing behind it. Task-by-task outcomes are visible in the run's
result payload; the contrast leg is `next-todo-no-llm`, where the AIO task
applies to nothing.
