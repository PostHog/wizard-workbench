# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript Hono custom MCP dispatcher and used the custom-dispatcher (Path C) integration.
- Installed and pinned `@posthog/mcp` `0.21.0` and `posthog-node` `5.54.1`; added Node type definitions for the environment and shutdown hooks.
- Created one module-scope `PostHogMCP` client backed by `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, with model capture and exception autocapture enabled.
- Added `tools/list` preparation and capture so analytics-only intent and self-reported model fields are advertised.
- Added `tools/call` preparation so analytics-only fields are removed before the original tool handler runs.
- Added successful and failed `$mcp_tool_call` capture with durations, sanitized parameters/results, tool descriptions, intent, model metadata, protocol revision, session header, user agent, and vendor client header when available.
- Added `$mcp_tools_list` capture and conditional `$mcp_initialize` capture for the `2025-11-25` handshake. The server's existing `2024-11-05` response and all tool behavior were left unchanged.
- Added graceful PostHog shutdown on `SIGTERM`.
- Configured the supplied PostHog project token and host in the local `.env` file.

## Files modified or created

- `src/index.ts` — initialized `PostHogMCP` and added MCP analytics instrumentation.
- `package.json` — added pinned analytics dependencies and Node type definitions.
- `package-lock.json` — recorded installed dependency versions.
- `.env` — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `npm run build` passed (`tsc --noEmit`).
- Confirmed both PostHog environment keys are present.
- Confirmed `prepareToolList()` advertises analytics fields and `prepareToolCall()` strips them before `runTool()` receives arguments.
- Confirmed success and error paths both emit canonical `$mcp_tool_call` events; failed calls also support the sibling `$exception` event.

## Manual next steps

1. Ensure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are set in the deployed server environment; local values are already in `.env`.
2. Restart or redeploy the MCP server, then issue `tools/list` and `tools/call` requests.
3. Check PostHog for `$mcp_tools_list`, `$mcp_tool_call`, and `$exception` events. A `$mcp_initialize` event is intentionally emitted only for a `2025-11-25` handshake; the existing server currently responds with `2024-11-05` and that protocol behavior was not changed.
4. Use the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboard and event-reference guidance. `@posthog/mcp` is pre-1.0, so review release notes before future upgrades.
