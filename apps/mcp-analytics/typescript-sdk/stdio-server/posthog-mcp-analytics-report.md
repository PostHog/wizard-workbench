# PostHog MCP Analytics — Instrumentation Report

## What was done

Instrumented this TypeScript STDIO MCP server (Path A — `McpServer` from the official `@modelcontextprotocol/sdk`) with PostHog MCP analytics. Every tool call, tools-list response, and client handshake will now emit `$mcp_*` events to PostHog.

## Files modified

### `src/index.ts`
- Imported `instrument` from `@posthog/mcp` and `PostHog` from `posthog-node`.
- Created a `PostHog` client at module scope, reading credentials from `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` env vars.
- Called `instrument(server, posthog)` immediately after constructing the `McpServer`.
- Added a `SIGTERM` handler that calls `posthog.shutdown()` before exiting so in-flight events are flushed.

### `package.json`
- Added `@posthog/mcp@^0.7.0` and `posthog-node@^5.39.2` to `dependencies`.

### `.env` (created)
- `POSTHOG_PROJECT_API_KEY` — project API key (`phc_…`).
- `POSTHOG_HOST` — `https://us.i.posthog.com`.

## Manual steps

1. **Load `.env` at runtime.** If you start the server with `npm start` / `tsx src/index.ts` directly, export the env vars or use a tool like `dotenv-cli`:
   ```sh
   npx dotenv-cli -e .env -- npm start
   ```
2. **Keep the API key out of version control.** Confirm `.env` is listed in `.gitignore`.
3. **See events in PostHog.** Once the server handles its first request, `$mcp_tool_call`, `$mcp_tools_list`, and `$mcp_initialize` events will appear in your PostHog project. Visit https://posthog.com/docs/mcp-analytics for the dashboard template and full event reference.

> **Note:** `@posthog/mcp` is pre-1.0. Pin or review the version when upgrading.
