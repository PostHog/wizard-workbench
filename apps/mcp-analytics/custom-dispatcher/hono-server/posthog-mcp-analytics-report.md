# PostHog MCP Analytics — Integration Report

## Summary

Instrumented a Hono-based custom MCP dispatcher with PostHog MCP analytics using **Path C** (custom dispatcher / `PostHogMCP`). The server speaks the MCP JSON-RPC protocol directly over HTTP without using `@modelcontextprotocol/sdk`, so `instrument()` is not applicable — `PostHogMCP` with `captureToolCall` / `captureInitialize` is the correct path.

## Changes Made

### Files Modified

- **`src/index.ts`** — Added `PostHogMCP` client at module scope; wired `captureInitialize` into the `initialize` handler and `captureToolCall` (success and error branches) into the `tools/call` handler; added a `SIGTERM` handler to call `posthog.shutdown()` for graceful drain on exit.

### Files Created

- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` set. This file is gitignored.

### Packages Installed

- `@posthog/mcp@0.9.0` — pre-1.0 beta; pin this version in `package.json` and update deliberately.
- `posthog-node` — peer dependency required by `@posthog/mcp`.

## What Gets Captured

Once the server handles requests, these events appear in your PostHog project:

| Event | When |
|---|---|
| `$mcp_initialize` | On every MCP `initialize` handshake |
| `$mcp_tool_called` | After each `tools/call` resolves (success or error) |
| `$exception` | Fan-out from failed tool calls (when `isError: true`) |

## Manual Steps

1. **Keep `.env` values current** — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are already written. If you deploy to a cloud provider, set these as environment variables in your hosting config rather than shipping the `.env` file.

2. **Pin `@posthog/mcp`** — the SDK is pre-1.0 and may ship breaking changes in minor releases. The installed version is `0.9.0`. Update it deliberately when new versions ship.

3. **Restart the server** — run `npm start` (or however you launch it) for analytics to take effect.

4. **View events** — see `$mcp_*` events and the MCP analytics dashboard at https://posthog.com/docs/mcp-analytics.
