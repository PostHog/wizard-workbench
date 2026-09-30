# PostHog MCP Analytics Setup

## Changes made

- Detected a TypeScript Hono custom MCP dispatcher and used the `PostHogMCP` custom-dispatcher path.
- Installed and pinned `@posthog/mcp` 0.21.1 and `posthog-node` 5.54.1.
- Created one environment-backed `PostHogMCP` client at module scope with model capture enabled.
- Prepared advertised tool schemas for agent intent and self-reported model capture, then stripped analytics-owned arguments before invoking the existing tools.
- Added `$mcp_initialize`, `$mcp_tools_list`, and `$mcp_tool_call` capture, including failures, duration, protocol/session headers, and HTTP client metadata.
- Added graceful PostHog shutdown on `SIGINT` and `SIGTERM`.
- Kept conversation-ID injection disabled so existing tool response content remains unchanged.
- Added the provided `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to the local `.env` file.
- Verified the integration with `npm run build` (`tsc --noEmit`), which passed.

## Files modified or created

- `src/index.ts` — module-scope client, tool preparation, MCP event capture, and shutdown handling.
- `package.json` — pinned analytics dependencies.
- `package-lock.json` — npm dependency lock data.
- `.env` — local PostHog project token and host.
- `posthog-mcp-analytics-report.md` — this report.

## Next steps

- Ensure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are configured in the production runtime; do not rely on the local `.env` file in deployment.
- Restart the MCP server and send `initialize`, `tools/list`, and `tools/call` requests. The resulting `$mcp_*` events will then appear in PostHog.
- Keep `@posthog/mcp` pinned and review release notes before upgrading because it is pre-1.0.
- See [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboard and event-reference guidance.
