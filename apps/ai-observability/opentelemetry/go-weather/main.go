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
)

const model = "gpt-5-mini"

type aiContextKey struct{}

type aiContext struct {
	sessionID string
	distinctID string
}

// AIContextSpanProcessor copies conversation attribution onto every span in a turn.
type AIContextSpanProcessor struct{}

func (AIContextSpanProcessor) OnStart(parent context.Context, span sdktrace.ReadWriteSpan) {
	if values, ok := parent.Value(aiContextKey{}).(aiContext); ok {
		span.SetAttributes(
			attribute.String("$ai_session_id", values.sessionID),
			attribute.String("posthog.distinct_id", values.distinctID),
		)
	}
}

func (AIContextSpanProcessor) OnEnd(sdktrace.ReadOnlySpan)      {}
func (AIContextSpanProcessor) Shutdown(context.Context) error   { return nil }
func (AIContextSpanProcessor) ForceFlush(context.Context) error { return nil }

func withAIContext(ctx context.Context, sessionID, distinctID string) context.Context {
	return context.WithValue(ctx, aiContextKey{}, aiContext{
		sessionID: sessionID,
		distinctID: distinctID,
	})
}

func setupTracing(ctx context.Context) (*sdktrace.TracerProvider, error) {
	projectToken := os.Getenv("POSTHOG_API_KEY")
	host := os.Getenv("POSTHOG_HOST")
	if projectToken == "" || host == "" {
		if os.Getenv("APP_ENV") == "development" || os.Getenv("DEBUG") == "true" {
			missingVariable := "POSTHOG_API_KEY"
			if projectToken != "" {
				missingVariable = "POSTHOG_HOST"
			}
			return nil, fmt.Errorf("%s variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once %s is configured", missingVariable, missingVariable)
		}
		return nil, nil
	}

	processor, err := posthogotel.NewSpanProcessor(ctx, projectToken, posthogotel.WithHost(host))
	if err != nil {
		return nil, err
	}

	provider := sdktrace.NewTracerProvider(
		sdktrace.WithSpanProcessor(AIContextSpanProcessor{}),
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
	ctx = withAIContext(ctx, c.ThreadID, c.UserID)
	tracer := otel.Tracer("weather-assistant")
	ctx, turnSpan := tracer.Start(ctx, "gen_ai.turn")
	turnSpan.SetAttributes(attribute.String("gen_ai.operation.name", "workflow"))
	defer turnSpan.End()

	c.messages = append(c.messages, openai.UserMessage(question))
	input, _ := json.Marshal(c.messages)
	ctx, generationSpan := tracer.Start(ctx, "gen_ai.chat.completions")
	generationSpan.SetAttributes(
		attribute.String("gen_ai.operation.name", "chat"),
		attribute.String("gen_ai.provider.name", "openai"),
		attribute.String("gen_ai.request.model", model),
		attribute.String("gen_ai.input.messages", string(input)),
		attribute.String("server.address", "api.openai.com"),
	)
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
	output, _ := json.Marshal([]map[string]string{{"role": "assistant", "content": message.Content}})
	generationSpan.SetAttributes(
		attribute.String("gen_ai.output.messages", string(output)),
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
		return "", err
	}
	_, toolSpan := tracer.Start(ctx, "gen_ai.tool.get_weather")
	toolSpan.SetAttributes(
		attribute.String("gen_ai.operation.name", "execute_tool"),
		attribute.String("gen_ai.tool.name", "get_weather"),
	)
	result := getWeather(args.Location)
	toolSpan.End()

	c.messages = append(c.messages, message.ToParam())
	c.messages = append(c.messages, openai.ToolMessage(result, call.ID))

	input, _ = json.Marshal(c.messages)
	ctx, followupSpan := tracer.Start(ctx, "gen_ai.chat.completions")
	followupSpan.SetAttributes(
		attribute.String("gen_ai.operation.name", "chat"),
		attribute.String("gen_ai.provider.name", "openai"),
		attribute.String("gen_ai.request.model", model),
		attribute.String("gen_ai.input.messages", string(input)),
		attribute.String("server.address", "api.openai.com"),
	)
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
	output, _ = json.Marshal([]map[string]string{{"role": "assistant", "content": answer}})
	followupSpan.SetAttributes(
		attribute.String("gen_ai.output.messages", string(output)),
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
