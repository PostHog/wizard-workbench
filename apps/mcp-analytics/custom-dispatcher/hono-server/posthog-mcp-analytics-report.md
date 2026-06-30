# PostHog MCP Analytics — Instrumentation Report

## Instrumentation path

**Path C — custom HTTP dispatcher.** This project is a Hono-based HTTP server that speaks the MCP JSON-RPC protocol directly, with no `@modelcontextprotocol/sdk` server object. It was instrumented using `PostHogMCP` from `@posthog/mcp`, which is a drop-in subclass of the `posthog-node` client that adds `captureToolCall` and `captureInitialize` helpers.

## Changes made

### Packages installed (`package.json`)

- `@posthog/mcp@^0.5.1` — MCP analytics SDK (pre-1.0; pin this version)
- `posthog-node@^5.38.8` — PostHog Node.js client (peer dependency)

### Files modified

| File | Change |
|---|---|
| `src/index.ts` | Added `PostHogMCP` client at module scope; `captureInitialize` on every `initialize` handshake; `captureToolCall` (success and error) on every `tools/call`; `SIGTERM` handler for graceful shutdown |

### Files created

| File | Change |
|---|---|
| `.env` | Created with `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` |

## What gets captured

Once the server handles its first request, you will see these events in PostHog:

- **`$mcp_tool_called`** — fired after each `tools/call`, with `$mcp_tool_name`, `$mcp_parameters`, `$mcp_response`, `$mcp_duration_ms`, and `$mcp_is_error`
- **`$mcp_initialized`** — fired on each `initialize` handshake, with `$mcp_client_name` and `$mcp_client_version` when the client sends them
- **`$exception`** — auto-captured alongside `$mcp_tool_called` whenever `isError: true`

See the full event reference at https://posthog.com/docs/mcp-analytics

## Manual steps to take next

1. **Load the `.env` file at startup.** The server reads `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` from `process.env`. Pass `--env-file=.env` to Node (requires Node 20.6+):

   ```bash
   node --env-file=.env --import tsx/esm src/index.ts
   # or update the "start" script in package.json:
   # "start": "node --env-file=.env ./node_modules/.bin/tsx src/index.ts"
   ```

   Alternatively, export the variables in your shell or CI environment before starting the server.

2. **Pin `@posthog/mcp`.** The SDK is pre-1.0 and may ship breaking changes in minor releases. Consider pinning to an exact version (e.g., `0.5.1`) in `package.json` once you've validated the integration.

3. **Check the PostHog dashboard.** After the server handles a request, navigate to your PostHog project and search for `$mcp_tool_called` in the Events view. The MCP analytics dashboard and event reference are at https://posthog.com/docs/mcp-analytics.
