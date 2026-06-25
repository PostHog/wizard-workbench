# wb-mcp-hono-dispatcher

A PostHog-less **custom** MCP dispatcher (Hono HTTP, raw JSON-RPC, no
`@modelcontextprotocol/sdk` server object). Test fixture for the path-C branch
of `wizard mcp-analytics`.

Expected wizard outcome (path C — `PostHogMCP`):

- installs `@posthog/mcp` and `posthog-node`
- creates a `PostHogMCP` client at module scope from `POSTHOG_PROJECT_API_KEY` / `POSTHOG_HOST`
- calls `captureInitialize(...)` on the `initialize` branch
- wraps the `tools/call` branch with timing + `captureToolCall({ toolName, parameters, response, durationMs, isError })`
- flushes (`posthog.flush()`) appropriately for the server's lifecycle
