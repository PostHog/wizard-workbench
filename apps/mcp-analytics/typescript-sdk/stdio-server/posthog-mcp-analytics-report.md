# PostHog MCP analytics setup

## Changes made

- Detected a TypeScript STDIO MCP server built with the official `@modelcontextprotocol/sdk` v1 `McpServer` and used the Path A server wrapper.
- Installed and pinned the beta analytics packages: `@posthog/mcp` 1.3.0 and `posthog-node` 6.0.2.
- Added one module-scope PostHog client that reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Wrapped the server with `instrument(server, posthog)` immediately after construction and before tool registration. Existing `echo` and `add` behavior was not changed.
- Kept intent, model capture, conversation IDs, initialization events, tool-list events, resource events, and exception autocapture at their SDK defaults.
- Added STDIO-safe missing-configuration warnings on stderr.
- Added bounded PostHog shutdown handling for `SIGTERM` and closed stdin so queued events are drained without writing to stdout.
- Configured the supplied project token and host in the local `.env` file.

## Files modified or created

- `src/index.ts` — PostHog client initialization, MCP server instrumentation, and shutdown handling.
- `package.json` — pinned PostHog MCP analytics dependencies.
- `pnpm-lock.yaml` — resolved dependency lockfile; the compatible MCP SDK resolved to 1.32.2.
- `.env` — local `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `pnpm build` completed successfully (`tsc --noEmit`).
- Static checks confirmed there is one `instrument()` call, no analytics defaults are disabled, no stdout logging was added, and no PostHog token or host literal appears in source code.

## Manual next steps

1. Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to the `env` block of the MCP client's server configuration. This STDIO process does not automatically load `.env`, especially when launched from another working directory.
2. Ensure the runtime is Node.js 20.20+ or 22.22+, as required by the pinned PostHog packages.
3. Restart or reconnect the MCP server and invoke a tool. The next requests will produce `$mcp_*` events such as `$mcp_initialize`, `$mcp_tools_list`, and `$mcp_tool_call` in PostHog.
4. Review the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for the dashboard and event reference.

`@posthog/mcp` is currently beta and may include breaking changes between releases; its version is pinned intentionally.
