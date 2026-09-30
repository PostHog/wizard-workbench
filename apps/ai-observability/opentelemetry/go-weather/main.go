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

type sessionKey struct{}

// WithAISession returns a context whose spans carry an AI Observability session ID.
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

func setupTracing(ctx context.Context) (*sdktrace.TracerProvider, error) {
	projectToken := os.Getenv("POSTHOG_API_KEY")
	host := os.Getenv("POSTHOG_HOST")
	if projectToken == "" {
		if os.Getenv("APP_ENV") != "production" {
			return nil, fmt.Errorf("POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured")
		}
		return nil, nil
	}
	if host == "" {
		if os.Getenv("APP_ENV") != "production" {
			return nil, fmt.Errorf("POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured")
		}
		return nil, nil
	}

	processor, err := posthogotel.NewSpanProcessor(ctx, projectToken, posthogotel.WithHost(host))
	if err != nil {
		return nil, err
	}

	resource := sdkresource.NewWithAttributes("", attribute.String("service.name", "go-weather"))
	provider := sdktrace.NewTracerProvider(
		sdktrace.WithResource(resource),
		sdktrace.WithSpanProcessor(SessionIDSpanProcessor{}),
		sdktrace.WithSpanProcessor(processor),
	)
	otel.SetTracerProvider(provider)
	return provider, nil
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

func jsonString(value any) string {
	encoded, err := json.Marshal(value)
	if err != nil {
		return ""
	}
	return string(encoded)
}

func (c *Conversation) aiAttributes() []attribute.KeyValue {
	return []attribute.KeyValue{
		attribute.String("$ai_session_id", c.ThreadID),
		attribute.String("posthog.distinct_id", c.UserID),
	}
}

func (c *Conversation) startGeneration(ctx context.Context) (context.Context, trace.Span) {
	generationCtx, generation := otel.Tracer("go-weather").Start(ctx, "gen_ai.chat.completions")
	generation.SetAttributes(c.aiAttributes()...)
	generation.SetAttributes(
		attribute.String("gen_ai.operation.name", "chat"),
		attribute.String("gen_ai.provider.name", "openai"),
		attribute.String("gen_ai.request.model", model),
		attribute.String("gen_ai.input.messages", jsonString(c.messages)),
		attribute.String("gen_ai.request.tools", jsonString(tools)),
		attribute.String("server.address", "api.openai.com"),
	)
	return generationCtx, generation
}

func recordGeneration(generation trace.Span, content string, usage openai.CompletionUsage) {
	generation.SetAttributes(
		attribute.String("gen_ai.output.messages", jsonString([]map[string]string{{"role": "assistant", "content": content}})),
		attribute.Int("gen_ai.usage.input_tokens", int(usage.PromptTokens)),
		attribute.Int("gen_ai.usage.output_tokens", int(usage.CompletionTokens)),
	)
	generation.End()
}

// Ask answers one question, running the tool if the model asks for it.
func (c *Conversation) Ask(ctx context.Context, client openai.Client, question string) (string, error) {
	ctx = WithAISession(ctx, c.ThreadID)
	turnCtx, turn := otel.Tracer("go-weather").Start(ctx, "gen_ai.turn")
	defer turn.End()
	turn.SetAttributes(c.aiAttributes()...)
	turn.SetAttributes(attribute.String("gen_ai.operation.name", "workflow"))

	c.messages = append(c.messages, openai.UserMessage(question))

	generationCtx, generation := c.startGeneration(turnCtx)
	response, err := client.Chat.Completions.New(generationCtx, openai.ChatCompletionNewParams{
		Model:             model,
		Messages:          c.messages,
		Tools:             tools,
		ParallelToolCalls: openai.Bool(false),
	})
	if err != nil {
		generation.RecordError(err)
		generation.SetStatus(codes.Error, err.Error())
		generation.End()
		turn.RecordError(err)
		turn.SetStatus(codes.Error, err.Error())
		return "", err
	}
	message := response.Choices[0].Message
	recordGeneration(generation, message.Content, response.Usage)

	if len(message.ToolCalls) == 0 {
		c.messages = append(c.messages, openai.AssistantMessage(message.Content))
		return message.Content, nil
	}

	call := message.ToolCalls[0]
	var args struct {
		Location string `json:"location"`
	}
	if err := json.Unmarshal([]byte(call.Function.Arguments), &args); err != nil {
		turn.RecordError(err)
		turn.SetStatus(codes.Error, err.Error())
		return "", err
	}

	toolCtx, tool := otel.Tracer("go-weather").Start(turnCtx, "gen_ai.tool.get_weather")
	tool.SetAttributes(c.aiAttributes()...)
	tool.SetAttributes(
		attribute.String("gen_ai.operation.name", "tool"),
		attribute.String("gen_ai.tool.name", "get_weather"),
		attribute.String("gen_ai.tool.call.arguments", call.Function.Arguments),
	)
	result := getWeather(args.Location)
	tool.SetAttributes(attribute.String("gen_ai.tool.result", result))
	tool.End()

	c.messages = append(c.messages, message.ToParam())
	c.messages = append(c.messages, openai.ToolMessage(result, call.ID))

	followupCtx, followupGeneration := c.startGeneration(toolCtx)
	followup, err := client.Chat.Completions.New(followupCtx, openai.ChatCompletionNewParams{
		Model:             model,
		Messages:          c.messages,
		Tools:             tools,
		ParallelToolCalls: openai.Bool(false),
	})
	if err != nil {
		followupGeneration.RecordError(err)
		followupGeneration.SetStatus(codes.Error, err.Error())
		followupGeneration.End()
		turn.RecordError(err)
		turn.SetStatus(codes.Error, err.Error())
		return "", err
	}
	answer := followup.Choices[0].Message.Content
	recordGeneration(followupGeneration, answer, followup.Usage)
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
		defer provider.Shutdown(ctx)
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
			if provider != nil {
				_ = provider.ForceFlush(ctx)
			}
			os.Exit(1)
		}
		fmt.Println(answer)
	}
}
