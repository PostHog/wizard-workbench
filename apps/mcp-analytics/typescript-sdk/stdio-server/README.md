# wb-mcp-stdio-server

A PostHog-less MCP server built on the official `@modelcontextprotocol/sdk`
(`McpServer`, STDIO transport). Test fixture for `wizard mcp-analytics`.

Expected wizard outcome (path A — `instrument()`):

- installs `@posthog/mcp` and `posthog-node`
- creates a `PostHog` client at module scope from `POSTHOG_PROJECT_API_KEY` / `POSTHOG_HOST`
- wraps the server: `const analytics = instrument(server, posthog)`
- adds `posthog.shutdown()` on `SIGTERM`
- does **not** add any `console.*` logging (STDIO transport)
