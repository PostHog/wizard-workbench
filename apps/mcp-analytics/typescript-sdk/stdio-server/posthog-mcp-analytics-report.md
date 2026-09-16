# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript STDIO MCP server using the official `@modelcontextprotocol/sdk` v1 `McpServer` (Path A).
- Installed and pinned `@posthog/mcp` at `0.16.3`, and installed `posthog-node` at `5.52.4`.
- Created one module-scope PostHog client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, with explicit startup validation so analytics cannot silently run with a missing token.
- Wrapped the server immediately after construction with `instrument(server, posthog, { captureModel: true })`.
- Added graceful `SIGTERM` shutdown so queued events are flushed without writing to the STDIO protocol channel.
- Configured the supplied PostHog project token and host in `.env` and updated the normal start command to load that file.
- Preserved the existing `echo` and `add` tool handlers unchanged.

## Files modified or created

- `src/index.ts` — PostHog client, MCP instrumentation, environment validation, and graceful shutdown.
- `package.json` — pinned analytics dependencies and `.env`-aware start command.
- `package-lock.json` — generated/updated dependency lock data.
- `.env` — local PostHog project configuration.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `npm run build` passes (`tsc --noEmit`).
- The installed wrapper version supports self-reported model capture. It advertises the required `llm_model` field, strips analytics-only fields before invoking existing tool handlers, and records non-`unknown` values on `$mcp_tool_call` as `$mcp_llm_model` with source `self_reported`.
- Once the server handles MCP traffic, PostHog will receive events including `$mcp_initialize`, `$mcp_tools_list`, `$mcp_tool_call`, and `$exception` for failures.

## Manual next steps

1. Restart the MCP server so it runs the new instrumentation (`npm start` loads the configured `.env`).
2. Invoke `tools/list` and one of the existing tools, then confirm the `$mcp_*` events appear in PostHog project `483112`.
3. Keep `@posthog/mcp` pinned when upgrading because it is a pre-1.0 beta package; review release notes before changing versions.
4. See the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboards and the event reference.
