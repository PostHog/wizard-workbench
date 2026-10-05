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
	posthogotel "github.com/posthog/posthog-go/otel"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/trace"
	sdkresource "go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
)

const model = "gpt-5-mini"

type aiContextKey string

const (
	aiSessionIDKey aiContextKey = "ai_session_id"
	aiDistinctIDKey aiContextKey = "ai_distinct_id"
)

// AIContextSpanProcessor attaches conversation and user context to every AI span.
type AIContextSpanProcessor struct{}

func (AIContextSpanProcessor) OnStart(parent context.Context, span sdktrace.ReadWriteSpan) {
	if sessionID, ok := parent.Value(aiSessionIDKey).(string); ok {
		span.SetAttributes(attribute.String("$ai_session_id", sessionID))
	}
	if distinctID, ok := parent.Value(aiDistinctIDKey).(string); ok {
		span.SetAttributes(attribute.String("posthog.distinct_id", distinctID))
	}
}

func (AIContextSpanProcessor) OnEnd(sdktrace.ReadOnlySpan)      {}
func (AIContextSpanProcessor) Shutdown(context.Context) error   { return nil }
func (AIContextSpanProcessor) ForceFlush(context.Context) error { return nil }

func withAIContext(ctx context.Context, sessionID, distinctID string) context.Context {
	ctx = context.WithValue(ctx, aiSessionIDKey, sessionID)
	return context.WithValue(ctx, aiDistinctIDKey, distinctID)
}

func setupTracing(ctx context.Context) (*sdktrace.TracerProvider, error) {
	processor, err := posthogotel.NewSpanProcessor(
		ctx,
		os.Getenv("POSTHOG_API_KEY"),
		posthogotel.WithHost(os.Getenv("POSTHOG_HOST")),
	)
	if err != nil {
		return nil, err
	}

	provider := sdktrace.NewTracerProvider(
		sdktrace.WithResource(sdkresource.NewWithAttributes(
			"",
			attribute.String("service.name", "weather-assistant"),
		)),
		sdktrace.WithSpanProcessor(AIContextSpanProcessor{}),
		sdktrace.WithSpanProcessor(processor),
	)
	otel.SetTracerProvider(provider)
	return provider, nil
}

func recordSpanError(span trace.Span, err error) {
	span.RecordError(err)
	span.SetStatus(codes.Error, err.Error())
}

func marshalAIValue(value any) string {
	encoded, err := json.Marshal(value)
	if err != nil {
		return ""
	}
	return string(encoded)
}

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

// Ask answers one question, running the tool if the model asks for it.
func (c *Conversation) Ask(ctx context.Context, client openai.Client, question string) (string, error) {
	tracer := otel.Tracer("weather-assistant")
	ctx, turnSpan := tracer.Start(ctx, "gen_ai.turn")
	defer turnSpan.End()

	c.messages = append(c.messages, openai.UserMessage(question))
	_, generationSpan := tracer.Start(ctx, "gen_ai.chat.completion")
	generationSpan.SetAttributes(
		attribute.String("gen_ai.operation.name", "chat"),
		attribute.String("gen_ai.provider.name", "openai"),
		attribute.String("gen_ai.request.model", model),
		attribute.String("gen_ai.input.messages", marshalAIValue(c.messages)),
		attribute.String("server.address", "api.openai.com"),
	)
	response, err := client.Chat.Completions.New(ctx, openai.ChatCompletionNewParams{
		Model:             model,
		Messages:          c.messages,
		Tools:             tools,
		ParallelToolCalls: openai.Bool(false),
	})
	if err != nil {
		recordSpanError(generationSpan, err)
		generationSpan.End()
		recordSpanError(turnSpan, err)
		return "", err
	}
	message := response.Choices[0].Message
	generationSpan.SetAttributes(
		attribute.String("gen_ai.response.model", model),
		attribute.String("gen_ai.output.messages", marshalAIValue(message)),
		attribute.Int("gen_ai.usage.input_tokens", int(response.Usage.PromptTokens)),
		attribute.Int("gen_ai.usage.output_tokens", int(response.Usage.CompletionTokens)),
	)
	generationSpan.End()

	if len(message.ToolCalls) == 0 {
		c.messages = append(c.messages, openai.AssistantMessage(message.Content))
		return message.Content, nil
	}

	call := message.ToolCalls[0]
	var args struct {
		Location string `json:"location"`
	}
	if err := json.Unmarshal([]byte(call.Function.Arguments), &args); err != nil {
		recordSpanError(turnSpan, err)
		return "", err
	}
	_, toolSpan := tracer.Start(ctx, "gen_ai.tool.get_weather")
	toolSpan.SetAttributes(
		attribute.String("gen_ai.operation.name", "tool"),
		attribute.String("gen_ai.tool.name", "get_weather"),
		attribute.String("gen_ai.tool.arguments", call.Function.Arguments),
	)
	result := getWeather(args.Location)
	toolSpan.SetAttributes(attribute.String("gen_ai.tool.output", result))
	toolSpan.End()

	c.messages = append(c.messages, message.ToParam())
	c.messages = append(c.messages, openai.ToolMessage(result, call.ID))

	_, followupSpan := tracer.Start(ctx, "gen_ai.chat.completion")
	followupSpan.SetAttributes(
		attribute.String("gen_ai.operation.name", "chat"),
		attribute.String("gen_ai.provider.name", "openai"),
		attribute.String("gen_ai.request.model", model),
		attribute.String("gen_ai.input.messages", marshalAIValue(c.messages)),
		attribute.String("server.address", "api.openai.com"),
	)
	followup, err := client.Chat.Completions.New(ctx, openai.ChatCompletionNewParams{
		Model:             model,
		Messages:          c.messages,
		Tools:             tools,
		ParallelToolCalls: openai.Bool(false),
	})
	if err != nil {
		recordSpanError(followupSpan, err)
		followupSpan.End()
		recordSpanError(turnSpan, err)
		return "", err
	}
	answer := followup.Choices[0].Message.Content
	followupSpan.SetAttributes(
		attribute.String("gen_ai.response.model", model),
		attribute.String("gen_ai.output.messages", marshalAIValue(followup.Choices[0].Message)),
		attribute.Int("gen_ai.usage.input_tokens", int(followup.Usage.PromptTokens)),
		attribute.Int("gen_ai.usage.output_tokens", int(followup.Usage.CompletionTokens)),
	)
	followupSpan.End()
	c.messages = append(c.messages, openai.AssistantMessage(answer))
	return answer, nil
}

func main() {
	ctx := context.Background()
	provider, err := setupTracing(ctx)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	defer provider.Shutdown(ctx)

	client := openai.NewClient(option.WithAPIKey(os.Getenv("OPENAI_API_KEY")))

	thread := &Conversation{UserID: "user_123", ThreadID: "thread_abc"}
	ctx = withAIContext(ctx, thread.ThreadID, thread.UserID)
	for _, question := range []string{
		"What's the weather in San Francisco?",
		"How about Boston?",
	} {
		answer, err := thread.Ask(ctx, client, question)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		fmt.Println(answer)
	}
}
