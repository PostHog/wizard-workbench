# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript STDIO MCP server using the official `@modelcontextprotocol/sdk` v1 and selected instrumentation Path A.
- Installed `@posthog/mcp` pinned to `0.22.2` (pre-1.0 beta) and `posthog-node`.
- Created one module-scope PostHog client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Wrapped the existing `McpServer` immediately after construction with `instrument(server, posthog, { captureModel: true })`.
- Added graceful PostHog shutdown on `SIGTERM`. Existing tools and their handlers were left unchanged.
- Configured the supplied project token and US Cloud host in `.env`.
- Verified the integration with `npm run build`; TypeScript compilation passes.

Once the server handles MCP requests, PostHog will receive events including `$mcp_tools_list`, `$mcp_initialize`, `$mcp_tool_call`, and `$exception` for failed calls.

## Files modified or created

- `src/index.ts`
- `package.json`
- `package-lock.json` (created)
- `.env` (created)
- `posthog-mcp-analytics-report.md` (created)

## Manual next steps

1. Ensure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are supplied by the deployment environment; do not commit `.env`.
2. Restart the MCP server and invoke a tool to begin sending `$mcp_*` events.
3. Review MCP analytics in PostHog using the [MCP analytics dashboard and event reference](https://posthog.com/docs/mcp-analytics).
