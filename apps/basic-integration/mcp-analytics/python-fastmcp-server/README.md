# notes-server

A PostHog-less Python MCP server on `mcp.server.fastmcp` (STDIO). Default-flow
fixture: the wizard's scan should find it and queue the `mcp-analytics` task.

Expected outcome with `wizard-default-mcp-analytics` on:

- `posthog>=7.62.0` declared, `instrument()` wraps `mcp`
- a missing token warns on stderr and never stops the server
- nothing printed to stdout
