> AI agents: this is one page from PostHog's docs. Full index of Markdown docs for LLMs: https://posthog.com/llms.txt

# Capturing agent intent

Intent explains why an agent called a tool. Use it to understand the goals behind tool usage.

The SDK captures intent as a single property – `$mcp_intent` – that can come from one of two sources:

1.  **A `context` argument** the agent passes on every tool call. Captured with `$mcp_intent_source = "context_parameter"`.
2.  **A fallback callback** you supply on `instrument()`. Captured with `$mcp_intent_source = "inferred"`.

Explicit context always wins. If the agent passes a non-empty `context`, the fallback is not invoked.

## The `context` argument

Intent capture is on by default. The SDK adds a `context` string to compatible tool schemas and removes it before your handler runs when it can confirm it injected the field. An application-owned `context` argument is preserved.

TypeScript advertises the injected field as required. Python makes it optional on raw low-level servers and standalone FastMCP. Calls can omit the injected field without failing validation.

What the agent sees in the schema:

JSON

```json
{
  "type": "object",
  "properties": {
    "context": {
      "type": "string",
      "description": "Why are you calling this tool? Briefly describe the user's goal."
    },
    "...": "your real tool arguments"
  },
  "required": ["context", "..."]
}
```

What your handler receives:

TypeScript

```typescript
server.tool("search_events", schema, async (args) => {
  // args.context has been stripped — only your real arguments are here
})
```

PostHog captures this value as `$mcp_intent`:

```
"Finding the last 10 pageviews for user alice@example.com to triage a drop in conversion"
```

### Customize the prompt

If you want to nudge the agent toward a specific style of context (use case, user goal, ticket id, etc.), pass an object:

TypeScript

```typescript
instrument(server, posthog, {
  context: {
    description: "Describe the user's underlying goal in one sentence — not the tool you're calling.",
  },
})
```

### Disabling the injected argument

Set `context: false` to disable the injected intent argument. Use `intentFallback` if you still want to capture intent. Model capture and conversation IDs have separate options. [Disable those options](/docs/mcp-analytics/installation.md#capture-the-calling-model) to stop their schema changes.

## The `intentFallback` callback

A client can omit the SDK-injected `context` argument. Without a fallback, the event has no `$mcp_intent`.

The SDK calls `intentFallback` when the agent provides no context. It captures a non-empty result as `$mcp_intent` with `$mcp_intent_source = "inferred"`.

The SDK does no inference of its own. It doesn't call an LLM. It doesn't inspect your tool arguments. It doesn't cache results. Whatever logic you want goes in your callback.

### Deterministic, per-tool

Use a synchronous callback when you can derive intent from the tool name and arguments:

TypeScript

```typescript
instrument(server, posthog, {
  intentFallback: (request) => {
    const tool = request.params?.name
    const args = request.params?.arguments ?? {}
    if (tool === "search_events") return `Searching events for "${args.query}"`
    return tool ? `Invoking ${tool}` : null
  },
})
```

### Using transport metadata

`extra` carries MCP transport details – useful when the agent's user-agent or auth context hints at intent:

TypeScript

```typescript
import { getRequestHeaders } from "@posthog/mcp"

intentFallback: (request, extra) => {
  const ua = getRequestHeaders(extra)?.["user-agent"]
  return `${ua ?? "unknown client"} invoked ${request.params?.name}`
}
```

`getRequestHeaders` reads headers on both MCP SDK majors – see [MCP SDK v2](/docs/mcp-analytics/sdk-v2.md#if-your-callbacks-read-headers-change-them).

### LLM-derived intent

An LLM call in `intentFallback` adds latency to each tool call that lacks context. Cache results where possible. Handle failures in the callback:

TypeScript

```typescript
intentFallback: async (request) => {
  try {
    return await summariseIntent(request.params)
  } catch {
    return null // the SDK swallows null gracefully
  }
}
```

## Filtering on intent source

`$mcp_intent_source` is set to `"context_parameter"` or `"inferred"` only when an intent was captured. If neither a `context` argument nor a fallback result was available, both `$mcp_intent` and `$mcp_intent_source` are absent on the event.

If you want to know what fraction of your traffic is contextualized:

SQL

[Run in PostHog](https://us.posthog.com/sql?open_query=SELECT%0A++properties.%24mcp_intent_source+AS+source%2C%0A++count%28%29+AS+calls%0AFROM+events%0AWHERE+event+%3D+'%24mcp_tool_call'%0A++AND+timestamp+%3E+now%28%29+-+INTERVAL+7+DAY%0AGROUP+BY+source%0AORDER+BY+calls+DESC)

```sql
SELECT
  properties.$mcp_intent_source AS source,
  count() AS calls
FROM events
WHERE event = '$mcp_tool_call'
  AND timestamp > now() - INTERVAL 7 DAY
GROUP BY source
ORDER BY calls DESC
```

A high share of `inferred` means most clients do not supply context. Review `context.description` or improve `intentFallback`.

## Gotchas

**\`get\_more\_tools\` reports its source as \`context\_parameter\`**

The virtual `get_more_tools` tool (enabled by `reportMissing: true`) always reports `$mcp_intent_source = "context_parameter"`, even though the SDK is what defined the schema. Defensible – the agent did type a string – but filter it out of source-attribution queries if the number matters.

**The schema \`required\` field isn't enforced**

Omitting the SDK-injected `context` argument doesn't fail validation. Your tool's own required arguments still apply. Use `intentFallback` to capture intent when the agent omits context.

**Skip \`intentFallback\` for tight internal servers**

You do not need a fallback if your internal client always supplies `context`. Add one if clients can omit this argument.

### Still have questions?

Ask PostHog AI

### Was this page useful?

HelpfulCould be better