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
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/trace"
)

const model = "gpt-5-mini"

type aiContextKey string

const (
	aiSessionIDKey  aiContextKey = "ai_session_id"
	aiDistinctIDKey aiContextKey = "ai_distinct_id"
)

// aiContextSpanProcessor forwards conversation and user attribution to every
// span started during a turn.
type aiContextSpanProcessor struct{}

func (aiContextSpanProcessor) OnStart(parent context.Context, span sdktrace.ReadWriteSpan) {
	if sessionID, ok := parent.Value(aiSessionIDKey).(string); ok {
		span.SetAttributes(attribute.String("$ai_session_id", sessionID))
	}
	if distinctID, ok := parent.Value(aiDistinctIDKey).(string); ok {
		span.SetAttributes(attribute.String("posthog.distinct_id", distinctID))
	}
}

func (aiContextSpanProcessor) OnEnd(sdktrace.ReadOnlySpan)      {}
func (aiContextSpanProcessor) Shutdown(context.Context) error   { return nil }
func (aiContextSpanProcessor) ForceFlush(context.Context) error { return nil }

func setupTracing(ctx context.Context) (*sdktrace.TracerProvider, error) {
	processor, err := posthogotel.NewSpanProcessor(ctx, os.Getenv("POSTHOG_API_KEY"),
		posthogotel.WithHost(os.Getenv("POSTHOG_HOST")),
	)
	if err != nil {
		return nil, err
	}

	provider := sdktrace.NewTracerProvider(
		sdktrace.WithSpanProcessor(aiContextSpanProcessor{}),
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

// Ask answers one question, running the tool if the model asks for it.
func (c *Conversation) Ask(ctx context.Context, client openai.Client, question string) (string, error) {
	ctx = context.WithValue(ctx, aiSessionIDKey, c.ThreadID)
	ctx = context.WithValue(ctx, aiDistinctIDKey, c.UserID)
	tracer := otel.Tracer("weather-assistant")
	ctx, turnSpan := tracer.Start(ctx, "gen_ai.turn", trace.WithAttributes(
		attribute.String("gen_ai.operation.name", "chat"),
	))
	defer turnSpan.End()

	c.messages = append(c.messages, openai.UserMessage(question))
	messagesPayload, _ := json.Marshal(c.messages)
	toolsPayload, _ := json.Marshal(tools)
	completionCtx, completionSpan := tracer.Start(ctx, "gen_ai.chat_completion", trace.WithAttributes(
		attribute.String("gen_ai.operation.name", "chat"),
		attribute.String("gen_ai.provider.name", "openai"),
		attribute.String("gen_ai.request.model", model),
		attribute.String("gen_ai.input.messages", string(messagesPayload)),
		attribute.String("gen_ai.tools", string(toolsPayload)),
		attribute.String("server.address", "api.openai.com"),
	))
	response, err := client.Chat.Completions.New(completionCtx, openai.ChatCompletionNewParams{
		Model:             model,
		Messages:          c.messages,
		Tools:             tools,
		ParallelToolCalls: openai.Bool(false),
	})
	if err != nil {
		completionSpan.RecordError(err)
		completionSpan.SetStatus(codes.Error, err.Error())
		completionSpan.End()
		turnSpan.RecordError(err)
		turnSpan.SetStatus(codes.Error, err.Error())
		return "", err
	}
	responsePayload, _ := json.Marshal([]any{response.Choices[0].Message})
	completionSpan.SetAttributes(
		attribute.String("gen_ai.output.messages", string(responsePayload)),
		attribute.Int("gen_ai.usage.input_tokens", int(response.Usage.PromptTokens)),
		attribute.Int("gen_ai.usage.output_tokens", int(response.Usage.CompletionTokens)),
	)
	completionSpan.End()
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
		turnSpan.RecordError(err)
		turnSpan.SetStatus(codes.Error, err.Error())
		return "", err
	}
	_, toolSpan := tracer.Start(ctx, "gen_ai.tool.get_weather", trace.WithAttributes(
		attribute.String("gen_ai.operation.name", "execute_tool"),
		attribute.String("gen_ai.tool.name", "get_weather"),
		attribute.String("gen_ai.tool.call.id", call.ID),
		attribute.String("gen_ai.input", call.Function.Arguments),
	))
	result := getWeather(args.Location)
	toolSpan.SetAttributes(attribute.String("gen_ai.output", result))
	toolSpan.End()

	c.messages = append(c.messages, message.ToParam())
	c.messages = append(c.messages, openai.ToolMessage(result, call.ID))

	messagesPayload, _ = json.Marshal(c.messages)
	followupCtx, followupSpan := tracer.Start(ctx, "gen_ai.chat_completion", trace.WithAttributes(
		attribute.String("gen_ai.operation.name", "chat"),
		attribute.String("gen_ai.provider.name", "openai"),
		attribute.String("gen_ai.request.model", model),
		attribute.String("gen_ai.input.messages", string(messagesPayload)),
		attribute.String("gen_ai.tools", string(toolsPayload)),
		attribute.String("server.address", "api.openai.com"),
	))
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
		turnSpan.RecordError(err)
		turnSpan.SetStatus(codes.Error, err.Error())
		return "", err
	}
	followupPayload, _ := json.Marshal([]any{followup.Choices[0].Message})
	followupSpan.SetAttributes(
		attribute.String("gen_ai.output.messages", string(followupPayload)),
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
	defer provider.Shutdown(context.Background())

	client := openai.NewClient(option.WithAPIKey(os.Getenv("OPENAI_API_KEY")))

	thread := &Conversation{UserID: "user_123", ThreadID: "thread_abc"}
	for _, question := range []string{
		"What's the weather in San Francisco?",
		"How about Boston?",
	} {
		answer, err := thread.Ask(ctx, client, question)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			_ = provider.Shutdown(context.Background())
			os.Exit(1)
		}
		fmt.Println(answer)
	}
}
