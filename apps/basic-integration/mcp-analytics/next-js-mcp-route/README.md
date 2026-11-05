# Next.js todo app with an MCP route

`app/api/[transport]/route.ts` serves MCP over Streamable HTTP with
`mcp-handler`, sharing `lib/data.ts` with the app. Default-flow fixture.

Expected outcome with `wizard-default-mcp-analytics` on:

- `mcp-analytics` instruments the route, reusing `init`'s server client
- `capture` waits for it and adds no event that only repeats `$mcp_tool_call`
