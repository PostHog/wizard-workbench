> AI agents: this is one page from PostHog's docs. Full index of Markdown docs for LLMs: https://posthog.com/llms.txt

# OpenTelemetry AI Observability installation

![](https://res.cloudinary.com/dmukukwp6/image/upload/texture_tan_9608fcca70)

![](https://res.cloudinary.com/dmukukwp6/image/upload/texture_tan_dark_a92b0e022d)

Let AI instrument your LLM calls for you

Skip the manual setup — run this in your project and the wizard installs the SDK and wires up AI Observability for you.

`npx @posthog/wizard ai-observability`

[Learn more](/wizard.md)

![PostHog Wizard hedgehog](https://res.cloudinary.com/dmukukwp6/image/upload/wizard_3f8bb7a240.png)

![](https://res.cloudinary.com/dmukukwp6/image/upload/wizard_3f8bb7a240.png)Let AI instrument your LLM calls for you

**Large traces have size limits**

The OTLP path caps each export at **4MB** and each resulting AI event at **8MB**. An export over 4MB is rejected with HTTP 413, while a span whose event exceeds 8MB is dropped from an otherwise successful export without an application error. See [capturing large AI events](/docs/ai-observability/large-events.md#sending-over-opentelemetry) for how to stay under both limits.

1.  1

    ## Install dependencies

    Required

    **Full working examples**

    The [Node.js](https://github.com/PostHog/posthog-js/tree/main/examples/example-ai-openai), [Python](https://github.com/PostHog/posthog-python/tree/master/examples/example-ai-openai), and [Go](https://github.com/PostHog/posthog-go/tree/main/otel/example) examples show a complete end-to-end OpenTelemetry setup. Swap the instrumentation for any other `gen_ai.*`\-emitting library to trace a different provider or framework.

    Install the OpenTelemetry SDK, PostHog's OpenTelemetry helper, and an OpenTelemetry instrumentation for the provider you want to trace. The examples below use the OpenAI instrumentation, but any library that emits `gen_ai.*` spans will work.

    ### Python

    ```bash
    pip install openai opentelemetry-sdk "posthog[otel]" opentelemetry-instrumentation-openai-v2
    ```

    ### Node

    ```bash
    npm install openai @posthog/ai @opentelemetry/sdk-node @opentelemetry/resources @opentelemetry/instrumentation-openai
    ```

    ### Go

    ```bash
    go get github.com/posthog/posthog-go/otel go.opentelemetry.io/otel go.opentelemetry.io/otel/sdk
    ```

2.  2

    ## Set up OpenTelemetry tracing

    Required

    Configure OpenTelemetry to export spans to PostHog via the `PostHogSpanProcessor` (`posthogotel.NewSpanProcessor` in Go). The processor only forwards AI-related spans — spans whose name or attribute keys start with `gen_ai.`, `llm.`, `ai.`, or `traceloop.` — and drops everything else. PostHog converts `gen_ai.*` spans into `$ai_generation` events automatically.

    ### Python

    ```python
    from opentelemetry import trace
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.resources import Resource, SERVICE_NAME
    from posthog.ai.otel import PostHogSpanProcessor
    from opentelemetry.instrumentation.openai_v2 import OpenAIInstrumentor
    
    resource = Resource(attributes={
        SERVICE_NAME: "my-app",
        "posthog.distinct_id": "user_123", # optional: identifies the user in PostHog
        "foo": "bar", # custom properties are passed through
    })
    
    provider = TracerProvider(resource=resource)
    provider.add_span_processor(
        PostHogSpanProcessor(
            api_key="<ph_project_token>",
            host="https://us.i.posthog.com",
        )
    )
    trace.set_tracer_provider(provider)
    
    OpenAIInstrumentor().instrument()
    ```

    ### Node

    ```typescript
    import { NodeSDK } from '@opentelemetry/sdk-node'
    import { resourceFromAttributes } from '@opentelemetry/resources'
    import { PostHogSpanProcessor } from '@posthog/ai/otel'
    import { OpenAIInstrumentation } from '@opentelemetry/instrumentation-openai'
    
    const sdk = new NodeSDK({
      resource: resourceFromAttributes({
        'service.name': 'my-app',
        'posthog.distinct_id': 'user_123', // optional: identifies the user in PostHog
        foo: 'bar', // custom properties are passed through
      }),
      spanProcessors: [
        new PostHogSpanProcessor({
          projectToken: '<ph_project_token>',
          host: 'https://us.i.posthog.com',
        }),
      ],
      instrumentations: [new OpenAIInstrumentation()],
    })
    sdk.start()
    ```

    ### Go

    ```go
    import (
        "context"
    
        posthogotel "github.com/posthog/posthog-go/otel"
        "go.opentelemetry.io/otel"
        "go.opentelemetry.io/otel/attribute"
        sdkresource "go.opentelemetry.io/otel/sdk/resource"
        sdktrace "go.opentelemetry.io/otel/sdk/trace"
    )
    
    func setupTracing(ctx context.Context) (*sdktrace.TracerProvider, error) {
        processor, err := posthogotel.NewSpanProcessor(ctx, "<ph_project_token>",
            posthogotel.WithHost("https://us.i.posthog.com"),
        )
        if err != nil {
            return nil, err
        }
    
        resource := sdkresource.NewWithAttributes("",
            attribute.String("service.name", "my-app"),
            attribute.String("posthog.distinct_id", "user_123"), // optional: identifies the user in PostHog
            attribute.String("foo", "bar"), // custom properties are passed through
        )
        provider := sdktrace.NewTracerProvider(
            sdktrace.WithResource(resource),
            sdktrace.WithSpanProcessor(processor),
        )
        otel.SetTracerProvider(provider)
        return provider, nil
    }
    ```

    In Go, if your app already has a `TracerProvider`, attach the processor to it with `provider.RegisterSpanProcessor(processor)` instead of creating a new provider. Call `provider.Shutdown` (or `provider.ForceFlush`) before exit so buffered spans are sent.

3.  3

    ## Make an LLM call

    Required

    With the processor and instrumentation wired up, any LLM call made through the instrumented SDK is captured. PostHog receives the emitted `gen_ai.*` span and converts it into an `$ai_generation` event.

    Go has no instrumentation libraries for provider SDKs yet: start a span around each call and set the `gen_ai.*` attributes yourself, as shown in the Go tab. Frameworks that already emit `gen_ai.*` spans, like [ADK Go](https://google.golang.org/adk), are captured automatically. ADK Go sends message content as log records rather than span attributes, so its generations arrive without prompts and responses.

    ### Python

    ```python
    import openai
    
    client = openai.OpenAI(api_key="<openai_api_key>")
    
    response = client.chat.completions.create(
        model="gpt-5-mini",
        messages=[
            {"role": "user", "content": "Tell me a fun fact about hedgehogs"}
        ],
    )
    
    print(response.choices[0].message.content)
    ```

    ### Node

    ```typescript
    import OpenAI from 'openai'
    
    const client = new OpenAI({ apiKey: '<openai_api_key>' })
    
    const response = await client.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [{ role: 'user', content: 'Tell me a fun fact about hedgehogs' }],
    })
    
    console.log(response.choices[0].message.content)
    ```

    ### Go

    ```go
    import (
        "go.opentelemetry.io/otel"
        "go.opentelemetry.io/otel/attribute"
        "go.opentelemetry.io/otel/codes"
    )
    
    tracer := otel.Tracer("my-app")
    _, span := tracer.Start(ctx, "chat gpt-5-mini")
    // Set the request attributes before the call so a failed call still
    // carries the gen_ai.* keys the PostHog span filter looks for
    span.SetAttributes(
        attribute.String("gen_ai.operation.name", "chat"),
        attribute.String("gen_ai.provider.name", "openai"),
        attribute.String("gen_ai.request.model", "gpt-5-mini"),
        // JSON-serialized chat messages
        attribute.String("gen_ai.input.messages", `[{"role":"user","content":"Tell me a fun fact about hedgehogs"}]`),
        attribute.String("server.address", "api.openai.com"),
    )
    
    resp, err := client.Chat.Completions.New(ctx, params) // your existing LLM call
    if err != nil {
        span.RecordError(err)
        // Status Error is what marks the event as a failed generation in PostHog
        span.SetStatus(codes.Error, err.Error())
        span.End()
        return err
    }
    
    span.SetAttributes(
        attribute.String("gen_ai.output.messages", `[{"role":"assistant","content":"Hedgehogs have around 5,000 spines."}]`),
        attribute.Int("gen_ai.usage.input_tokens", int(resp.Usage.PromptTokens)),
        attribute.Int("gen_ai.usage.output_tokens", int(resp.Usage.CompletionTokens)),
    )
    span.End()
    ```

    > **Note:** If you want to capture LLM events anonymously, omit the `posthog.distinct_id` resource attribute. See our docs on [anonymous vs identified events](/docs/data/anonymous-vs-identified-events.md) to learn more.

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

    ## How attributes map to event properties

    Recommended

    PostHog translates standard OpenTelemetry GenAI semantic convention attributes into the same `$ai_*` event properties our native SDK wrappers emit, so traces look the same in PostHog whether they arrive through OpenTelemetry or a native wrapper. The most common mappings:

    | OpenTelemetry attribute | PostHog event property |
    | --- | --- |
    | `gen_ai.response.model` (or `gen_ai.request.model`) | `$ai_model` |
    | `gen_ai.provider.name` (or `gen_ai.system`) | `$ai_provider` |
    | `gen_ai.input.messages` | `$ai_input` |
    | `gen_ai.output.messages` | `$ai_output_choices` |
    | `gen_ai.usage.input_tokens` (or `gen_ai.usage.prompt_tokens`) | `$ai_input_tokens` |
    | `gen_ai.usage.output_tokens` (or `gen_ai.usage.completion_tokens`) | `$ai_output_tokens` |
    | `server.address` | `$ai_base_url` |
    | `telemetry.sdk.name` / `telemetry.sdk.version` | `$ai_lib` / `$ai_lib_version` |
    | Span start/end timestamps | `$ai_latency` (computed in seconds) |
    | Span name | `$ai_span_name` |

    Additional behavior worth knowing:

    -   **Custom attributes pass through.** Any Resource or span attribute that isn't part of the known mapping is forwarded onto the event as-is, so you can add dimensions like `conversation_id` or `tenant_id` and filter on them in PostHog.
    -   **Trace and span IDs are preserved** as `$ai_trace_id`, `$ai_span_id`, and `$ai_parent_id`, so multi-step traces reconstruct correctly.
    -   **Events are classified by operation.** `gen_ai.operation.name=chat` becomes an `$ai_generation` event; `embeddings` becomes `$ai_embedding`. Spans without a recognized operation become `$ai_span` (or `$ai_trace` if they're the root of a trace).
    -   **Vercel AI SDK, Pydantic AI, and Traceloop/OpenLLMetry** emit their own namespaces (`ai.*`, `pydantic_ai.*`, `traceloop.*`) and PostHog normalizes those to the same `$ai_*` properties.
    -   **Noisy resource attributes are dropped.** OpenTelemetry auto-detected attributes under `host.*`, `process.*`, `os.*`, and `telemetry.*` (except `telemetry.sdk.name` / `telemetry.sdk.version`) don't pollute event properties.

5.  5

    ## Group traces into sessions

    Optional

    PostHog groups traces into a session when they share an `$ai_session_id`. Set it if your product has multi-turn conversations, so the Sessions tab can reconstruct them. Workloads that finish in a single trace, like batch jobs or one-shot generation, do not need it.

    The instrumentation creates the LLM span for you, so there is no call to pass the session ID to. Add a span processor that sets the `$ai_session_id` attribute as each span starts. PostHog forwards span attributes it does not recognize onto the event, so the value arrives as the `$ai_session_id` property.

    ### Python

    ```python
    import contextvars
    from collections.abc import Iterator
    from contextlib import contextmanager
    from typing import Optional
    
    from opentelemetry.context import Context
    from opentelemetry.sdk.trace import Span, SpanProcessor
    
    session_id_var: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar(
        "ai_session_id", default=None
    )
    
    
    class SessionIdSpanProcessor(SpanProcessor):
        def on_start(self, span: Span, parent_context: Optional[Context] = None) -> None:
            session_id = session_id_var.get()
            if session_id is not None:
                span.set_attribute("$ai_session_id", session_id)
    
    
    @contextmanager
    def ai_session(session_id: str) -> Iterator[None]:
        token = session_id_var.set(session_id)
        try:
            yield
        finally:
            session_id_var.reset(token)
    
    
    # Register it on the same provider as PostHogSpanProcessor
    provider.add_span_processor(SessionIdSpanProcessor())
    
    # Resetting on exit keeps the ID off the next request that reuses this thread
    with ai_session("conversation-abc"):
        reply = handle_turn(user_message)
    ```

    ### Node

    ```typescript
    import { AsyncLocalStorage } from 'node:async_hooks'
    import type { Span, SpanProcessor } from '@opentelemetry/sdk-trace-base'
    
    const sessionStore = new AsyncLocalStorage<string>()
    
    class SessionIdSpanProcessor implements SpanProcessor {
      onStart(span: Span): void {
        const sessionId = sessionStore.getStore()
        if (sessionId) {
          span.setAttribute('$ai_session_id', sessionId)
        }
      }
      onEnd(): void {}
      async shutdown(): Promise<void> {}
      async forceFlush(): Promise<void> {}
    }
    
    // Every span started inside the callback carries this session ID
    const reply = await sessionStore.run('conversation-abc', () => handleTurn(userMessage))
    ```

    ### Go

    ```go
    import (
        "context"
    
        "go.opentelemetry.io/otel/attribute"
        sdktrace "go.opentelemetry.io/otel/sdk/trace"
    )
    
    type sessionKey struct{}
    
    // WithAISession returns a context whose spans carry this session ID.
    func WithAISession(ctx context.Context, sessionID string) context.Context {
        return context.WithValue(ctx, sessionKey{}, sessionID)
    }
    
    type SessionIDSpanProcessor struct{}
    
    func (SessionIDSpanProcessor) OnStart(parent context.Context, span sdktrace.ReadWriteSpan) {
        if sessionID, ok := parent.Value(sessionKey{}).(string); ok {
            span.SetAttributes(attribute.String("$ai_session_id", sessionID))
        }
    }
    func (SessionIDSpanProcessor) OnEnd(sdktrace.ReadOnlySpan)      {}
    func (SessionIDSpanProcessor) Shutdown(context.Context) error   { return nil }
    func (SessionIDSpanProcessor) ForceFlush(context.Context) error { return nil }
    
    // Register it on the same provider as the PostHog processor:
    //   sdktrace.WithSpanProcessor(SessionIDSpanProcessor{})
    
    // Every span started from this context carries the session ID
    ctx = WithAISession(ctx, "conversation-abc")
    reply := handleTurn(ctx, userMessage)
    ```

    On Node, add `new SessionIdSpanProcessor()` to the `spanProcessors` array of the `NodeSDK` you configured earlier, next to `PostHogSpanProcessor`. Keep the rest of that setup as it is, including `instrumentations` and the `sdk.start()` call.

    If a process only ever handles one session, set `$ai_session_id` as a resource attribute next to `service.name` instead. Resource attributes apply to every span the process emits, so that only works when the process and the session are the same thing.

6.  6

    ## Other instrumentations, direct OTLP, and troubleshooting

    Optional

    **Alternative instrumentation libraries.** Any library that emits standard `gen_ai.*` spans (or `ai.*` / `traceloop.*` / `pydantic_ai.*`) works with the setup above. Swap `@opentelemetry/instrumentation-openai` / `opentelemetry-instrumentation-openai-v2` for one of these to broaden provider coverage:

    -   [OpenLIT](https://github.com/openlit/openlit) — single instrumentation that covers many providers, vector DBs, and frameworks.
    -   [OpenLLMetry](https://github.com/traceloop/openllmetry) (Traceloop) — broad provider and framework support in Python and JavaScript.
    -   [OpenInference](https://github.com/Arize-ai/openinference) (Arize) — provider- and framework-specific instrumentations for Python and JavaScript.
    -   [MLflow tracing](https://mlflow.org/docs/latest/llms/tracing/index.html) — if you already run MLflow.

    **Direct OTLP export.** If you run an OpenTelemetry Collector, or want to export from a language other than Python, Node.js, or Go, point any OTLP/HTTP exporter directly at PostHog's AI ingestion endpoint. PostHog accepts OTLP over HTTP in both `application/x-protobuf` and `application/json`, authenticated with a `Bearer` token. The endpoint is signal-specific (traces only), so use the `OTEL_EXPORTER_OTLP_TRACES_*` variants rather than the general `OTEL_EXPORTER_OTLP_*` ones (the SDK appends `/v1/traces` to the latter and would 404).

    ### Environment

    ```bash
    OTEL_EXPORTER_OTLP_TRACES_ENDPOINT="https://us.i.posthog.com/i/v0/ai/otel"
    OTEL_EXPORTER_OTLP_TRACES_HEADERS="Authorization=Bearer <ph_project_token>"
    ```

    ### Collector

    ```yaml
    receivers:
      otlp:
        protocols:
          http:
            endpoint: 0.0.0.0:4318
    
    processors:
      batch:
      memory_limiter:
        check_interval: 5s
        limit_mib: 1500
        spike_limit_mib: 512
    
    exporters:
      otlphttp/posthog:
        traces_endpoint: "https://us.i.posthog.com/i/v0/ai/otel"
        headers:
          Authorization: "Bearer <ph_project_token>"
    
    service:
      pipelines:
        traces:
          receivers: [otlp]
          processors: [memory_limiter, batch]
          exporters: [otlphttp/posthog]
    ```

    **Limits and troubleshooting.**

    -   **Only AI spans are ingested.** Spans whose name and attribute keys don't start with `gen_ai.`, `llm.`, `ai.`, or `traceloop.` are dropped server-side, so it's safe to send a mixed trace stream.
    -   **HTTP only, no gRPC.** The endpoint speaks OTLP over HTTP in either `application/x-protobuf` or `application/json`. If your collector or SDK is configured for gRPC, switch to HTTP.
    -   **Request body is capped at 4 MB.** Large or unbounded traces (for example, long chat histories with base64-encoded images) can exceed this. Use a collector with the `batch` processor to keep individual exports small.
    -   **Missing traces?** Make sure you're pointing at the traces-specific OTLP variable (`OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` / `traces_endpoint`) rather than the general one, and that your project token is set correctly in the `Authorization: Bearer` header.

7.  ## Verify traces and generations

    Recommended

    *Confirm LLM events are being sent to PostHog*

    Let's make sure LLM events are being captured and sent to PostHog. Under **AI Observability**, you should see rows of data appear in the **Traces** and **Generations** tabs.

    ![LLM generations in PostHog](https://res.cloudinary.com/dmukukwp6/image/upload/SCR_20250807_syne_ecd0801880.png)

    [Check for LLM events in PostHog](https://app.posthog.com/ai-observability/generations)

8.  7

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