# PostHog MCP Analytics — Integration Report

## Instrumentation path

**Path C — custom HTTP dispatcher.** This server speaks the MCP JSON-RPC protocol directly via Hono with no `@modelcontextprotocol/sdk` server object to wrap. `PostHogMCP` (a `posthog-node` subclass from `@posthog/mcp`) is used instead of `instrument()`.

## Changes made

### Files modified

| File | Change |
|------|--------|
| `src/index.ts` | Added `PostHogMCP` client at module scope; added `captureInitialize` on `initialize` requests; added `captureToolCall` (success and error) on `tools/call` requests; added `SIGTERM` shutdown handler to flush events. |

### Files created

| File | Change |
|------|--------|
| `.env` | Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`. |

### Packages added

| Package | Version |
|---------|---------|
| `@posthog/mcp` | `^0.12.0` (pre-1.0 beta — pin this) |
| `posthog-node` | `^5.51.6` |

## What is captured

Once the server handles its next request you will see these events in PostHog:

- **`$mcp_initialize`** — fired on each MCP `initialize` handshake, carrying `$mcp_client_name`, `$mpc_client_version`, and `$mcp_protocol_version`.
- **`$mcp_tool_called`** — fired after every `tools/call` request, carrying `$mcp_tool_name`, `$mcp_parameters`, `$mcp_response`, `$mcp_duration_ms`, and `$mcp_is_error`.
- **`$exception`** — fired automatically alongside any failed tool call (via `enableExceptionAutocapture: true`).

## Manual steps

1. **The `.env` file is git-ignored** — ensure your deployment environment has `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` set as real environment variables.
2. **`@posthog/mcp` is pre-1.0** — minor releases may include breaking changes. Review the changelog before upgrading.
3. **No `distinctId` or `sessionId`** — this server has no auth layer, so events are sent anonymously. Add `distinctId` and `sessionId` to the `captureInitialize` and `captureToolCall` calls once you have a way to identify callers.

## References

- PostHog MCP analytics docs: https://posthog.com/docs/mcp-analytics
- Custom-dispatcher reference: https://posthog.com/docs/mcp-analytics/custom-servers
