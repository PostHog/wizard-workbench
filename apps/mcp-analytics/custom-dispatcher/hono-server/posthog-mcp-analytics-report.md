# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript Hono MCP server with a custom JSON-RPC dispatcher and used the custom-dispatcher (`PostHogMCP`) integration path.
- Installed and pinned the beta MCP analytics packages:
  - `@posthog/mcp` `1.1.1`
  - `posthog-node` `5.69.0`
- Created one module-scoped `PostHogMCP` client that reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Prepared advertised tool schemas so agent intent, calling model, and conversation correlation can be supplied without reaching tool handlers.
- Added `$mcp_tools_list` capture for tool discovery requests.
- Added `$mcp_tool_call` capture for successful and failed calls, including prepared arguments, prepared results, duration, error state, model/intent metadata, conversation/session correlation, protocol version when supplied by the request, user agent, and vendor client header.
- Kept the existing `echo` and `add` tool implementations and their JSON-RPC routing intact.
- Added a `SIGTERM` shutdown handler to flush queued analytics before process exit.
- Stored the configured project token and ingest host in `.env` without hardcoding either value in source.

The TypeScript MCP analytics SDK is beta and may include breaking changes before a stable major release. The installed versions are pinned to make upgrades explicit.

## Files modified or created

- `src/index.ts` — added the custom-dispatcher analytics client, tool-list and tool-call instrumentation, request metadata, failure capture, and graceful shutdown.
- `package.json` — added exact `@posthog/mcp` and `posthog-node` dependencies.
- `pnpm-lock.yaml` — created/updated with resolved dependency versions.
- `.env` — created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — created this report.

## Verification

- `pnpm build` completed successfully (`tsc --noEmit`).
- Confirmed both required environment keys are present in `.env`.
- Confirmed tool handlers receive `prepared.args`, responses pass through `prepareToolResult`, and model/conversation capture remain enabled at SDK defaults.
- The server currently negotiates the legacy `2024-11-05` protocol revision. No synthetic `$mcp_initialize` event was added because the SDK workflow only captures initialize events for the `2025-11-25` handshake. Tool-call protocol revision is captured when the client supplies the `MCP-Protocol-Version` request header.

## Manual steps

1. Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to the MCP server's `env` block in the MCP client configuration or deployment environment. The Node process does not automatically load `.env`, and an MCP client may launch it from another working directory.
2. Restart the MCP server and call `tools/list`, then invoke a tool. `$mcp_tools_list` and `$mcp_tool_call` events will begin appearing in PostHog.
3. Do not commit `.env` if the repository's ignore rules do not already exclude it.
4. Use the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for the dashboard and event reference.
