# PostHog MCP Analytics Setup Report

## Changes made

- Detected an official TypeScript MCP SDK v1 server using `McpServer` over STDIO, and selected the `instrument(server, posthog)` wrapping path.
- Installed and pinned the beta `@posthog/mcp` package at `0.21.1`, plus `posthog-node` at `5.54.1`.
- Created one module-scope PostHog client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Added an explicit startup check so missing credentials fail visibly rather than silently disabling analytics.
- Wrapped the server immediately after construction with model capture enabled. Existing `echo` and `add` tool implementations were left unchanged.
- Added graceful PostHog shutdown on `SIGTERM` so queued events are drained without writing to the STDIO protocol channel.
- Configured the supplied project token and host in the local `.env` file.

## Files modified or created

- `src/index.ts` — added the PostHog client, MCP instrumentation, environment validation, and graceful shutdown.
- `package.json` — added pinned `@posthog/mcp` and `posthog-node` dependencies.
- `package-lock.json` — recorded the installed dependency graph.
- `.env` — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `npm run build` completed successfully with no TypeScript errors.
- Confirmed the installed MCP analytics SDK advertises a required `llm_model` string on compatible tool schemas, strips SDK-owned analytics arguments before invoking handlers, and records non-`unknown` self-reported values as `$mcp_llm_model` with source `self_reported`.
- Confirmed both required environment keys are present.

## Manual next steps

1. Ensure the process that launches the MCP server loads `.env` or otherwise supplies `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in its runtime environment.
2. Restart or redeploy the MCP server.
3. Invoke `tools/list` and call a tool. PostHog will then receive `$mcp_tools_list`, `$mcp_tool_call`, and supported handshake/error events.
4. Review the MCP analytics dashboard and event reference at https://posthog.com/docs/mcp-analytics.

`@posthog/mcp` is pre-1.0 and pinned intentionally; review release notes before upgrading it.
