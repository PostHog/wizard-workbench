# PostHog MCP analytics setup

## Changes made

- Detected a TypeScript Hono MCP custom dispatcher and used the custom-dispatcher (`PostHogMCP`) integration path.
- Installed `@posthog/mcp` pinned to `0.22.2` and added `posthog-node`.
- Added one module-scope `PostHogMCP` client backed by `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Prepared advertised tool schemas for agent intent, self-reported model, and conversation correlation; dispatch still receives cleaned application arguments.
- Captured `$mcp_tools_list` and successful or failed `$mcp_tool_call` events, including timing, protocol/header metadata, sanitized parameters and responses, model metadata, and error details. Failed calls can also emit `$exception`.
- Added a SIGTERM shutdown hook so queued events are flushed before exit.
- Added the supplied PostHog project configuration to the local `.env` file.
- Verified the integration with `npm run build` (`tsc --noEmit`), which passes.

## Files modified or created

- `src/index.ts` — custom-dispatcher instrumentation and shutdown handling.
- `package.json` — PostHog dependencies with the beta MCP SDK pinned.
- `package-lock.json` — npm dependency lock.
- `.env` — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — this report.

## Manual next steps

- Ensure the deployment/runtime supplies `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; `.env` is local configuration and must be loaded by the runtime or deployment platform.
- Restart the MCP server and make a `tools/list` request followed by a tool call. MCP analytics events will then appear in PostHog.
- This server currently negotiates MCP revision `2024-11-05`, so no `$mcp_initialize` event was added; the workflow only captures that handshake for `2025-11-25`, and `2026-07-28` has no initialize handshake.
- Use the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboard and event-reference guidance. The `@posthog/mcp` package is pre-1.0 and may include breaking changes in minor releases.
