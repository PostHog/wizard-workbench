# PostHog MCP Analytics — Instrumentation Report

## Summary

The `workbench-stdio-server` MCP server has been instrumented with PostHog MCP analytics using **Path A** (official SDK `McpServer` wrapped with `instrument()`). Every tool call, agent intent, and failure the server handles will now be captured as `$mcp_*` events in PostHog.

## What changed

### Instrumentation path

**Path A — official SDK `McpServer`**: the server object was wrapped with `instrument(server, posthog)` immediately after construction. This is a single additive line; no tool handlers were modified.

### Files modified

| File | Change |
|------|--------|
| `src/index.ts` | Added `posthog-node` and `@posthog/mcp` imports; created a module-scope `PostHog` client; called `instrument(server, posthog)` after the server is constructed; added a `SIGTERM` handler that calls `posthog.shutdown()` to drain buffered events before exit. |
| `package.json` | Added `@posthog/mcp@^0.8.0` and `posthog-node@^5.40.0` to `dependencies`. |

### Files created

| File | Purpose |
|------|---------|
| `.env` | Contains `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` environment variables (not committed to version control). |

## Manual steps

1. **Load the env file at startup.** The server reads credentials from environment variables. Use a tool like [`dotenv`](https://www.npmjs.com/package/dotenv) or your process manager (e.g. `dotenvx`, `direnv`) to load `.env` before starting the server. Alternatively, export the variables in your shell:
   ```sh
   export POSTHOG_PROJECT_API_KEY=phc_...
   export POSTHOG_HOST=https://us.i.posthog.com
   ```

2. **Do not commit `.env`.** It is already covered by `.gitignore` (created by `wizard-tools`). Verify with `git status` before pushing.

3. **Pin the beta SDK** (`@posthog/mcp` is pre-1.0). Consider pinning to an exact version in `package.json` (remove the `^`) to avoid unexpected breaking changes in minor releases.

4. **Verify events appear in PostHog.** Start the server, send a tool call (e.g. via an MCP client or `npx @modelcontextprotocol/inspector`), then check your PostHog project for `$mcp_tool_called` events at [https://us.posthog.com/project/483112](https://us.posthog.com/project/483112).

## Reference

- PostHog MCP Analytics docs: https://posthog.com/docs/mcp-analytics
- Event and property reference: https://posthog.com/docs/mcp-analytics/events
