> AI agents: this is one page from PostHog's docs. Full index of Markdown docs for LLMs: https://posthog.com/llms.txt

# Getting started with MCP Analytics

**MCP Analytics is in beta**

`@posthog/mcp` is published as a pre-1.0 release on npm. We're building it in public, so the event shape, options, and tracing behavior may still change before `1.0`. Pin a specific version and don't depend on it for production reporting yet.

## Add MCP Analytics to your server

MCP Analytics shows how agents use your server. Add one wrapper call to capture:

-   🛠️ Every tool call (parameters, response, duration, errors)
-   🎯 Agent intent – the *why* behind each call, not just the *what*
-   🤖 The model from client metadata or the agent's self-report
-   🧭 Tool and resource discovery, plus resource reads without their bodies
-   🪪 The MCP client name and version
-   🧵 Sessions across calls when the client supplies correlation data
-   🚧 Capabilities the agent wished existed (with `reportMissing`)

Use an existing [supported MCP server](/docs/mcp-analytics/installation.md#requirements) and a PostHog [project token](/docs/getting-started/project-token.md). Install the analytics package for your language:

### TypeScript

```bash
npm install @posthog/mcp posthog-node
```

### Python

```bash
pip install posthog
```

Set `POSTHOG_PROJECT_TOKEN` in your environment. Call `instrument()` once with your existing `server`, before it accepts requests:

### TypeScript

```typescript
import { PostHog } from "posthog-node"
import { instrument } from "@posthog/mcp"

const posthog = new PostHog(process.env.POSTHOG_PROJECT_TOKEN, {
  host: "https://us.i.posthog.com",
})

const analytics = instrument(server, posthog)
```

### Python

```python
import os
from posthog import Posthog
from posthog.mcp import instrument

posthog = Posthog(
    os.environ["POSTHOG_PROJECT_TOKEN"],
    host="https://us.i.posthog.com",
)

analytics = instrument(server, posthog)
```

For an EU project, use `https://eu.i.posthog.com` as the host. Keep your existing tool registration and server startup code.

Intent, model capture, conversation IDs, and exception capture are on by default in both SDKs. Missing-capability reporting and agent feedback are opt-in.

Flush queued events before shutdown. Follow the [TypeScript](/docs/mcp-analytics/installation.md#graceful-shutdown) or [Python](/docs/mcp-analytics/installation.md#flushing-on-exit) instructions for your server.

Set up TypeScript with the wizard

The wizard installs the package and configures `instrument()`. It also supports [LLM coding agents](/blog/envoy-wizard-llm-agent.md), such as Cursor and Bolt:

`npx @posthog/wizard mcp-analytics`

[Learn more](/wizard.md)

[

Full installation guide

](/docs/mcp-analytics/installation.md)

## See your first events

Run your MCP server. Connect an agent, such as Claude Desktop, Cursor, Codex, or your own client. PostHog receives `$mcp_tool_call` and `$mcp_tools_list` events when the agent calls tools and requests their listing. Clients on `2025-11-25` also produce `$mcp_initialize`. The handshake-free `2026-07-28` revision has no initialize event.

Open the [activity feed](https://app.posthog.com/activity/explore) in your project. Filter for `event = $mcp_tool_call`. Each row represents a tool invocation and includes `$mcp_tool_name`, `$mcp_parameters`, `$mcp_response`, `$mcp_duration_ms`, and `$mcp_is_error`.

![PostHog activity feed filtered to $mcp_tool_call events, with tool name, client, error state, and duration columns](https://res.cloudinary.com/dmukukwp6/image/upload/q_auto,f_auto/mcp_activity_feed_light_197cb57f3c.png)

[

See every event the SDK emits

](/docs/mcp-analytics/events.md)

## Ship safely

The SDK sanitizes each event and truncates it to fit ingestion limits. It removes media payloads and masks known credential patterns, sensitive keys, and credentials inside URLs.

Add `beforeSend` to your existing `instrument()` call to inspect the final payload before the SDK sends it. Return the event to send it. Return `null` or `undefined` to discard it:

TypeScript

```typescript
instrument(server, posthog, {
  beforeSend: (event) => {
    if (event.event === "$exception") return null // drop exceptions
    return event
  },
})
```

[

Privacy & redaction

](/docs/mcp-analytics/privacy.md)

For Python, use the [equivalent `before_send` callback](/docs/mcp-analytics/privacy.md#python).

## Compare tool quality by model

[Model capture](/docs/mcp-analytics/installation.md#capture-the-calling-model) is on by default in both SDKs. Check `$mcp_tool_call` events for `$mcp_llm_model`. The source, `$mcp_llm_model_source`, is `"client_metadata"` or `"self_reported"`.

Use this unverified client input to compare quality, latency, and errors across models, not for billing or security decisions. Some clients report an exact model, others a model family. Missing, blank, and `unknown` values are omitted.

## Capture what the agent was trying to do

**Intent** is the user goal that led the agent to call a tool. The SDK adds a `context` argument to compatible tool schemas and captures it as `$mcp_intent`. It removes the argument before your handler runs when it can confirm it injected the field.

TypeScript

```typescript
instrument(server, posthog, {
  context: {
    description: "Describe the user's underlying goal in one sentence — not the tool you're calling.",
  },
})
```

For agents that ignore the schema hint (raw cURL clients, schema-blind crawlers), supply an `intentFallback`. The SDK calls it whenever no `context` argument was passed:

TypeScript

```typescript
instrument(server, posthog, {
  intentFallback: (request) => {
    const tool = request.params?.name
    return tool ? `Invoking ${tool}` : null
  },
})
```

[

Learn about intent capture

](/docs/mcp-analytics/intent.md)

## Build your first dashboard

MCP events work with PostHog insights, dashboards, alerts, and SQL. The [MCP Analytics view](/docs/mcp-analytics.md) provides built-in views during the beta. Start with these four queries:

-   ### Top tools per server

    Which tools do agents call most often?

-   ### Error rate per tool

    Which tools fail most often? Use `$exception` events to investigate errors.

-   ### Intent samples by source

    How much of your traffic supplies explicit context vs falls back to `intentFallback`?

-   ### Advertised tools that never get called

    Join `$mcp_tools_list` with `$mcp_tool_call` to find tools that agents never call.

The tool quality tab shows error rates and latency percentiles for each tool. Select a tool to inspect its calls:

![MCP Analytics tool quality tab showing calls and errors, success rate, latency percentiles, and a per-tool table](https://res.cloudinary.com/dmukukwp6/image/upload/q_auto,f_auto/mcp_tool_quality_light_f91f27f6e1.png)

[

Copy-paste queries

](/docs/mcp-analytics/queries.md)

## Identify the user behind the agent

By default, each event uses an SDK-generated session ID. Add an `identify` callback to associate calls with users, person properties, and groups:

TypeScript

```typescript
import { instrument, getRequestHeaders } from "@posthog/mcp"

instrument(server, posthog, {
  identify: async (request, extra) => {
    const token = getRequestHeaders(extra)?.["authorization"]
    const user = token ? await resolveUserFromToken(token) : null
    return user ? { distinctId: user.id, properties: { name: user.name } } : null
  },
})
```

The SDK emits `$identify` when it observes a new identity for a session. PostHog uses this event to associate earlier anonymous activity. See the [identity merge caveats](/docs/mcp-analytics/identifying-users.md#identity-merges) for stateless servers.

[

Identify users

](/docs/mcp-analytics/identifying-users.md)

## Find capability gaps with \`reportMissing\`

Enable `reportMissing: true` to register the `get_more_tools` virtual tool. Agents can call it to report requests your server cannot satisfy. Use these reports to prioritize capabilities:

TypeScript

```typescript
instrument(server, posthog, {
  reportMissing: true,
})
```

SQL

[Run in PostHog](https://us.posthog.com/sql?open_query=SELECT%0A++properties.%24mcp_intent+++++++AS+unmet_request%2C%0A++properties.%24mcp_client_name++AS+client%2C%0A++count%28%29++++++++++++++++++++++AS+times_asked%0AFROM+events%0AWHERE+event+%3D+'%24mcp_missing_capability'%0A++AND+timestamp+%3E+now%28%29+-+INTERVAL+30+DAY%0AGROUP+BY+unmet_request%2C+client%0AORDER+BY+times_asked+DESC)

```sql
SELECT
  properties.$mcp_intent       AS unmet_request,
  properties.$mcp_client_name  AS client,
  count()                      AS times_asked
FROM events
WHERE event = '$mcp_missing_capability'
  AND timestamp > now() - INTERVAL 30 DAY
GROUP BY unmet_request, client
ORDER BY times_asked DESC
```

[

Track missing capabilities

](/docs/mcp-analytics/missing-capability.md)

1/8

[**Add MCP Analytics to your server** ***Required***](#quest-item-add-mcp-analytics-to-your-server)[**See your first events** ***Required***](#quest-item-see-your-first-events)[**Ship safely** ***Required***](#quest-item-ship-safely)[**Compare tool quality by model** ***Recommended***](#quest-item-compare-tool-quality-by-model)[**Capture what the agent was trying to do** ***Recommended***](#quest-item-capture-what-the-agent-was-trying-to-do)[**Build your first dashboard** ***Recommended***](#quest-item-build-your-first-dashboard)[**Identify the user behind the agent** ***Recommended***](#quest-item-identify-the-user-behind-the-agent)[**Find capability gaps with \`reportMissing\`** ***Recommended***](#quest-item-find-capability-gaps-with-reportmissing)

**Add MCP Analytics to your server**

***Required***

### Still have questions?

Ask PostHog AI

### Was this page useful?

HelpfulCould be better