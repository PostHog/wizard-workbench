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
	sdkresource "go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/trace"
)

const model = "gpt-5-mini"

const (
	aiSessionIDKey  = "ai_session_id"
	aiDistinctIDKey = "ai_distinct_id"
)

type aiContextKey string

type aiContextSpanProcessor struct{}

func withAIConversation(ctx context.Context, sessionID, distinctID string) context.Context {
	ctx = context.WithValue(ctx, aiContextKey(aiSessionIDKey), sessionID)
	return context.WithValue(ctx, aiContextKey(aiDistinctIDKey), distinctID)
}

func (aiContextSpanProcessor) OnStart(parent context.Context, span sdktrace.ReadWriteSpan) {
	if sessionID, ok := parent.Value(aiContextKey(aiSessionIDKey)).(string); ok {
		span.SetAttributes(attribute.String("$ai_session_id", sessionID))
	}
	if distinctID, ok := parent.Value(aiContextKey(aiDistinctIDKey)).(string); ok {
		span.SetAttributes(attribute.String("posthog.distinct_id", distinctID))
	}
}

func (aiContextSpanProcessor) OnEnd(sdktrace.ReadOnlySpan)      {}
func (aiContextSpanProcessor) Shutdown(context.Context) error   { return nil }
func (aiContextSpanProcessor) ForceFlush(context.Context) error { return nil }

func setupTracing(ctx context.Context) (*sdktrace.TracerProvider, error) {
	projectToken := os.Getenv("POSTHOG_API_KEY")
	if projectToken == "" {
		if os.Getenv("APP_ENV") == "production" {
			return nil, nil
		}
		return nil, fmt.Errorf("POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured")
	}
	posthogHost := os.Getenv("POSTHOG_HOST")
	if posthogHost == "" {
		if os.Getenv("APP_ENV") == "production" {
			return nil, nil
		}
		return nil, fmt.Errorf("POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured")
	}

	processor, err := posthogotel.NewSpanProcessor(ctx, projectToken, posthogotel.WithHost(posthogHost))
	if err != nil {
		return nil, err
	}

	provider := sdktrace.NewTracerProvider(
		sdktrace.WithResource(sdkresource.NewWithAttributes("", attribute.String("service.name", "weather-assistant"))),
		sdktrace.WithSpanProcessor(aiContextSpanProcessor{}),
		sdktrace.WithSpanProcessor(processor),
	)
	otel.SetTracerProvider(provider)
	return provider, nil
}

func jsonAttribute(value any) string {
	encoded, err := json.Marshal(value)
	if err != nil {
		return "[]"
	}
	return string(encoded)
}

func startGenerationSpan(ctx context.Context, messages []openai.ChatCompletionMessageParamUnion) (context.Context, trace.Span) {
	ctx, span := otel.Tracer("weather-assistant").Start(ctx, "gen_ai.chat.completions")
	span.SetAttributes(
		attribute.String("gen_ai.operation.name", "chat"),
		attribute.String("gen_ai.provider.name", "openai"),
		attribute.String("gen_ai.request.model", model),
		attribute.String("gen_ai.input.messages", jsonAttribute(messages)),
		attribute.String("gen_ai.request.tools", jsonAttribute(tools)),
		attribute.String("server.address", "api.openai.com"),
	)
	return ctx, span
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
	ctx = withAIConversation(ctx, c.ThreadID, c.UserID)
	ctx, turnSpan := otel.Tracer("weather-assistant").Start(ctx, "gen_ai.chat.turn")
	defer turnSpan.End()

	c.messages = append(c.messages, openai.UserMessage(question))

	generationCtx, generationSpan := startGenerationSpan(ctx, c.messages)
	response, err := client.Chat.Completions.New(generationCtx, openai.ChatCompletionNewParams{
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
	generationSpan.SetAttributes(
		attribute.String("gen_ai.output.messages", jsonAttribute(response.Choices)),
		attribute.Int("gen_ai.usage.input_tokens", int(response.Usage.PromptTokens)),
		attribute.Int("gen_ai.usage.output_tokens", int(response.Usage.CompletionTokens)),
	)
	generationSpan.End()
	message := response.Choices[0].Message

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
	_, toolSpan := otel.Tracer("weather-assistant").Start(ctx, "gen_ai.tool.get_weather")
	toolSpan.SetAttributes(
		attribute.String("gen_ai.tool.name", "get_weather"),
		attribute.String("gen_ai.tool.call.arguments", call.Function.Arguments),
	)
	result := getWeather(args.Location)
	toolSpan.SetAttributes(attribute.String("gen_ai.tool.call.result", result))
	toolSpan.End()

	c.messages = append(c.messages, message.ToParam())
	c.messages = append(c.messages, openai.ToolMessage(result, call.ID))

	followupCtx, followupSpan := startGenerationSpan(ctx, c.messages)
	followup, err := client.Chat.Completions.New(followupCtx, openai.ChatCompletionNewParams{
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
	followupSpan.SetAttributes(
		attribute.String("gen_ai.output.messages", jsonAttribute(followup.Choices)),
		attribute.Int("gen_ai.usage.input_tokens", int(followup.Usage.PromptTokens)),
		attribute.Int("gen_ai.usage.output_tokens", int(followup.Usage.CompletionTokens)),
	)
	followupSpan.End()
	answer := followup.Choices[0].Message.Content
	c.messages = append(c.messages, openai.AssistantMessage(answer))
	return answer, nil
}

func main() {
	ctx := context.Background()
	tracerProvider, err := setupTracing(ctx)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	client := openai.NewClient(option.WithAPIKey(os.Getenv("OPENAI_API_KEY")))

	thread := &Conversation{UserID: "user_123", ThreadID: "thread_abc"}
	for _, question := range []string{
		"What's the weather in San Francisco?",
		"How about Boston?",
	} {
		answer, err := thread.Ask(ctx, client, question)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			if tracerProvider != nil {
				_ = tracerProvider.Shutdown(ctx)
			}
			os.Exit(1)
		}
		fmt.Println(answer)
	}
	if tracerProvider != nil {
		_ = tracerProvider.Shutdown(ctx)
	}
}
