# PostHog MCP Analytics — Instrumentation Report

## What was done

This MCP server (TypeScript, official `@modelcontextprotocol/sdk`, STDIO transport) was instrumented with PostHog MCP analytics using **Path A** — the official SDK server object wrapped with `instrument(server, posthog)`.

Every tool call (`echo`, `add`) and any future tools registered on the server will now emit `$mcp_tool_called` events (and related `$mcp_*` events) to PostHog automatically.

## Files modified or created

| File | Change |
|------|--------|
| `src/index.ts` | Added `PostHog` client + `instrument()` call + `SIGTERM` shutdown handler |
| `package.json` | Added `@posthog/mcp@0.5.1` and `posthog-node@5.38.8` to `dependencies` |
| `.env` | Created with `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` |
| `pnpm-lock.yaml` (monorepo root) | Updated by pnpm with new package resolutions |

## Key changes in `src/index.ts`

```ts
import { PostHog } from 'posthog-node'
import { instrument } from '@posthog/mcp'

const posthog = new PostHog(process.env.POSTHOG_PROJECT_API_KEY!, {
    host: process.env.POSTHOG_HOST,
})

const server = new McpServer({ name: 'workbench-stdio-server', version: '1.0.0' })
instrument(server, posthog)  // wraps server immediately after construction

// ...tools unchanged...

process.on('SIGTERM', async () => {
    await posthog.shutdown()  // drain batched events on graceful shutdown
    process.exit(0)
})
```

## Environment variables

Set in `.env`:

| Variable | Value |
|----------|-------|
| `POSTHOG_PROJECT_API_KEY` | `phx_API_KEY_IS_HARDCODED` |
| `POSTHOG_HOST` | `https://us.i.posthog.com` |

## Next steps

1. **Load `.env` at runtime** — the server reads credentials via `process.env.*`. Ensure `.env` is loaded before the server starts (e.g. via `dotenv`, your deployment platform's env injection, or by exporting vars in your shell before running `pnpm start`).
2. **Verify events** — run the server and call a tool; you should see `$mcp_tool_called` events appear in your PostHog project within seconds.
3. **Note: `@posthog/mcp` is pre-1.0** — the SDK may ship breaking changes in minor releases. Pin or review the version when upgrading.

See https://posthog.com/docs/mcp-analytics for the dashboard setup and full event/property reference.
