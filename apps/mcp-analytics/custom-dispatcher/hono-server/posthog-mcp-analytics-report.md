# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript Hono MCP server using a custom JSON-RPC dispatcher and applied the custom-dispatcher (Path C) integration.
- Installed and pinned the beta SDK packages `@posthog/mcp` 1.3.0 and `posthog-node` 6.0.2.
- Added one module-scope `PostHogMCP` client configured from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Prepared the advertised tool schemas so intent, calling-model, and conversation correlation remain enabled at their SDK defaults.
- Added `$mcp_initialize`, `$mcp_tools_list`, and `$mcp_tool_call` capture, including failures, duration, protocol version, transport session, conversation ID, and available client headers.
- Tool handlers receive only `prepareToolCall(...).args`; their existing behavior is unchanged. Results pass through `prepareToolResult(...)` for conversation correlation.
- Added graceful PostHog shutdown on `SIGTERM` and updated the start command to load `.env` with Node's built-in environment-file support.
- Configured the supplied project token and host in `.env`.
- Verified the integration with `pnpm build` (`tsc --noEmit`), which passed.

## Files modified or created

- `src/index.ts` — MCP analytics instrumentation and shutdown handling.
- `package.json` — pinned SDK dependencies and environment-aware start command.
- `../../../../pnpm-lock.yaml` — workspace dependency lock updates.
- `.env` — PostHog project token and host.
- `posthog-mcp-analytics-report.md` — this report.

## Manual next steps

- Ensure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are also set in the deployed server environment or the MCP client's server `env` configuration. `pnpm start` loads the local `.env`, but deployments may not.
- Use a supported Node.js runtime (`20.20+` or `22.22+`, as required by the installed beta SDK).
- Start the server and make an MCP tool call. The resulting `$mcp_*` events should then appear in PostHog.
- See the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for the dashboard and event reference.
