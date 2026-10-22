// Weather assistant on the official OpenAI Go SDK. The model may call the
// registered get_weather tool before answering, so one question is either one
// model call or two with a tool execution between them.
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/option"
	"github.com/posthog/posthog-go"
	posthogotel "github.com/posthog/posthog-go/otel"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	sdkresource "go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/trace"
)

const model = "gpt-5-mini"

var tools = []openai.ChatCompletionToolUnionParam{
	openai.ChatCompletionFunctionTool(openai.FunctionDefinitionParam{
		Name:        "get_weather",
		Description: openai.String("Get the current weather for a given location."),
		Parameters: openai.FunctionParameters{
			"type": "object",
			"properties": map[string]any{
				"location": map[string]string{
					"type":        "string",
					"description": "City and state, e.g. San Francisco, CA",
				},
			},
			"required": []string{"location"},
		},
	}),
}

// Conversation is one chat thread. Every question asked below belongs to it.
type Conversation struct {
	UserID   string
	ThreadID string
	messages []openai.ChatCompletionMessageParamUnion
}

func (c *Conversation) tracingAttributes() []attribute.KeyValue {
	return []attribute.KeyValue{
		attribute.String("$ai_session_id", c.ThreadID),
		attribute.String("posthog.distinct_id", c.UserID),
	}
}

func (c *Conversation) startSpan(ctx context.Context, name string, attributes ...attribute.KeyValue) (context.Context, trace.Span) {
	return otel.Tracer("weather-assistant").Start(ctx, name,
		trace.WithAttributes(append(c.tracingAttributes(), attributes...)...),
	)
}

func (c *Conversation) startGeneration(ctx context.Context) (context.Context, trace.Span) {
	input, _ := json.Marshal(c.messages)
	return c.startSpan(ctx, "gen_ai.chat",
		attribute.String("gen_ai.operation.name", "chat"),
		attribute.String("gen_ai.provider.name", "openai"),
		attribute.String("gen_ai.request.model", model),
		attribute.String("gen_ai.input.messages", string(input)),
		attribute.String("server.address", "api.openai.com"),
	)
}

func recordGeneration(span trace.Span, output string, usage openai.CompletionUsage) {
	span.SetAttributes(
		attribute.String("gen_ai.output.messages", fmt.Sprintf(`[{"role":"assistant","content":%q}]`, output)),
		attribute.Int("gen_ai.usage.input_tokens", int(usage.PromptTokens)),
		attribute.Int("gen_ai.usage.output_tokens", int(usage.CompletionTokens)),
	)
	span.End()
}

// Ask answers one question, running the tool if the model asks for it.
func (c *Conversation) Ask(ctx context.Context, client openai.Client, question string) (string, error) {
	ctx = posthog.WithRequestContext(ctx, posthog.RequestContext{
		DistinctId: c.UserID,
		Properties: posthog.Properties{
			"$ai_session_id": c.ThreadID,
		},
	})
	ctx, turnSpan := c.startSpan(ctx, "gen_ai.turn", attribute.String("gen_ai.operation.name", "invoke"))
	defer turnSpan.End()

	c.messages = append(c.messages, openai.UserMessage(question))

	_, generationSpan := c.startGeneration(ctx)
	response, err := client.Chat.Completions.New(ctx, openai.ChatCompletionNewParams{
		Model:             model,
		Messages:          c.messages,
		Tools:             tools,
		ParallelToolCalls: openai.Bool(false),
	})
	if err != nil {
		generationSpan.RecordError(err)
		generationSpan.SetStatus(codes.Error, err.Error())
		generationSpan.End()
		return "", err
	}
	message := response.Choices[0].Message
	recordGeneration(generationSpan, message.Content, response.Usage)

	if len(message.ToolCalls) == 0 {
		c.messages = append(c.messages, openai.AssistantMessage(message.Content))
		return message.Content, nil
	}

	call := message.ToolCalls[0]
	var args struct {
		Location string `json:"location"`
	}
	if err := json.Unmarshal([]byte(call.Function.Arguments), &args); err != nil {
		return "", err
	}
	_, toolSpan := c.startSpan(ctx, "gen_ai.tool.get_weather",
		attribute.String("gen_ai.operation.name", "tool"),
		attribute.String("gen_ai.tool.name", "get_weather"),
		attribute.String("gen_ai.tool.call.arguments", call.Function.Arguments),
	)
	result := getWeather(args.Location)
	toolSpan.SetAttributes(attribute.String("gen_ai.tool.result", result))
	toolSpan.End()

	c.messages = append(c.messages, message.ToParam())
	c.messages = append(c.messages, openai.ToolMessage(result, call.ID))

	_, followupSpan := c.startGeneration(ctx)
	followup, err := client.Chat.Completions.New(ctx, openai.ChatCompletionNewParams{
		Model:             model,
		Messages:          c.messages,
		Tools:             tools,
		ParallelToolCalls: openai.Bool(false),
	})
	if err != nil {
		followupSpan.RecordError(err)
		followupSpan.SetStatus(codes.Error, err.Error())
		followupSpan.End()
		return "", err
	}
	answer := followup.Choices[0].Message.Content
	recordGeneration(followupSpan, answer, followup.Usage)
	c.messages = append(c.messages, openai.AssistantMessage(answer))
	return answer, nil
}

func setupTracing(ctx context.Context) (*sdktrace.TracerProvider, error) {
	projectToken := os.Getenv("POSTHOG_API_KEY")
	if projectToken == "" {
		return nil, fmt.Errorf("POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured")
	}
	host := os.Getenv("POSTHOG_HOST")
	if host == "" {
		return nil, fmt.Errorf("POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured")
	}

	processor, err := posthogotel.NewSpanProcessor(ctx, projectToken, posthogotel.WithHost(host))
	if err != nil {
		return nil, err
	}
	provider := sdktrace.NewTracerProvider(
		sdktrace.WithResource(sdkresource.NewWithAttributes("", attribute.String("service.name", "weather-assistant"))),
		sdktrace.WithSpanProcessor(processor),
	)
	otel.SetTracerProvider(provider)
	return provider, nil
}

func main() {
	ctx := context.Background()
	provider, err := setupTracing(ctx)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return
	}
	defer func() {
		if err := provider.Shutdown(ctx); err != nil {
			fmt.Fprintln(os.Stderr, err)
		}
	}()

	client := openai.NewClient(option.WithAPIKey(os.Getenv("OPENAI_API_KEY")))

	thread := &Conversation{UserID: "user_123", ThreadID: "thread_abc"}
	for _, question := range []string{
		"What's the weather in San Francisco?",
		"How about Boston?",
	} {
		answer, err := thread.Ask(ctx, client, question)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			return
		}
		fmt.Println(answer)
	}
}
