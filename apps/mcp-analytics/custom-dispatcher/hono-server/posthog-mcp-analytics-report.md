# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript Hono MCP server using a custom JSON-RPC dispatcher, so the integration uses the custom-dispatcher **Path C** with `PostHogMCP` rather than wrapping an MCP SDK server object.
- Installed and pinned `@posthog/mcp` at `0.25.0`, plus `posthog-node` and `dotenv`.
- Created one module-scoped `PostHogMCP` client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment. Missing configuration now fails clearly instead of silently disabling analytics.
- Added `$mcp_initialize` capture with client metadata and the negotiated protocol revision.
- Prepared the `tools/list` response so tools advertise the default intent, model, and conversation-correlation fields, and added `$mcp_tools_list` capture.
- Prepared incoming tool arguments before dispatch, while passing the original tool descriptor so analytics-owned arguments are removed correctly on this stateless HTTP path.
- Added `$mcp_tool_call` capture for successful and failed calls, including duration, intent, model, response, error state, protocol/session metadata, and HTTP client headers.
- Prepared outgoing results so conversation handles can correlate calls across requests.
- Added graceful PostHog shutdown on `SIGTERM` so queued events are flushed.
- Configured the supplied project token and US ingestion host in `.env`; `.env` is ignored by Git.

## Files modified or created

- `src/index.ts` — PostHog MCP analytics initialization, dispatcher instrumentation, and shutdown handling.
- `package.json` — added `@posthog/mcp`, `posthog-node`, and `dotenv` dependencies.
- `package-lock.json` — recorded resolved dependency versions.
- `.env` — configured `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `.gitignore` — ensures `.env` is not committed.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `npm run build` completed successfully (`tsc --noEmit`).
- Static checks confirmed that tool handlers receive `prepared.args`, results pass through `prepareToolResult`, model capture and conversation IDs remain at their defaults, and queued events are drained on shutdown.

## Manual next steps

1. In deployment or CI, set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` as runtime environment variables; do not rely on the local `.env` file outside development.
2. Restart the MCP server, connect an MCP client, run `tools/list`, and call a tool. The resulting `$mcp_*` events should then appear in PostHog.
3. Use the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for the dashboard and event reference.

> `@posthog/mcp` is currently beta and may include breaking changes in minor pre-1.0 releases. The installed version is pinned to reduce upgrade risk.
