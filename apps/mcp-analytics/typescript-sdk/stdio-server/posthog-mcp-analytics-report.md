# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript STDIO MCP server using the official `@modelcontextprotocol/sdk` v1 high-level `McpServer` (wrapping Path A).
- Installed and pinned the pre-1.0 `@posthog/mcp` SDK at `0.23.0` and `posthog-node` at `5.57.0`.
- Created one module-scope PostHog client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Wrapped the server immediately after construction with `instrument(server, posthog, { captureModel: true })` without changing either tool handler.
- Added SIGTERM shutdown handling so queued analytics events are drained before the process exits.
- Added strict startup validation so missing PostHog environment variables cannot silently disable analytics.
- Configured the supplied project token and host in the ignored local `.env` file.
- Verified the integration with `npm run build` (`tsc --noEmit`), which passes.

The server will emit canonical events such as `$mcp_tools_list`, `$mcp_initialize`, `$mcp_tool_call`, and `$exception` after it handles MCP traffic. Model capture is enabled and self-reported model values are removed before tool dispatch.

## Files modified or created

- `src/index.ts` — PostHog client initialization, MCP server instrumentation, and graceful shutdown.
- `package.json` — pinned analytics dependencies.
- `package-lock.json` — npm dependency lockfile generated/updated by installation.
- `.env` — local `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.
- `.gitignore` — contains `.env` so local configuration is not committed.
- `posthog-mcp-analytics-report.md` — this report.

## Manual next steps

1. Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployed runtime; local values are already present in `.env`.
2. Restart the MCP server and make a tool request. MCP analytics events should then appear in PostHog.
3. Use the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for the dashboard and full event reference.

No tool behavior was changed. Because `@posthog/mcp` is pre-1.0, review release notes before future dependency upgrades.
