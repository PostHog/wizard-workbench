# wb-go-stdio-server

A PostHog-less MCP server built on the official `github.com/modelcontextprotocol/go-sdk` (STDIO transport). Test fixture for `wizard mcp-analytics`.

Expected wizard outcome:

- runs `go get github.com/posthog/posthog-go/posthogmcpsdk@latest` and resolves v1.34.0 or later
- creates the analytics client from `POSTHOG_PROJECT_TOKEN` / `POSTHOG_HOST`
- instruments the `mcp.NewServer` server before `server.Run`
- closes the client when the server exits
- verifies with `go build ./...` and `go vet ./...`
