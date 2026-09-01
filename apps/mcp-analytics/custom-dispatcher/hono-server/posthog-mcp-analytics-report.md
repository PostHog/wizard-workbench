# PostHog MCP Analytics — Setup Report

## Instrumentation path

**Path C — custom dispatcher.** This server is a Hono HTTP handler that speaks the MCP JSON-RPC protocol directly with no `@modelcontextprotocol/sdk` server object to wrap. `instrument()` does not apply here; the `PostHogMCP` client is used instead.

## What changed

### Files modified

| File | Change |
|------|--------|
| `src/index.ts` | Added `PostHogMCP` client (module-scope), `captureInitialize` on `initialize` requests, `captureToolCall` on every `tools/call` (success and error), and a `SIGTERM` handler that calls `posthog.shutdown()` before exiting. |
| `package.json` | Added `@posthog/mcp@^0.12.0` and `posthog-node@^5.51.6`. |

### Files created

| File | Purpose |
|------|---------|
| `.env` | Stores `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`. Git-ignored automatically. |

## How events are captured

- **`$mcp_initialize`** — fired when an MCP client sends the `initialize` handshake, capturing `$mcp_client_name`, `$mcp_client_version`, and `$mcp_protocol_version`.
- **`$mcp_tool_call`** — fired after every `tools/call` dispatch, capturing `$mcp_tool_name`, `$mcp_parameters`, `$mcp_response`, `$mcp_duration_ms`, and `$mcp_is_error`. A failing call also fans out a `$exception` event via `enableExceptionAutocapture`.

Events appear in PostHog under **Activity → Live events** as soon as the server handles its first request. See the [MCP analytics dashboard and event reference](https://posthog.com/docs/mcp-analytics) to set up insights.

## Environment variables

| Variable | Value |
|----------|-------|
| `POSTHOG_PROJECT_TOKEN` | `phx_API_KEY_IS_HARDCODED` |
| `POSTHOG_HOST` | `https://us.i.posthog.com` |

Both are written to `.env`. Load that file before starting the server (e.g. `dotenv -e .env -- npm start`, or configure your runtime to load it automatically).

## Next steps

1. Start the server: `npm start` (ensure `.env` is loaded).
2. Send a test request to `POST /mcp` with `{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","clientInfo":{"name":"test","version":"1.0"}}}`.
3. Check [PostHog Live Events](https://us.posthog.com/project/483112) for `$mcp_initialize` and `$mcp_tool_call` events.

> **Note:** `@posthog/mcp` is pre-1.0 (beta). Pin the version in `package.json` and check the [changelog](https://github.com/PostHog/posthog-js/releases) before upgrading.
