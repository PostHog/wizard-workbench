# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript STDIO MCP server using the official `@modelcontextprotocol/sdk` v1 `McpServer` (Path A).
- Installed and pinned the beta analytics SDK `@posthog/mcp@0.25.0` and `posthog-node@5.59.0`.
- Created one module-scope PostHog client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Wrapped the server immediately after construction with `instrument(server, posthog, { captureModel: true })`.
- Added graceful `SIGTERM` shutdown so queued analytics events are drained without writing to the STDIO protocol channel.
- Added explicit startup validation so missing credentials fail clearly instead of silently disabling analytics.
- Configured the supplied project token and host in the local `.env` file and ensured `.env` is ignored by Git.

## Files modified or created

- `src/index.ts` — PostHog client initialization, MCP instrumentation, model capture, and shutdown handling.
- `package.json` — pinned PostHog dependencies.
- `package-lock.json` — npm dependency lockfile.
- `.env` — local PostHog project token and host.
- `.gitignore` — excludes `.env` from version control.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `npm run build` passes (`tsc --noEmit`).
- Confirmed the installed SDK injects the required `llm_model` string into compatible tool schemas, strips it before dispatch, and maps non-`unknown` self-reported values to `$mcp_llm_model` with `$mcp_llm_model_source = "self_reported"`.
- Existing `echo` and `add` tool handlers were not changed.

## Manual next steps

1. Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in the server's deployment/runtime environment; the checked local `.env` is only for local configuration.
2. Restart the MCP server and invoke a tool. `$mcp_tools_list`, `$mcp_tool_call`, and applicable `$exception` events will then appear in PostHog.
3. Review the MCP Analytics dashboard and event reference in the [PostHog MCP Analytics documentation](https://posthog.com/docs/mcp-analytics).

`@posthog/mcp` is pre-1.0, so review release notes before upgrading the pinned version.
