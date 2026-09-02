# PostHog MCP Analytics — Setup Report

## What was done

Instrumented this MCP server with PostHog MCP analytics using **Path A** (official `@modelcontextprotocol/sdk` v1, `McpServer`). Every tool call, tools-list response, initialize handshake, and thrown error will now emit a `$mcp_*` event in PostHog.

## Files modified

| File | Change |
|------|--------|
| `src/index.ts` | Added `posthog-node` client, `instrument(server, posthog)` call, and `SIGTERM` shutdown handler |
| `package.json` | Added `@posthog/mcp@^0.12.0` and `posthog-node@^5.51.6` to `dependencies` |
| `.env` | Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` |

## Key changes in `src/index.ts`

- **PostHog client** created once at module scope, reading credentials from `process.env.POSTHOG_PROJECT_TOKEN` and `process.env.POSTHOG_HOST`. If the token is absent, a warning is written to `stderr` and PostHog is skipped (the server still starts normally).
- **`instrument(server, posthog)`** called immediately after `new McpServer(...)` — wraps tool dispatch to capture analytics without altering tool behavior.
- **`SIGTERM` handler** calls `posthog.shutdown()` before exit so queued events are flushed (critical for long-running STDIO servers).

## Events you'll see in PostHog

Once the server handles its first request:

- `$mcp_initialize` — per client handshake
- `$mcp_tools_list` — per `tools/list` response
- `$mcp_tool_call` — per tool invocation (`echo`, `add`)
- `$exception` — if any tool throws or returns `isError: true`

## Next steps

1. **Load `.env` before starting the server** (e.g. `dotenv` or your process manager). `tsx` doesn't load `.env` automatically — add `--env-file .env` or set the vars in your shell:
   ```bash
   POSTHOG_PROJECT_TOKEN=phc_... POSTHOG_HOST=https://us.i.posthog.com npm start
   # or with tsx's --env-file flag (tsx >= 4.x):
   npx tsx --env-file .env src/index.ts
   ```
2. **Explore events** in PostHog → [MCP Analytics docs](https://posthog.com/docs/mcp-analytics) for the dashboard template and full event reference.
3. **Beta SDK note**: `@posthog/mcp` is pre-1.0 — pin it (already done) and check the changelog before upgrading.
