# PostHog MCP Analytics Setup

## Changes made

- Detected a TypeScript Hono MCP server using a custom JSON-RPC dispatcher and applied the custom-dispatcher (Path C) integration.
- Installed `@posthog/mcp` pinned to `0.25.0` and added `posthog-node`.
- Created one module-scope `PostHogMCP` client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Added MCP initialize, tool-list, successful tool-call, and failed tool-call analytics without changing the existing tool implementations.
- Added tool schema preparation for agent intent and self-reported model capture, and ensured SDK-owned arguments are removed before tool dispatch.
- Captured request protocol, client user-agent, vendor-client metadata, tool descriptions, durations, responses, and errors when available.
- Enabled exception autocapture and graceful PostHog shutdown on `SIGTERM`.
- Added the provided PostHog project token and host to `.env`.

The server will emit canonical `$mcp_initialize`, `$mcp_tools_list`, and `$mcp_tool_call` events. Failed calls remain `$mcp_tool_call` events with `$mcp_is_error = true` and may also emit a sibling `$exception` event.

## Files modified or created

- `src/index.ts` — initialized `PostHogMCP` and instrumented the custom MCP dispatcher.
- `package.json` — added the PostHog dependencies with the MCP SDK pinned.
- `package-lock.json` — recorded installed dependency versions.
- `.env` — added the project token and ingestion host.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `npm run build` completed successfully (`tsc --noEmit`).
- Confirmed both required PostHog environment keys are present.
- Confirmed `tools/list` uses `prepareToolList`, `tools/call` dispatches cleaned arguments from `prepareToolCall`, and analytics are drained during shutdown.

## Manual steps

- Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in the deployed server environment; do not rely on the local `.env` file in production.
- Ensure the process that starts the server loads `.env` during local development, or export the two variables before running `npm start`.
- Restart the MCP server and make a `tools/list` request followed by a tool call. The `$mcp_*` events will then appear in PostHog.
- `@posthog/mcp` is pre-1.0, so review release notes before future upgrades.

See the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboards and the event reference.
