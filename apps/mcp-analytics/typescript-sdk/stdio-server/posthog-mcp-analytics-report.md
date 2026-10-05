# PostHog MCP Analytics Setup Report

## Changes made

- Detected an official `@modelcontextprotocol/sdk` v1 `McpServer` using the long-running STDIO transport (Path A).
- Installed and pinned `@posthog/mcp` `0.21.4` and installed `posthog-node` `5.55.0`.
- Created one module-scope PostHog client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, with exception autocapture enabled.
- Wrapped the server immediately after construction with `instrument(server, posthog, { captureModel: true })`.
- Added graceful PostHog shutdown on `SIGTERM` and flush-on-fatal-error behavior without writing to STDOUT or changing either tool handler.
- Configured the supplied project token and host in the local `.env` file. No credential is hardcoded in source.
- Verified the integration with `npm run build` (`tsc --noEmit`). The installed analytics SDK injects a required `llm_model` string into compatible tool schemas, strips it before dispatch, and records valid self-reported values on `$mcp_tool_call` as `$mcp_llm_model` with `$mcp_llm_model_source = "self_reported"`.

## Files modified or created

- `src/index.ts` — PostHog client, MCP instrumentation, exception capture, and shutdown handling.
- `package.json` — added `@posthog/mcp` and `posthog-node` dependencies.
- `package-lock.json` — recorded resolved dependency versions.
- `.env` — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — this report.

## Manual next steps

1. Ensure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are supplied by the deployment environment. The local `.env` file is configured, but Node does not load `.env` automatically unless the process launcher does so.
2. Restart the MCP server/client so the instrumented entry point is loaded, then invoke or list tools. Events such as `$mcp_initialize`, `$mcp_tools_list`, `$mcp_tool_call`, and tool-failure `$exception` events will appear in PostHog.
3. Keep `@posthog/mcp` pinned and review release notes before upgrading because it is a pre-1.0 package.
4. Use the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboard and event-reference guidance.
