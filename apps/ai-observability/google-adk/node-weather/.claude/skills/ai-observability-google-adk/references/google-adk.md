> AI agents: this is one page from PostHog's docs. Full index of Markdown docs for LLMs: https://posthog.com/llms.txt

# Google ADK observability installation

![](https://res.cloudinary.com/dmukukwp6/image/upload/texture_tan_9608fcca70)

![](https://res.cloudinary.com/dmukukwp6/image/upload/texture_tan_dark_a92b0e022d)

Let AI instrument your LLM calls for you

Skip the manual setup — run this in your project and the wizard installs the SDK and wires up AI Observability for you.

`npx @posthog/wizard ai-observability`

[Learn more](/wizard.md)

![PostHog Wizard hedgehog](https://res.cloudinary.com/dmukukwp6/image/upload/wizard_3f8bb7a240.png)

![](https://res.cloudinary.com/dmukukwp6/image/upload/wizard_3f8bb7a240.png)Let AI instrument your LLM calls for you

1.  1

    ## Install dependencies

    Required

    **Full working example**

    See the complete [Node.js example](https://github.com/PostHog/posthog-js/tree/main/examples/example-ai-adk) on GitHub.

    Install the PostHog SDK alongside the [Google Agent Development Kit for TypeScript](https://github.com/google/adk-js) (`@google/adk`). For the Python and Go ADKs, use the [OpenTelemetry integration](/docs/ai-observability/installation/opentelemetry.md) instead: they emit `gen_ai.*` spans that PostHog captures automatically. ADK Go sends message content as log records, so its generations arrive without prompts and responses.

    ```bash
    npm install @posthog/ai posthog-node @google/adk zod
    ```

2.  2

    ## Add the PostHog plugin

    Required

    Create a PostHog client and register `PostHogADKPlugin` on your ADK `Runner`. The plugin hooks the run, agent, tool, and model callbacks and captures the full hierarchy: an `$ai_trace` per invocation, `$ai_span` events for agent runs and tool calls, and one `$ai_generation` per model call. It **does not** proxy your calls.

    ```typescript
    import { FunctionTool, InMemorySessionService, LlmAgent, Runner } from '@google/adk'
    import { PostHogADKPlugin } from '@posthog/ai/adk'
    import { PostHog } from 'posthog-node'
    import { z } from 'zod'
    
    const posthog = new PostHog('<ph_project_token>', { host: 'https://us.i.posthog.com' })
    
    const getWeather = new FunctionTool({
      name: 'get_weather',
      description: 'Get the current weather for a city.',
      parameters: z.object({ city: z.string() }),
      execute: ({ city }) => `The weather in ${city} is sunny, 72F`,
    })
    
    const agent = new LlmAgent({
      name: 'assistant',
      model: 'gemini-3.6-flash',
      instruction: 'You are a helpful assistant.',
      tools: [getWeather],
    })
    
    const sessionService = new InMemorySessionService()
    const runner = new Runner({
      appName: 'my-app',
      agent,
      sessionService,
      plugins: [new PostHogADKPlugin({ client: posthog })],
    })
    ```

3.  3

    ## Run your agent

    Required

    Run your agent as normal. Each invocation becomes a trace, the ADK session ID becomes `$ai_session_id`, and the run's `userId` becomes the events' distinct ID. Pass `distinctId` to the plugin to attribute events to a different PostHog person.

    ```typescript
    await sessionService.createSession({
      appName: 'my-app',
      userId: 'user_123',
      sessionId: 'conversation-abc',
    })
    
    for await (const event of runner.runAsync({
      userId: 'user_123',
      sessionId: 'conversation-abc',
      newMessage: { role: 'user', parts: [{ text: "What's the weather in Paris?" }] },
    })) {
      for (const part of event.content?.parts ?? []) {
        if (part.text) {
          console.log(part.text)
        }
      }
    }
    ```

    The question above makes the agent call the tool, so this run captures:

    -   a trace for the invocation
    -   a span for the `assistant` agent run
    -   a span for the `get_weather` tool call
    -   a generation for each of the two model calls (the tool request, then the answer)

    Call `await posthog.shutdown()` before your process exits so batched events are flushed.

    You can expect captured `$ai_generation` events to have the following properties:

    | Property | Description |
    | --- | --- |
    | `$ai_model` | The specific model, like `gpt-5-mini` or `claude-4-sonnet` |
    | `$ai_latency` | The latency of the LLM call in seconds |
    | `$ai_time_to_first_token` | Time to first token in seconds (streaming only) |
    | `$ai_tools` | Tools and functions available to the LLM |
    | `$ai_input` | List of messages sent to the LLM |
    | `$ai_input_tokens` | The number of tokens in the input (often found in response.usage) |
    | `$ai_output_choices` | List of response choices from the LLM |
    | `$ai_output_tokens` | The number of tokens in the output (often found in `response.usage`) |
    | `$ai_total_cost_usd` | The total cost in USD (input + output) |
    | [\[...\]](/docs/ai-observability/generations.md#event-properties) | See [full list](/docs/ai-observability/generations.md#event-properties) of properties |

4.  4

    ## Plugin options

    Optional

    `PostHogADKPlugin` accepts these options besides `client`:

    -   `distinctId`: a string, or a resolver `(context) => string` called per model call. Defaults to the ADK `userId`.
    -   `provider`: the `$ai_provider` label. Defaults to `gemini`. Set it when routing ADK to another provider so costs are derived from the right model catalog.
    -   `privacyMode`: redacts captured input and output content.
    -   `groups`: [group analytics](/docs/product-analytics/group-analytics.md) attached to every event.
    -   `properties`: extra properties merged into every event.
    -   `captureImmediate`: awaits delivery per event instead of batching. Useful in serverless environments.
    -   `onError`: called when capturing an event fails. Capture errors never throw into the model flow.

5.  ## Verify traces and generations

    Recommended

    *Confirm LLM events are being sent to PostHog*

    Let's make sure LLM events are being captured and sent to PostHog. Under **AI Observability**, you should see rows of data appear in the **Traces** and **Generations** tabs.

    ![LLM generations in PostHog](https://res.cloudinary.com/dmukukwp6/image/upload/SCR_20250807_syne_ecd0801880.png)

    [Check for LLM events in PostHog](https://app.posthog.com/ai-observability/generations)

6.  5

    ## Next steps

    Recommended

    Now that you're capturing AI conversations, continue with the resources below to learn what else AI Observability enables within the PostHog platform.

    | Resource | Description |
    | --- | --- |
    | [Basics](/docs/ai-observability/basics.md) | Learn the basics of how LLM calls become events in PostHog. |
    | [Generations](/docs/ai-observability/generations.md) | Read about the `$ai_generation` event and its properties. |
    | [Traces](/docs/ai-observability/traces.md) | Explore the trace hierarchy and how to use it to debug LLM calls. |
    | [Spans](/docs/ai-observability/spans.md) | Review spans and their role in representing individual operations. |
    | [Anaylze LLM performance](/docs/ai-observability/dashboard.md) | Learn how to create dashboards to analyze LLM performance. |

### Still have questions?

Ask PostHog AI

### Was this page useful?

HelpfulCould be better