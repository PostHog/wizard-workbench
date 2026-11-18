# PostHog MCP analytics setup report

## Changes made

- Detected an official Go MCP SDK server using STDIO and selected the `posthogmcpsdk.Instrument` wrapper path.
- Installed `github.com/posthog/posthog-go/posthogmcpsdk` v1.44.1 and `github.com/posthog/posthog-go` v1.44.1. The Go MCP analytics SDK is currently beta.
- Created one environment-backed PostHog client, wrapped the existing server immediately after construction, and retained the existing tool registration and behavior.
- Added `WithServerInfo` for `wb-go-stdio-server` version `0.1.0`; intent, model, parameter, response, and conversation capture remain at SDK defaults.
- Added client shutdown on normal exit and before the existing fatal server-exit path so queued events are flushed.
- Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to the local `.env` file. No token or host is hardcoded in source.
- Ran `go mod tidy`, `go fmt ./...`, `go build -o /dev/null ./...`, and `go vet ./...` successfully.
- The existing Go 1.25.0 directive and go-sdk v1.6.1 dependency were unchanged. Protocol revision `2026-07-28` requires go-sdk v1.8.0 or later if the server needs to support it in the future.

## Files modified or created

- `main.go` — initialized PostHog, wrapped the MCP server, and added flushing.
- `go.mod` — added direct PostHog SDK requirements.
- `go.sum` — recorded resolved dependency checksums.
- `.env` — created with the supplied PostHog project token and host.
- `posthog-mcp-analytics-report.md` — this report.

## Manual next steps

- Go does not load `.env` automatically. Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to the MCP server's `env` configuration (or export them in the process environment) when launching the server.
- Connect an MCP client and call `add_note`. The server will begin sending `$mcp_tool_call` events, with `$exception` for failed calls and Go-specific `$mcp_unknown_tool` events where applicable.
- Review events and the recommended dashboard using the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics).
