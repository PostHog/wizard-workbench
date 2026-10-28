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
		sdktrace.WithSpanProcessor(processor),
	)
	otel.SetTracerProvider(provider)
	return provider, nil
}

func (c *Conversation) observabilityAttributes() []attribute.KeyValue {
	return []attribute.KeyValue{
		attribute.String("$ai_session_id", c.ThreadID),
		attribute.String("posthog.distinct_id", c.UserID),
	}
}

func jsonValue(value any) string {
	encoded, err := json.Marshal(value)
	if err != nil {
		return ""
	}
	return string(encoded)
}

// Ask answers one question, running the tool if the model asks for it.
func (c *Conversation) Ask(ctx context.Context, client openai.Client, question string) (string, error) {
	ctx = posthog.WithRequestContext(ctx, posthog.RequestContext{
		DistinctId: c.UserID,
		Properties: posthog.Properties{
			"$ai_session_id": c.ThreadID,
		},
	})
	tracer := otel.Tracer("weather-assistant")
	turnCtx, turnSpan := tracer.Start(ctx, "gen_ai.chat.turn")
	defer turnSpan.End()

	c.messages = append(c.messages, openai.UserMessage(question))
	turnSpan.SetAttributes(append(c.observabilityAttributes(),
		attribute.String("gen_ai.operation.name", "workflow"),
		attribute.String("gen_ai.input.messages", jsonValue(c.messages)),
	)...)

	generationCtx, generationSpan := tracer.Start(turnCtx, "gen_ai.chat.completion")
	generationSpan.SetAttributes(append(c.observabilityAttributes(),
		attribute.String("gen_ai.operation.name", "chat"),
		attribute.String("gen_ai.provider.name", "openai"),
		attribute.String("gen_ai.request.model", model),
		attribute.String("gen_ai.input.messages", jsonValue(c.messages)),
		attribute.String("gen_ai.tool.definitions", jsonValue(tools)),
		attribute.String("server.address", "api.openai.com"),
	)...)
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
		turnSpan.RecordError(err)
		turnSpan.SetStatus(codes.Error, err.Error())
		return "", err
	}
	generationSpan.SetAttributes(
		attribute.String("gen_ai.output.messages", jsonValue(response.Choices)),
		attribute.Int("gen_ai.usage.input_tokens", int(response.Usage.PromptTokens)),
		attribute.Int("gen_ai.usage.output_tokens", int(response.Usage.CompletionTokens)),
	)
	generationSpan.End()
	message := response.Choices[0].Message

	if len(message.ToolCalls) == 0 {
		c.messages = append(c.messages, openai.AssistantMessage(message.Content))
		turnSpan.SetAttributes(attribute.String("gen_ai.output.messages", jsonValue(response.Choices)))
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

	_, toolSpan := tracer.Start(turnCtx, "gen_ai.tool.get_weather")
	toolSpan.SetAttributes(append(c.observabilityAttributes(),
		attribute.String("gen_ai.operation.name", "execute_tool"),
		attribute.String("gen_ai.tool.name", "get_weather"),
		attribute.String("gen_ai.tool.arguments", call.Function.Arguments),
	)...)
	result := getWeather(args.Location)
	toolSpan.SetAttributes(attribute.String("gen_ai.tool.result", result))
	toolSpan.End()

	c.messages = append(c.messages, message.ToParam())
	c.messages = append(c.messages, openai.ToolMessage(result, call.ID))

	followupCtx, followupSpan := tracer.Start(turnCtx, "gen_ai.chat.completion")
	followupSpan.SetAttributes(append(c.observabilityAttributes(),
		attribute.String("gen_ai.operation.name", "chat"),
		attribute.String("gen_ai.provider.name", "openai"),
		attribute.String("gen_ai.request.model", model),
		attribute.String("gen_ai.input.messages", jsonValue(c.messages)),
		attribute.String("gen_ai.tool.definitions", jsonValue(tools)),
		attribute.String("server.address", "api.openai.com"),
	)...)
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
	followupSpan.SetAttributes(
		attribute.String("gen_ai.output.messages", jsonValue(followup.Choices)),
		attribute.Int("gen_ai.usage.input_tokens", int(followup.Usage.PromptTokens)),
		attribute.Int("gen_ai.usage.output_tokens", int(followup.Usage.CompletionTokens)),
	)
	followupSpan.End()

	answer := followup.Choices[0].Message.Content
	c.messages = append(c.messages, openai.AssistantMessage(answer))
	turnSpan.SetAttributes(attribute.String("gen_ai.output.messages", jsonValue(followup.Choices)))
	return answer, nil
}

func main() {
	ctx := context.Background()
	provider, err := setupTracing(ctx)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return
	}
	defer provider.Shutdown(ctx)

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
