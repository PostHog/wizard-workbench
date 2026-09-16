# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript Hono custom MCP dispatcher and used the `PostHogMCP` path (path C).
- Installed pinned `@posthog/mcp` `0.16.3` and `posthog-node` `5.52.4` dependencies.
- Added one module-scope `PostHogMCP` client that requires `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the runtime environment.
- Prepared `tools/list` responses for intent and self-reported model capture, while dispatching only the cleaned tool arguments.
- Added `$mcp_initialize`, `$mcp_tools_list`, and `$mcp_tool_call` capture, including failures, timing, protocol revision when available, and HTTP client attribution headers.
- Added graceful PostHog shutdown on `SIGTERM`.
- Added the supplied PostHog project configuration to the local `.env` file. The file is already ignored by Git.
- Verified the integration with `npm run build`; TypeScript completed successfully.

## Files modified or created

- `src/index.ts` — PostHog client initialization and additive MCP analytics instrumentation.
- `package.json` — pinned analytics dependencies.
- `package-lock.json` — npm dependency lockfile.
- `.env` — local PostHog project token and host.
- `posthog-mcp-analytics-report.md` — this report.

## Manual next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in the deployed server environment; local values are already in `.env`.
2. Ensure the process or deployment loads those environment variables, then restart the MCP server.
3. Send an MCP initialize/list/call request. Canonical `$mcp_*` events will then appear in PostHog.
4. Use the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboard and event-reference guidance.

`@posthog/mcp` is pre-1.0 and has been pinned deliberately; review release notes before upgrading it.
