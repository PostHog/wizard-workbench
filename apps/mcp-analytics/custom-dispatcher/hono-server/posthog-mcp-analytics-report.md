# PostHog MCP Analytics — Setup Report

## Instrumentation path

**Path C — Custom dispatcher (Hono / HTTP, no SDK server object)**

`PostHogMCP` (a drop-in `posthog-node` subclass from `@posthog/mcp`) is wired directly into the JSON-RPC dispatch loop. There is no `@modelcontextprotocol/sdk` server object to wrap with `instrument()`, so each method handler calls the matching capture method manually.

## What was changed

### Files modified

| File | Change |
|------|--------|
| `src/index.ts` | Added `PostHogMCP` import; module-scope client construction (guarded by `POSTHOG_PROJECT_TOKEN`); `prepareToolList` on `tools/list`; `prepareToolCall` + `captureToolCall` (success and error paths) on `tools/call`; `captureInitialize` on `initialize`; `SIGTERM` shutdown flush |

### Files created

| File | Purpose |
|------|---------|
| `.env` | `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` env vars |

### Packages installed

| Package | Version |
|---------|---------|
| `@posthog/mcp` | `^0.13.0` |
| `posthog-node` | `^5.51.6` |

## Events captured

Once the server handles requests, you will see the following events in PostHog:

| Event | When |
|-------|------|
| `$mcp_initialize` | On every `initialize` JSON-RPC call |
| `$mcp_tool_call` | After every `tools/call` (success and error; errors have `$mcp_is_error = true`) |
| `$exception` | Alongside a failed `$mcp_tool_call` (via `enableExceptionAutocapture`) |

`$mcp_resources_list`, `$mcp_resource_read`, `$mcp_prompts_list`, and `$mcp_prompt_get` are reserved but not emitted by this path.

## Key implementation details

- **`PostHogMCP` client** is constructed once at module scope — never per request.
- **`prepareToolList(TOOLS)`** is called for `tools/list` responses. The returned `advertisedTools` advertises an injected `context` argument for agent-intent capture.
- **`prepareToolCall(name, rawArgs, { originalTool })`** strips the injected `context` and extracts `intent` / `intentSource` / `llmModel` / `llmModelSource` before each tool runs. The cleaned `args` are dispatched instead of the raw request arguments.
- **`captureModel: true`** is set — model capture requires `@posthog/mcp>=0.13.0` on the custom-dispatcher path (installed: `^0.13.0`).
- **`enableExceptionAutocapture: true`** emits a `$exception` sibling event on tool errors.
- **Missing token** is detected at startup and logs a descriptive error; the server continues without analytics rather than crashing.
- **`SIGTERM`** calls `posthog.shutdown()` so queued events are flushed before the process exits.

## Manual steps

1. **Verify `.env` is loaded at runtime.** The server reads `process.env.POSTHOG_PROJECT_TOKEN` and `process.env.POSTHOG_HOST`. Make sure your start command loads `.env` (e.g. via `dotenv`, or run `export $(cat .env | xargs)` before `npm start`). With `tsx` you can use `tsx --env-file=.env src/index.ts`.
2. **Dashboard and event reference:** https://posthog.com/docs/mcp-analytics
