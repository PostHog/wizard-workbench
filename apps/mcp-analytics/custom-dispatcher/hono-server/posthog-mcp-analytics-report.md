# PostHog MCP Analytics Setup

## Changes made

- Detected a TypeScript Hono custom MCP dispatcher and used the Path C `PostHogMCP` integration.
- Installed pinned `@posthog/mcp` `0.16.3` and `posthog-node` `5.52.4` dependencies.
- Created one module-scope `PostHogMCP` client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Prepared advertised tool schemas for agent intent and self-reported model capture, then stripped analytics-owned arguments before invoking the existing tool handlers.
- Added canonical `$mcp_initialize`, `$mcp_tools_list`, and `$mcp_tool_call` capture, including timing, failures, protocol revision when available, user-agent, and vendor-client metadata.
- Added graceful PostHog shutdown on `SIGTERM` so queued events are drained.
- Verified the integration with `npm run build` (`tsc --noEmit`), which passes.

## Files modified or created

- `src/index.ts` — MCP analytics instrumentation and graceful shutdown.
- `package.json` — pinned analytics dependencies.
- `package-lock.json` — generated dependency lockfile.
- `.env` — configured `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (values intentionally omitted here).
- `posthog-mcp-analytics-report.md` — this report.

## Manual next steps

1. Ensure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are supplied by the deployment environment; do not rely on the local `.env` file in production.
2. Restart or deploy the MCP server and handle an `initialize`, `tools/list`, or `tools/call` request. The corresponding `$mcp_*` events will then appear in PostHog.
3. Keep `@posthog/mcp` pinned and review release notes before upgrading because the SDK is pre-1.0.
4. Use the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboard and event-reference guidance.
