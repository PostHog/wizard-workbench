---
name: ai-observability-vercel-ai
description: PostHog AI Observability integration for Vercel AI SDK
metadata:
  author: PostHog
  version: dev
---

# PostHog AI Observability for Vercel AI SDK

Wire up PostHog's AI Observability so calls made through Vercel AI SDK emit `$ai_generation` events into LLM Analytics.

## Prerequisite — vendor LLM SDK

This skill instruments the LLM calls the project *already makes*. It does **not** install the vendor SDK for you.

Check the project's manifest for the provider's package (e.g. `openai`, `@anthropic-ai/sdk`, `langchain`, `ai`, `@google/genai`). If a vendor SDK is present, pick the matching variant. If none is present, switch to the `manual-capture` variant — it posts `$ai_generation` events directly and works standalone.

Everything else this skill needs — PostHog credentials, the OTel packages, env vars — the skill installs and configures itself. It does **not** require a pre-existing `posthog.init(...)`. If one is already there, reuse its env-var names in `3-otel-setup.md`; if not, that step sets fresh values via `set_env_values`.

## Steps

Read every referenced file **before editing**. Then work through them in order:

1. **Begin** — see `references/1-begin.md`. Pick the right variant from the vendor SDK the project declares, then locate the LLM call sites so you know where the instrumentation will apply.
2. **Install** — see `references/2-install.md`. Add the OpenTelemetry SDK, PostHog's span-processor package, and the provider-specific instrumentation package to the manifest.
3. **Set up OpenTelemetry** — see `references/3-otel-setup.md`. Initialize the OTel TracerProvider once with `PostHogSpanProcessor`, attach the provider-specific instrumentor, and route the project token / host through environment variables.
4. **Verify** — see `references/4-verify.md`. Describe a single call the user can trigger and how to confirm `$ai_generation` events land in PostHog.

## Reference files

- `references/1-begin.md` - Pick the right variant, confirm prerequisites, and locate the LLM call sites before editing
- `references/2-install.md` - Add the OpenTelemetry SDK, PostHog span processor, and provider instrumentation to the manifest
- `references/3-otel-setup.md` - Initialize the OTel TracerProvider with PostHog's span processor and attach the provider instrumentor
- `references/4-verify.md` - Give the user a concrete way to trigger a generation and confirm it lands in PostHog
- `references/vercel-ai.md` - Vercel ai SDK observability installation - docs
- `references/node.md` - Node.js - docs
- `references/basics.md` - Ai observability basics - docs
- `references/generations.md` - Generations - docs
- `references/traces.md` - Traces - docs
- `references/COMMANDMENTS.md` - Framework-specific rules the integration must follow

The linked install page carries the exact code blocks for this variant's language. Prefer copying from there over reconstructing from memory — package names and initialization shapes change between AIO releases.

## Key principles

- **Environment variables.** Read `<ph_project_token>` and `<ph_client_api_host>` from env, using the framework's env-var convention. Never hardcode either value.
- **Minimal changes.** OTel initialization is a single call that runs once at process start. Place it alongside any existing PostHog init rather than restructuring the entry point.
- **Match the docs.** Package names, instrumentor imports, and processor names change between AIO releases. The install page for this variant is the source of truth.
- **Don't touch what isn't yours.** This skill instruments generations only. Identify calls, event tracking, error tracking, and dashboards belong to the base `integration` skill — do not add or edit them here.

## Emit a run record

When you finish, write `.posthog-wizard-cache/.posthog-ai.json` at the project root:

```json
{ "provider": "openai", "package": "@posthog/ai", "otel_init_file": "src/instrumentation.ts" }
```

The `report/` step reads this file to render an AI Observability section in the setup report. If the cache directory does not exist, create it.

## Framework guidelines

- posthog-node is the Node.js server-side SDK package name; posthog-js is browser-only, so use posthog-node on the server instead
- Include enableExceptionAutocapture: true in the PostHog constructor options
- Add posthog.capture() calls in route handlers for meaningful user actions – every route that creates, updates, or deletes data should track an event with contextual properties
- Add posthog.captureException(err, distinctId) in the application's error handler (e.g., Express error middleware, Fastify setErrorHandler, Koa app.on('error'))
- The SDK batches events and flushes asynchronously. await flush() or await shutdown() before letting that process exit. If unsure, set flushAt 1 and flushInterval 0.
- `posthog.capture()` enqueues synchronously and returns; the batched HTTP send happens afterwards. Treat every per-request handler as short-lived even when the framework feels like a server: Next.js / Nuxt / SvelteKit / Remix route handlers, serverless and edge functions, and Lambda are torn down per invocation before the send runs. Create the client with flushAt 1 and flushInterval 0, then await the send before returning. Always use `await posthog.flush()` for a shared/singleton client, `await posthog.shutdown()` for a per-request client. Never skip the awaited flush or risk the enqueued event being silently dropped.
- Reverse proxy is NOT needed for server-side Node.js – only client-side JavaScript needs a proxy to avoid ad blockers
