# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript STDIO MCP server using the official `@modelcontextprotocol/sdk` v1 API.
- Installed pinned `@posthog/mcp` 0.25.0 and `posthog-node` 5.61.2 dependencies. The MCP analytics SDK is currently beta.
- Added one module-scoped PostHog client configured from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Wrapped the existing `McpServer` with `instrument(server, posthog)` immediately after construction. Existing tools and handlers were left unchanged.
- Added a SIGTERM handler that calls `posthog.shutdown()` so queued analytics events are drained before exit.
- Added the supplied project token and ingestion host to `.env`.
- Verified the integration with `npm run build`; TypeScript compilation passes.

## Files modified or created

- `src/index.ts` — PostHog client, MCP instrumentation, environment validation, and graceful shutdown.
- `package.json` — added `@posthog/mcp` and `posthog-node`.
- `package-lock.json` — generated/updated npm dependency lock data.
- `.env` — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — this report.

## Manual steps

- Ensure the production process exports `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, or explicitly loads `.env`; Node does not load `.env` automatically for the current start command. Do not commit `.env`.
- Restart/connect the MCP server and invoke a tool. The next requests should produce events such as `$mcp_initialize`, `$mcp_tools_list`, and `$mcp_tool_call` in PostHog.
- See the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboards and the event reference.
- npm reported one high-severity dependency advisory during installation; review it with your normal dependency-audit process before deployment.
