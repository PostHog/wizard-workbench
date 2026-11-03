# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript MCP server using the official `@modelcontextprotocol/sdk` v1 `McpServer` with STDIO transport.
- Installed and pinned the beta `@posthog/mcp` SDK at `0.25.0`, plus `posthog-node` at `5.61.2`.
- Wrapped the existing server once with `instrument(server, posthog)` before tool registration. Existing `echo` and `add` handlers were left unchanged.
- Added one module-scope PostHog client configured only through `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.
- Kept the SDK defaults enabled, including agent intent, calling-model capture, conversation IDs, tools-list events, initialize events, and exception autocapture.
- Added a SIGTERM handler that calls `posthog.shutdown()` so queued events are drained without writing to the STDIO protocol channel.
- Added the supplied project token and host to the local `.env` file.

## Files modified or created

- `src/index.ts` — PostHog client initialization, MCP instrumentation, and graceful analytics shutdown.
- `package.json` — added pinned `@posthog/mcp` and `posthog-node` dependencies.
- `package-lock.json` — created by npm with resolved dependency versions; the official MCP SDK resolves to a compatible v1 release.
- `.env` — created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `npm run build` passes (`tsc --noEmit`).
- Static review confirms there is one analytics wrapper, credentials are read from environment variables, no defaults disable model capture or conversation IDs, and shutdown flushing is present.
- `@posthog/mcp` is beta and pinned because pre-1.0 minor releases may contain breaking changes.

## Manual next steps

1. Ensure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are exported or injected by the process manager that launches the MCP server. This project does not currently load `.env` automatically at runtime.
2. Keep `.env` out of version control and configure the same variables in deployment/CI environments.
3. Restart or reconnect the MCP client, then invoke a tool. The server will begin sending `$mcp_initialize`, `$mcp_tools_list`, `$mcp_tool_call`, and error-related events as applicable.
4. Review the events and MCP analytics dashboard using the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics).
5. Review the high-severity dependency advisory reported by `npm install` separately; no automatic audit fix was applied because it could introduce unrelated breaking changes.
