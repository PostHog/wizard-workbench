# PostHog MCP Analytics Setup Report

## Changes made

- Installed the beta Go MCP analytics SDK, `github.com/posthog/posthog-go/posthogmcpsdk` v1.42.4, plus its `posthog-go` dependency.
- Created one PostHog client in `main`, reading `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Wrapped the official Go MCP SDK server with `posthogmcpsdk.Instrument` immediately after server construction.
- Added server name/version metadata and graceful client closing without changing the `add_note` tool behavior.
- Added the supplied PostHog credentials to the local `.env` file.
- Verified the integration with `go fmt main.go`, `go mod tidy`, `go build -o /dev/null ./...`, and `go vet ./...`.

## Files modified or created

- `main.go` — PostHog client initialization, MCP instrumentation, and shutdown handling.
- `go.mod` — direct PostHog SDK dependencies.
- `go.sum` — resolved dependency checksums.
- `.env` — local `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.
- `posthog-mcp-analytics-report.md` — this report.

## Manual steps

1. Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to the MCP client's server `env` configuration (or export them before launch). Go does not load `.env` automatically, and MCP clients may start the server from another working directory.
2. Call the `add_note` tool, then check PostHog for `$mcp_tool_call` events. See the [MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for the dashboard and event reference.
3. Keep Go 1.25+ available in CI and container builds. The existing Go directive was already `1.25.0`, and the install did not change it.
4. The project remains on `github.com/modelcontextprotocol/go-sdk` v1.6.1. Upgrade it to v1.8.0 or later if the server must support the `2026-07-28` MCP protocol revision; v1.6.1 remains supported for the current instrumentation path.

The Go MCP analytics SDK is currently beta and may include breaking changes in minor releases.
