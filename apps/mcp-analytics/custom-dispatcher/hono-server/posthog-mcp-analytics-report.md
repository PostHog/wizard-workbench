# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript Hono custom MCP dispatcher and used the `PostHogMCP` custom-dispatcher path.
- Installed `@posthog/mcp` pinned to `0.23.0` and `posthog-node` pinned to `5.57.0`.
- Added one module-scoped PostHog client configured from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Prepared advertised tool schemas for agent intent and self-reported model capture, then stripped SDK-owned fields before tool dispatch.
- Added `$mcp_initialize`, `$mcp_tools_list`, `$mcp_tool_call`, and failed-call/`$exception` capture with timing, protocol, session, and client-header metadata when available.
- Added graceful PostHog shutdown on `SIGTERM`.
- Verified the integration with `npm run build` (`tsc --noEmit`), which passed.

`@posthog/mcp` is pre-1.0 beta software, so its version is pinned to avoid unexpected minor-version breaking changes.

## Files modified or created

- `src/index.ts` — custom-dispatcher instrumentation and shutdown handling.
- `package.json` — analytics dependencies.
- `package-lock.json` — pinned dependency resolution.
- `.env` — configured PostHog project token and host.
- `posthog-mcp-analytics-report.md` — this report.

## Manual steps

- Ensure the production runtime provides `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (or explicitly loads the local `.env` file). Do not rely on `.env` being loaded automatically by Node.js.
- Restart the MCP server and send an MCP request. Canonical `$mcp_*` events will then appear in PostHog.
- Use the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for the dashboard and event reference.
