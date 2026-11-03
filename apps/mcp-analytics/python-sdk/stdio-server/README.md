# wb-python-stdio-server

A PostHog-less MCP server built on the official `mcp` package 2.x (`MCPServer`, STDIO transport). Test fixture for `wizard mcp-analytics`.

Expected wizard outcome (path P1, `instrument()`):

- runs `uv add posthog@latest` and resolves `posthog` 7.62.0 or later
- creates a `Posthog` client from `POSTHOG_PROJECT_TOKEN` / `POSTHOG_HOST`
- wraps the server: `instrument(server, posthog)`
- shuts the client down when the server exits
- does **not** print to stdout (STDIO transport)
