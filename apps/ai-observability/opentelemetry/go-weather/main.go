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

type aiContextKey string

const (
	aiSessionIDKey  aiContextKey = "ai_session_id"
	aiDistinctIDKey aiContextKey = "ai_distinct_id"
)

// WithAIContext ensures every span in a conversation receives its session and user IDs.
func WithAIContext(ctx context.Context, sessionID, distinctID string) context.Context {
	ctx = context.WithValue(ctx, aiSessionIDKey, sessionID)
	return context.WithValue(ctx, aiDistinctIDKey, distinctID)
}

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

func setupTracing(ctx context.Context) (*sdktrace.TracerProvider, error) {
	projectToken := os.Getenv("POSTHOG_PROJECT_TOKEN")
	host := os.Getenv("POSTHOG_HOST")
	if projectToken == "" || host == "" {
		if os.Getenv("GO_ENV") == "production" {
			return nil, nil
		}

		missing := "POSTHOG_PROJECT_TOKEN"
		if host == "" {
			missing = "POSTHOG_HOST"
		}
		return nil, fmt.Errorf("%s variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once %s is configured", missing, missing)
	}

	processor, err := posthogotel.NewSpanProcessor(ctx, projectToken, posthogotel.WithHost(host))
	if err != nil {
		return nil, err
	}

	provider := sdktrace.NewTracerProvider(
		sdktrace.WithResource(sdkresource.NewWithAttributes("", attribute.String("service.name", "weather-assistant"))),
		sdktrace.WithSpanProcessor(AIContextSpanProcessor{}),
		sdktrace.WithSpanProcessor(processor),
	)
	otel.SetTracerProvider(provider)
	return provider, nil
}

func jsonString(value any) string {
	encoded, err := json.Marshal(value)
	if err != nil {
		return ""
	}
	return string(encoded)
}

// Ask answers one question, running the tool if the model asks for it.
func (c *Conversation) Ask(ctx context.Context, client openai.Client, question string) (string, error) {
	tracer := otel.Tracer("weather-assistant")
	ctx = WithAIContext(ctx, c.ThreadID, c.UserID)
	turnCtx, turnSpan := tracer.Start(ctx, "gen_ai.turn")
	defer turnSpan.End()

	c.messages = append(c.messages, openai.UserMessage(question))
	inputMessages := jsonString(c.messages)
	toolDefinitions := jsonString(tools)
	generationCtx, generationSpan := tracer.Start(turnCtx, "gen_ai.chat_completions")
	generationSpan.SetAttributes(
		attribute.String("gen_ai.operation.name", "chat"),
		attribute.String("gen_ai.provider.name", "openai"),
		attribute.String("gen_ai.request.model", model),
		attribute.String("gen_ai.input.messages", inputMessages),
		attribute.String("gen_ai.tools", toolDefinitions),
		attribute.String("server.address", "api.openai.com"),
	)
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
		attribute.String("gen_ai.output.messages", jsonString(response.Choices)),
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
	_, toolSpan := tracer.Start(turnCtx, "gen_ai.tool.get_weather")
	toolSpan.SetAttributes(
		attribute.String("gen_ai.operation.name", "execute_tool"),
		attribute.String("gen_ai.tool.name", "get_weather"),
		attribute.String("gen_ai.tool.call.arguments", call.Function.Arguments),
	)
	var args struct {
		Location string `json:"location"`
	}
	if err := json.Unmarshal([]byte(call.Function.Arguments), &args); err != nil {
		toolSpan.RecordError(err)
		toolSpan.SetStatus(codes.Error, err.Error())
		toolSpan.End()
		return "", err
	}
	result := getWeather(args.Location)
	toolSpan.SetAttributes(attribute.String("gen_ai.tool.call.result", result))
	toolSpan.End()

	c.messages = append(c.messages, message.ToParam())
	c.messages = append(c.messages, openai.ToolMessage(result, call.ID))

	inputMessages = jsonString(c.messages)
	followupCtx, followupSpan := tracer.Start(turnCtx, "gen_ai.chat_completions")
	followupSpan.SetAttributes(
		attribute.String("gen_ai.operation.name", "chat"),
		attribute.String("gen_ai.provider.name", "openai"),
		attribute.String("gen_ai.request.model", model),
		attribute.String("gen_ai.input.messages", inputMessages),
		attribute.String("gen_ai.tools", toolDefinitions),
		attribute.String("server.address", "api.openai.com"),
	)
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
		attribute.String("gen_ai.output.messages", jsonString(followup.Choices)),
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
	provider, err := setupTracing(ctx)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	if provider != nil {
		defer func() {
			if err := provider.Shutdown(context.Background()); err != nil {
				fmt.Fprintln(os.Stderr, err)
			}
		}()
	}

	client := openai.NewClient(option.WithAPIKey(os.Getenv("OPENAI_API_KEY")))

	thread := &Conversation{UserID: "user_123", ThreadID: "thread_abc"}
	for _, question := range []string{
		"What's the weather in San Francisco?",
		"How about Boston?",
	} {
		answer, err := thread.Ask(ctx, client, question)
		if err != nil {
			if provider != nil {
				if flushErr := provider.ForceFlush(ctx); flushErr != nil {
					fmt.Fprintln(os.Stderr, flushErr)
				}
			}
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		fmt.Println(answer)
	}
}
