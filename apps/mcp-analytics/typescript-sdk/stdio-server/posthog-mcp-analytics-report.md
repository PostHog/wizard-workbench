# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript STDIO MCP server using the official `@modelcontextprotocol/sdk` v1 high-level `McpServer` (Path A).
- Installed `@posthog/mcp` at the exact pinned version `0.16.3` and installed `posthog-node` `5.52.4`.
- Added one module-scoped `PostHog` client configured from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, with explicit validation so analytics cannot silently start without credentials.
- Wrapped the server immediately after construction with `instrument(server, posthog, { captureModel: true })`, before either existing tool is registered. Existing `echo` and `add` behavior was not changed.
- Added graceful `SIGTERM` shutdown with `posthog.shutdown()` so queued events are drained without writing to the STDIO protocol channel.
- Added the supplied PostHog project token and host to the local `.env` file.
- Created the [MCP Server Analytics dashboard](https://us.posthog.com/project/483112/dashboard/2103579) with daily tool-call, per-tool quality, and self-reported model performance insights.

## Files modified or created

- Modified `src/index.ts`
- Modified `package.json`
- Created `package-lock.json`
- Created/updated `.env`
- Created `posthog-mcp-analytics-report.md`

## Verification

- `npm run build` completed successfully (`tsc --noEmit`).
- Confirmed both required environment keys are present.
- Force-ran all three dashboard insights successfully. They currently have no rows and will populate after this server handles instrumented MCP requests.

## Manual next steps

1. Ensure the server process receives `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` or the deployment environment when it starts.
2. Restart the MCP server and invoke `tools/list`, `echo`, and `add` from an MCP client. Supported clients will be asked for `context` and self-reported `llm_model`; the wrapper removes these injected fields before existing handlers run.
3. Confirm `$mcp_initialize`, `$mcp_tools_list`, `$mcp_tool_call`, and any `$exception` events in PostHog. Failed tool calls remain `$mcp_tool_call` events with `$mcp_is_error = true`.
4. Review the beta dependency periodically before upgrades because `@posthog/mcp` is pre-1.0 and may include breaking changes in minor releases.

Event and dashboard reference: [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics).
