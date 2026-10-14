> AI agents: this is one page from PostHog's docs. Full index of Markdown docs for LLMs: https://posthog.com/llms.txt

# Getting started with MCP Analytics

**MCP Analytics is in beta**

The TypeScript package `@posthog/mcp` is pre-1.0. The Python integration is in beta, and the Ruby integration is experimental. We're building them in public, so event shapes and options may still change. Pin a specific version.

## Add MCP Analytics to your server

MCP Analytics shows how agents use your server. Wrap your server once to capture:

-   🛠️ Every tool call (parameters, response, duration, errors)
-   🎯 Agent intent – the *why* behind each call, not just the *what*
-   🤖 The model from client metadata or the agent's self-report
-   🧭 Tool and resource discovery, plus resource reads without their bodies
-   🪪 The MCP client name and version
-   🧵 Sessions across calls when the client supplies correlation data
-   🚧 Capabilities the agent wished existed (opt-in)

Install the SDK for your server's language:

### TypeScript

```bash
npm install @posthog/mcp posthog-node
```

### Python

```bash
pip install posthog
```

### Go

```bash
go get github.com/posthog/posthog-go/posthogmcpsdk
```

### Ruby

```bash
bundle add posthog-ruby
```

Set `POSTHOG_PROJECT_TOKEN` in your environment. Wrap your existing server once, before it accepts requests, and send queued events when the process stops:

### TypeScript

```typescript
import { PostHog } from "posthog-node"
import { instrument } from "@posthog/mcp"

const posthog = new PostHog(process.env.POSTHOG_PROJECT_TOKEN, {
  host: "https://us.i.posthog.com", // or https://eu.i.posthog.com
})

instrument(server, posthog)

process.on("SIGTERM", async () => {
  await posthog.shutdown()
  process.exit(0)
})
```

### Python

```python
import os
from posthog import Posthog
from posthog.mcp import instrument

posthog = Posthog(
    os.environ["POSTHOG_PROJECT_TOKEN"],
    host="https://us.i.posthog.com",  # or https://eu.i.posthog.com
)

analytics = instrument(server, posthog)

# when the process stops:
await analytics.flush()
posthog.shutdown()
```

### Go

```go
client, err := posthog.NewWithConfig(os.Getenv("POSTHOG_PROJECT_TOKEN"), posthog.Config{
    Endpoint: "https://us.i.posthog.com", // or https://eu.i.posthog.com
})
if err != nil {
    log.Fatal(err)
}
defer client.Close()

posthogmcpsdk.Instrument(server, posthogmcp.New(client),
    posthogmcpsdk.WithServerInfo("my-mcp-server", "1.0.0"),
)
```

### Ruby

```ruby
require "posthog/mcp"

posthog = PostHog::Client.new(
  api_key: ENV.fetch("POSTHOG_PROJECT_TOKEN"),
  host: "https://us.i.posthog.com" # or https://eu.i.posthog.com
)

PostHog::MCP.instrument(server, posthog)

at_exit { posthog.shutdown }
```

Every SDK has the same defaults. Intent, model capture, conversation IDs, and exception events are on. Missing-capability reports are opt-in. The Ruby SDK is [experimental](/docs/mcp-analytics/installation/ruby.md).

For TypeScript and Python servers, the wizard does the setup for you:

`npx @posthog/wizard mcp-analytics`

[

Full installation guide

](/docs/mcp-analytics/installation.md)

## See your first events

Run your MCP server. Connect an agent, such as Claude Desktop, Cursor, Codex, or your own client. PostHog receives `$mcp_tool_call` and `$mcp_tools_list` events when the agent calls tools and requests their listing. Clients on `2025-11-25` also produce `$mcp_initialize`. The handshake-free `2026-07-28` revision has no initialize event. The Go SDK sends `$mcp_tool_call`, `$exception`, `$mcp_unknown_tool`, and `$mcp_input_required`. It sends neither `$mcp_tools_list` nor `$mcp_initialize`.

Open the [activity feed](https://app.posthog.com/activity/explore) in your project. Filter for `event = $mcp_tool_call`. Each row represents a tool invocation and includes `$mcp_tool_name`, `$mcp_parameters`, `$mcp_response`, `$mcp_duration_ms`, and `$mcp_is_error`.

![PostHog activity feed filtered to $mcp_tool_call events, with tool name, client, error state, and duration columns](https://res.cloudinary.com/dmukukwp6/image/upload/q_auto,f_auto/mcp_activity_feed_light_197cb57f3c.png)

[

See every event the SDK emits

](/docs/mcp-analytics/events.md)

## Ship safely

The SDK sanitizes each event and truncates it to fit ingestion limits. It removes media payloads and masks known credential patterns, sensitive keys, and credentials inside URLs.

To inspect, change, or drop events before they're sent, add a before-send hook. Return the event to send it, or nothing to drop it:

### TypeScript

```typescript
instrument(server, posthog, {
  beforeSend: (event) => {
    delete event.properties.$mcp_response // keep tool results out of PostHog
    return event
  },
})
```

### Python

```python
from posthog.mcp.types import MCPAnalyticsOptions

def before_send(event):
    event["properties"].pop("$mcp_response", None)  # keep tool results out of PostHog
    return event

instrument(server, posthog, MCPAnalyticsOptions(before_send=before_send))
```

### Go

```go
posthogmcpsdk.Instrument(server, posthogmcp.New(client),
    posthogmcpsdk.WithCaptureResponses(false), // keep tool results out of PostHog
)
```

### Ruby

```ruby
PostHog::MCP.instrument(
  server, posthog,
  before_send: lambda do |event|
    event["properties"].delete("$mcp_response") # keep tool results out of PostHog
    event
  end
)
```

In Go, `WithCaptureResponses(false)` still sends a failed call's error text as `$mcp_error_message` and in `$exception`. A full before-send hook is the `BeforeSend` field of your `posthog.Config`. See the [Go example](/docs/mcp-analytics/privacy.md#3-your-before-send-hook-optional).

[

Privacy & redaction

](/docs/mcp-analytics/privacy.md)

## Compare tool quality by model

[Model capture](/docs/mcp-analytics/events.md#model-capture) is on by default. Check `$mcp_tool_call` events for `$mcp_llm_model`. The source, `$mcp_llm_model_source`, is `"client_metadata"` or `"self_reported"`.

Use this unverified client input to compare quality, latency, and errors across models, not for billing or security decisions. Some clients report an exact model, others a model family. Missing, blank, and `unknown` values are omitted.

## Capture what the agent was trying to do

**Intent** is the user goal that led the agent to call a tool. The SDK adds a `context` argument to compatible tool schemas and captures it as `$mcp_intent`. It removes the argument before your handler runs.

You can change the prompt the agent sees, and supply a fallback for agents that skip the argument. The Go SDK has a fixed prompt and no fallback.

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

    How much of your traffic supplies explicit context, and how much uses the intent fallback?

-   ### Advertised tools that never get called

    Join `$mcp_tools_list` with `$mcp_tool_call` to find tools that agents never call. The Go SDK sends no `$mcp_tools_list`, so this query returns nothing for Go servers.

The tool quality tab shows error rates and latency percentiles for each tool. Select a tool to inspect its calls:

![MCP Analytics tool quality tab showing calls and errors, success rate, latency percentiles, and a per-tool table](https://res.cloudinary.com/dmukukwp6/image/upload/q_auto,f_auto/mcp_tool_quality_light_f91f27f6e1.png)

[

Copy-paste queries

](/docs/mcp-analytics/queries.md)

## Identify the user behind the agent

By default, each event uses an SDK-generated session ID. Add an identify callback to associate calls with users, person properties, and groups. Return the user from your own auth data, such as the OAuth subject:

### TypeScript

```typescript
import { instrument, getRequestHeaders } from "@posthog/mcp"

instrument(server, posthog, {
  identify: async (request, extra) => {
    const user = await resolveUser(getRequestHeaders(extra)?.["authorization"])
    return user ? { distinctId: user.id, properties: { plan: user.plan } } : null
  },
})
```

### Python

```python
from posthog.mcp import get_request_headers
from posthog.mcp.types import MCPAnalyticsOptions, UserIdentity

async def identify(request, extra):
    user = await resolve_user((get_request_headers(extra) or {}).get("authorization"))
    return UserIdentity(distinct_id=user.id, properties={"plan": user.plan}) if user else None

instrument(server, posthog, MCPAnalyticsOptions(identify=identify))
```

### Go

```go
posthogmcpsdk.Instrument(server, posthogmcp.New(client),
    posthogmcpsdk.WithIdentity(func(ctx context.Context, req *mcp.CallToolRequest) (posthogmcpsdk.Identity, error) {
        if req.Extra == nil || req.Extra.TokenInfo == nil {
            return posthogmcpsdk.Identity{}, nil
        }
        return posthogmcpsdk.Identity{DistinctID: req.Extra.TokenInfo.UserID}, nil
    }),
)
```

### Ruby

```ruby
PostHog::MCP.instrument(
  server, posthog,
  identify: ->(_request, extra) {
    user = resolve_user(extra["headers"]["authorization"])
    user && { distinct_id: user.id, properties: { plan: user.plan } }
  }
)
```

[

Identify users

](/docs/mcp-analytics/identifying-users.md)

## Find capability gaps

Turn on missing-capability reports to add the `get_more_tools` virtual tool. Agents call it to report requests your server cannot satisfy:

### TypeScript

```typescript
instrument(server, posthog, { reportMissing: true })
```

### Python

```python
instrument(server, posthog, MCPAnalyticsOptions(report_missing=True))
```

### Ruby

```ruby
PostHog::MCP.instrument(server, posthog, report_missing: true)
```

### Go

```go
posthogmcpsdk.Instrument(server, posthogmcp.New(client),
    posthogmcpsdk.WithMissingCapabilityTool("get_more_tools"),
)
```

Use these reports to prioritize capabilities:

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

[**Add MCP Analytics to your server** ***Required***](#quest-item-add-mcp-analytics-to-your-server)[**See your first events** ***Required***](#quest-item-see-your-first-events)[**Ship safely** ***Required***](#quest-item-ship-safely)[**Compare tool quality by model** ***Recommended***](#quest-item-compare-tool-quality-by-model)[**Capture what the agent was trying to do** ***Recommended***](#quest-item-capture-what-the-agent-was-trying-to-do)[**Build your first dashboard** ***Recommended***](#quest-item-build-your-first-dashboard)[**Identify the user behind the agent** ***Recommended***](#quest-item-identify-the-user-behind-the-agent)[**Find capability gaps** ***Recommended***](#quest-item-find-capability-gaps)

**Add MCP Analytics to your server**

***Required***

### Still have questions?

Ask PostHog AI

### Was this page useful?

HelpfulCould be better