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

func setupTracing(ctx context.Context) (*sdktrace.TracerProvider, error) {
	apiKey := os.Getenv("POSTHOG_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured")
	}
	host := os.Getenv("POSTHOG_HOST")
	if host == "" {
		return nil, fmt.Errorf("POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured")
	}

	processor, err := posthogotel.NewSpanProcessor(ctx, apiKey, posthogotel.WithHost(host))
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

func (c *Conversation) chatCompletion(ctx context.Context, client openai.Client, params openai.ChatCompletionNewParams) (*openai.ChatCompletion, error) {
	input, _ := json.Marshal(params.Messages)
	tracer := otel.Tracer("weather-assistant")
	ctx, span := tracer.Start(ctx, "gen_ai.chat.completion")
	defer span.End()
	span.SetAttributes(
		attribute.String("$ai_session_id", c.ThreadID),
		attribute.String("posthog.distinct_id", c.UserID),
		attribute.String("gen_ai.operation.name", "chat"),
		attribute.String("gen_ai.provider.name", "openai"),
		attribute.String("gen_ai.request.model", model),
		attribute.String("gen_ai.input.messages", string(input)),
		attribute.String("server.address", "api.openai.com"),
	)

	response, err := client.Chat.Completions.New(ctx, params)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return nil, err
	}
	output, _ := json.Marshal(response.Choices)
	span.SetAttributes(
		attribute.String("gen_ai.output.messages", string(output)),
		attribute.Int("gen_ai.usage.input_tokens", int(response.Usage.PromptTokens)),
		attribute.Int("gen_ai.usage.output_tokens", int(response.Usage.CompletionTokens)),
	)
	return response, nil
}

// Ask answers one question, running the tool if the model asks for it.
func (c *Conversation) Ask(ctx context.Context, client openai.Client, question string) (string, error) {
	tracer := otel.Tracer("weather-assistant")
	ctx, turnSpan := tracer.Start(ctx, "gen_ai.turn")
	defer turnSpan.End()
	turnSpan.SetAttributes(
		attribute.String("$ai_session_id", c.ThreadID),
		attribute.String("posthog.distinct_id", c.UserID),
	)

	c.messages = append(c.messages, openai.UserMessage(question))

	response, err := c.chatCompletion(ctx, client, openai.ChatCompletionNewParams{
		Model:             model,
		Messages:          c.messages,
		Tools:             tools,
		ParallelToolCalls: openai.Bool(false),
	})
	if err != nil {
		return "", err
	}
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
	_, toolSpan := tracer.Start(ctx, "gen_ai.tool.get_weather")
	toolSpan.SetAttributes(
		attribute.String("$ai_session_id", c.ThreadID),
		attribute.String("posthog.distinct_id", c.UserID),
		attribute.String("gen_ai.tool.name", "get_weather"),
	)
	result := getWeather(args.Location)
	toolSpan.End()

	c.messages = append(c.messages, message.ToParam())
	c.messages = append(c.messages, openai.ToolMessage(result, call.ID))

	followup, err := c.chatCompletion(ctx, client, openai.ChatCompletionNewParams{
		Model:             model,
		Messages:          c.messages,
		Tools:             tools,
		ParallelToolCalls: openai.Bool(false),
	})
	if err != nil {
		return "", err
	}
	answer := followup.Choices[0].Message.Content
	c.messages = append(c.messages, openai.AssistantMessage(answer))
	return answer, nil
}

func main() {
	ctx := context.Background()
	provider, err := setupTracing(ctx)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return
	}
	defer func() {
		if err := provider.Shutdown(context.Background()); err != nil {
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
