# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript MCP server using the official `@modelcontextprotocol/sdk` v1 `McpServer` with STDIO transport.
- Installed and pinned the beta MCP analytics dependencies: `@posthog/mcp` 1.1.1 and `posthog-node` 5.69.0.
- Resolved the existing MCP SDK to a compatible v1 release in the lockfile.
- Created one module-scope PostHog client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Wrapped the existing server with `instrument(server, posthog)` before tool registration. Existing tool definitions and handlers were left unchanged.
- Added STDIO-safe draining for `SIGTERM` and closed stdin so queued analytics events are sent before exit.
- Added a stderr-only warning when the project token is unavailable; stdout remains reserved for MCP protocol traffic.
- Added the supplied PostHog project token and host to the local `.env` file.
- Verified the integration with `pnpm build` (`tsc --noEmit`), which passes.

## Files modified or created

- `src/index.ts` — PostHog client, MCP instrumentation wrapper, and shutdown lifecycle.
- `package.json` — exact analytics dependency pins.
- `pnpm-lock.yaml` — resolved dependency graph.
- `.env` — local `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.
- `posthog-mcp-analytics-report.md` — this report.

## Manual steps

- Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to the MCP server's `env` block in the MCP client configuration. This STDIO process does not load `.env` automatically and may be launched from another working directory.
- Restart or reconnect the MCP client, then call a tool. `$mcp_*` events, including `$mcp_tool_call`, will appear in PostHog after requests are handled.
- Review the MCP analytics dashboard and event reference at https://posthog.com/docs/mcp-analytics.

`@posthog/mcp` is currently beta and may include breaking changes before a stable major release; the installed version is pinned exactly.
