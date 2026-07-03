# PostHog MCP Analytics — Instrumentation Report

## Instrumentation path

**Path C — custom HTTP dispatcher** (`PostHogMCP`). This server speaks the MCP JSON-RPC protocol over HTTP using [Hono](https://hono.dev/) with no `@modelcontextprotocol/sdk` server object to wrap. The `instrument()` helper is not applicable; instead the `PostHogMCP` client is used and `captureToolCall` / `captureInitialize` are called manually at each dispatch point.

## Changes made

### Files modified

| File | Change |
|------|--------|
| `src/index.ts` | Added `PostHogMCP` import; constructed client at module scope; added `captureInitialize` in the `initialize` handler; added `captureToolCall` (with timing and error flag) in the `tools/call` handler; wired `SIGTERM` shutdown flush |
| `package.json` | Added `@posthog/mcp@0.7.0` (pinned, pre-1.0) and `posthog-node@^5.39.4` to `dependencies` |

### Files created

| File | Purpose |
|------|---------|
| `.env` | Stores `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` — referenced by the server at runtime |

## What gets captured

Once the server handles its next request, you will see these events in PostHog:

- `$mcp_initialize` — every client handshake (with `clientName`, `clientVersion`, `sessionId`)
- `$mcp_tool_call` — every `tools/call` dispatch (with `toolName`, `parameters`, `response`, `durationMs`, `isError`)
- `$exception` — emitted alongside any failed tool call (when `isError: true`)

## Environment variables

The server reads two env vars at startup:

| Variable | Value set in `.env` |
|----------|---------------------|
| `POSTHOG_PROJECT_API_KEY` | `phx_API_KEY_IS_HARDCODED` |
| `POSTHOG_HOST` | `https://us.i.posthog.com` |

## Manual steps

1. **Load the `.env` file at startup.** The server uses `process.env.*` directly; if your run script does not already load `.env`, add a loader (e.g. `--env-file .env` on Node 20+, or install `dotenv` and call `dotenv/config` at the top of `src/index.ts`).
2. **Deploy / restart the server** — the `@posthog/mcp@0.7.0` package is now in `dependencies`, so `npm install` on any new environment will pull it automatically.
3. **View events in PostHog** at https://posthog.com/docs/mcp-analytics for the dashboard template and full event reference.

> **Note:** `@posthog/mcp` is pre-1.0 (currently `0.7.0`). The version is pinned in `package.json` to guard against breaking changes in minor `0.x` releases. Check the [changelog](https://github.com/PostHog/posthog-js/blob/main/CHANGELOG.md) before upgrading.
