# wb-mcp-stdio-server

A PostHog-less TypeScript MCP server (official `@modelcontextprotocol/sdk`,
STDIO). Default-flow fixture: the wizard's scan should find it and queue the
`mcp-analytics` task.

Expected outcome with `wizard-default-mcp-analytics` on:

- `@posthog/mcp` (exact) and `posthog-node` added; `instrument(server, posthog)`
- drains on stdin `end` and `SIGTERM`; no `console.*` on stdout
- a missing token warns on stderr and never stops the server
