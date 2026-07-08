# PostHog MCP Analytics — Instrumentation Report

## Summary

This Hono server is a **custom HTTP dispatcher** (Path C): it speaks the MCP JSON-RPC protocol directly over HTTP with no `@modelcontextprotocol/sdk` server object to wrap. It was instrumented using `PostHogMCP` from `@posthog/mcp`, which is a drop-in `posthog-node` subclass with `captureToolCall` and `captureInitialize` added on top.

## Changes Made

### Files Modified

- **`src/index.ts`** — added PostHog MCP analytics instrumentation:
  - Imported `PostHogMCP` from `@posthog/mcp`
  - Created a module-scope `PostHogMCP` client reading credentials from env vars
  - Called `posthog.captureInitialize(...)` in the `initialize` handler (with `clientName`, `clientVersion`, and `sessionId` from the `Mcp-Session-Id` header)
  - Wrapped the `tools/call` handler with timing (`Date.now()`) and called `posthog.captureToolCall(...)` on both success and error paths
  - Added a `SIGTERM` handler that calls `posthog.shutdown()` for graceful drain

- **`package.json`** — added dependencies:
  - `@posthog/mcp@^0.8.0` (pinned to `0.8.0`, pre-1.0 beta)
  - `posthog-node@^5.40.0`

### Files Created

- **`.env`** — created with `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` (covered by `.gitignore`)

## What Gets Captured

Once the server handles its next request, you'll see these events in PostHog:

| Event | When |
|---|---|
| `$mcp_initialize` | On every client handshake |
| `$mcp_tool_call` | After each `tools/call` (success or error), with duration |
| `$exception` | When a tool throws or `isError: true` |

## Manual Steps

1. **Start the server** with `npm start` (or `tsx src/index.ts`). The `.env` file is loaded automatically by Node if you use a loader like `dotenv`, otherwise pass the env vars directly — see below.

2. **Load the `.env` file**: the server reads `process.env.POSTHOG_PROJECT_API_KEY` and `process.env.POSTHOG_HOST`. If you don't have automatic `.env` loading, add `dotenv/config` or start with:
   ```sh
   export $(cat .env | xargs) && npm start
   ```

3. **Check PostHog** for `$mcp_tool_call` and `$mcp_initialize` events once the server handles a request. See the full dashboard and event reference at https://posthog.com/docs/mcp-analytics.

4. **SDK is pre-1.0** (`@posthog/mcp@0.8.0`). Pin the version and watch for breaking changes in `0.x` minor releases until `v1`.
