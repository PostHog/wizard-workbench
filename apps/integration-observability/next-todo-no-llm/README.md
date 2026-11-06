# Default integration on an app with no LLM calls

Scenario leg for the default `posthog-integration` run on the orchestrator
sequence, against a plain todo app with no LLM usage
(`basic-integration/next-js/15-app-router-todo` via `sourceApp`).

The run must complete without aborting: the queue's `ai-observability` task
applies to nothing here and should end `not needed` — not fail, not invent an
AI feature — while `review` and `report` still finish behind it. Task-by-task
outcomes are visible in the run's result payload; the contrast leg is
`vercel-ai-chat`, where AIO instruments real calls.
