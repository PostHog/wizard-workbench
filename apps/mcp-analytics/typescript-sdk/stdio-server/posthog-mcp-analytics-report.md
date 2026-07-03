# PostHog MCP Analytics — Instrumentation Report

## Summary

The `workbench-stdio-server` MCP server (TypeScript, official `@modelcontextprotocol/sdk`, STDIO transport) has been instrumented with PostHog MCP analytics using **Path A** (high-level `McpServer` wrap).

Every tool call, `tools/list` response, and client handshake the server handles will now emit `$mcp_*` events to PostHog. See the [event reference](https://posthog.com/docs/mcp-analytics) for the full catalog.

## Changes made

### Files modified

| File | Change |
|------|--------|
| `src/index.ts` | Added `PostHog` client at module scope, `instrument(server, posthog)` call immediately after server construction, and a `SIGTERM` handler for graceful shutdown |
| `package.json` | Added `@posthog/mcp@0.7.0` (pinned, pre-1.0) and `posthog-node` as dependencies |

### Files created

| File | Purpose |
|------|---------|
| `.env` | Stores `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` — never committed to source control |

## Key instrumentation details

- **SDK**: `@posthog/mcp@0.7.0` (pinned — pre-1.0 SDK, pin while iterating)
- **Path**: Path A — `instrument(server, posthog)` wrapping an official SDK `McpServer`
- **Client**: `posthog-node`, created once at module scope
- **Credentials**: read from `process.env.POSTHOG_PROJECT_API_KEY` and `process.env.POSTHOG_HOST`
- **Shutdown**: `SIGTERM` handler calls `posthog.shutdown()` to flush in-flight events before exit

## Manual steps

1. **Ensure `.env` is loaded at runtime.** If you run the server with a tool that doesn't auto-load `.env` (e.g. plain `node`/`tsx`), use a loader such as `dotenv/config` or `dotenvx`, or export the variables in your shell before starting:
   ```sh
   export POSTHOG_PROJECT_API_KEY=phc_...
   export POSTHOG_HOST=https://us.i.posthog.com
   tsx src/index.ts
   ```
2. **Verify events in PostHog.** Run the server and send a tool call (e.g. via an MCP client or `mcptools`). You should see `$mcp_tool_call`, `$mcp_tools_list`, and `$mcp_initialize` events appear in your PostHog project within seconds.
3. **Dashboard & event reference**: https://posthog.com/docs/mcp-analytics
