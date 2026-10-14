# PostHog MCP Analytics Setup

## Changes made

- Detected a TypeScript Hono MCP server using a custom JSON-RPC dispatcher and applied the custom-dispatcher (Path C) integration.
- Installed and pinned `@posthog/mcp` at `0.22.3` and installed `posthog-node` at `5.56.1`.
- Added one module-scope `PostHogMCP` client configured from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Prepared advertised tools for agent-intent and self-reported model capture, then stripped SDK-owned analytics arguments before dispatching to the existing tool handlers.
- Captured initialization, tool listings, successful tool calls, failed tool calls, timing, protocol revision, client headers, intent, and model metadata. Failed calls emit `$mcp_tool_call` with `$mcp_is_error = true` and can emit the sibling `$exception` event.
- Added graceful PostHog shutdown on `SIGTERM` so queued events are flushed.
- Preserved the existing JSON-RPC methods, tool implementations, protocol response, and success/error response shapes.
- Verified the integration with `npm run build` (`tsc --noEmit`), which completed successfully.

## Files modified or created

- `src/index.ts` — PostHog MCP client initialization, dispatcher capture calls, and shutdown flushing.
- `package.json` — pinned MCP analytics dependencies.
- `package-lock.json` — npm dependency lockfile.
- `.env` — configured `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (already excluded by `.gitignore`).
- `posthog-mcp-analytics-report.md` — this report.

## Manual steps

- Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in the deployed server environment as well; the local `.env` is not a substitute for deployment secrets/configuration.
- Restart or redeploy the MCP server, then send an `initialize`, `tools/list`, or `tools/call` request. The corresponding `$mcp_*` events will appear in PostHog.
- `@posthog/mcp` is pre-1.0 and may introduce breaking changes in minor versions; review release notes before changing the pinned version.
- See the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for event and dashboard guidance.
