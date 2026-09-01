# PostHog MCP Analytics — Setup Report

## What was done

Instrumented the `workbench-stdio-server` MCP server (TypeScript, `@modelcontextprotocol/sdk` v1, STDIO transport) with PostHog MCP analytics using **Path A** — wrapping the existing `McpServer` object with `instrument(server, posthog)`.

## Files modified or created

| File | Change |
|---|---|
| `src/index.ts` | Added `PostHog` client, `instrument()` call, and `SIGTERM` shutdown handler |
| `package.json` | `@posthog/mcp@0.12.0` and `posthog-node` added as dependencies |
| `package-lock.json` | Updated by npm |
| `.env` | Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` |

## Changes in `src/index.ts`

- Imported `PostHog` from `posthog-node` and `instrument` from `@posthog/mcp`
- Created a module-scope `PostHog` client reading credentials from `process.env`
- Called `instrument(server, posthog, { captureModel: true })` immediately after constructing `McpServer`
- Added a `SIGTERM` handler that calls `posthog.shutdown()` to flush batched events before exit

## Instrumentation options

- `captureModel: true` — captures the agent's self-reported model identity on every `$mcp_tool_call` event (requires `@posthog/mcp >= 0.12.0`, which is installed)

## Events captured

Once the server handles its first request, you'll see these events in PostHog:

- `$mcp_initialize` — on the `2025-11-25` protocol handshake
- `$mcp_tool_call` — on every tool invocation (`echo`, `add`), with `$mcp_llm_model` when the client self-reports it
- `$mcp_tool_failed` — on any tool error

## Manual steps

1. Confirm `.env` is not committed to version control (it is in `.gitignore` if the tool created it correctly)
2. When deploying, set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in your runtime environment
3. Start the server with `npm start` or `node --env-file=.env -r tsx/esm src/index.ts`
4. See the [PostHog MCP analytics dashboard and event reference](https://posthog.com/docs/mcp-analytics)
