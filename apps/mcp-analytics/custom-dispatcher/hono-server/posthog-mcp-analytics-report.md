# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript Hono MCP server with a custom JSON-RPC dispatcher and used the custom-dispatcher (`PostHogMCP`) integration path.
- Installed and pinned the beta `@posthog/mcp` SDK at `0.25.0`, plus `posthog-node` and `dotenv`.
- Loaded `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment and configured their supplied values in the local `.env` file.
- Prepared advertised tools for intent, calling-model, and conversation-ID capture while dispatching only the cleaned `prepared.args` to existing handlers.
- Added analytics for initialize requests, tool listings, successful tool calls, failed tool calls, durations, protocol/session metadata, and HTTP client headers.
- Added conversation-handle preparation to tool results and graceful PostHog shutdown on `SIGTERM`.
- Preserved the existing tool implementations, response handling, endpoint, and server transport.

## Files modified or created

- `src/index.ts` — custom-dispatcher analytics and shutdown lifecycle.
- `package.json` — pinned analytics dependencies.
- `package-lock.json` — npm dependency lock updates.
- `.env` — local PostHog project token and host configuration.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `npm run build` passes (`tsc --noEmit`).
- Confirmed model capture and conversation IDs remain enabled at SDK defaults.
- Confirmed tool handlers receive `prepared.args`, not raw analytics-enriched arguments.
- Confirmed failed tools remain `$mcp_tool_call` events with `$mcp_is_error = true` and may emit a sibling `$exception`.

## Manual next steps

1. Provide `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in the deployed runtime as well as locally; do not rely on committing `.env`.
2. Restart the MCP server, connect an MCP client, list tools, and call a tool. `$mcp_*` events will then appear in PostHog.
3. Use the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for the dashboard and event reference.
4. Review the moderate-severity dependency advisory reported by `npm install` according to the project's dependency-update policy.

> `@posthog/mcp` is currently beta and may include breaking changes in minor pre-1.0 releases; the installed version is pinned.
