# Next.js todo app with a separate MCP server

The web app sits at the root; `mcp-server/` is its own STDIO MCP server
package. Default-flow fixture.

Expected outcome with `wizard-default-mcp-analytics` on:

- `capture`, `error-tracking` and the rest target the Next.js app
- `mcp-analytics` instruments `mcp-server/` with its own client and env names
  without a `NEXT_PUBLIC_` prefix, in parallel with `capture`
