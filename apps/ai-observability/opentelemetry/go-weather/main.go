// Weather assistant on the official OpenAI Go SDK. The model may call the
// registered get_weather tool before answering, so one question is either one
// model call or two with a tool execution between them.
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"time"

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

// Ask answers one question, running the tool if the model asks for it.
func (c *Conversation) Ask(ctx context.Context, client openai.Client, question string) (string, error) {
	turnCtx := posthog.WithRequestContext(ctx, posthog.RequestContext{
		DistinctId: c.UserID,
		Properties: posthog.Properties{
			"$ai_session_id": c.ThreadID,
		},
	})
	tracer := otel.Tracer("weather-assistant")
	turnCtx, turnSpan := tracer.Start(turnCtx, "gen_ai.turn", trace.WithAttributes(
		attribute.String("gen_ai.operation.name", "chain"),
	))
	defer turnSpan.End()

	c.messages = append(c.messages, openai.UserMessage(question))
	input, _ := json.Marshal(c.messages)
	generationCtx, generationSpan := tracer.Start(turnCtx, "gen_ai.chat.completions", trace.WithAttributes(
		attribute.String("gen_ai.operation.name", "chat"),
		attribute.String("gen_ai.provider.name", "openai"),
		attribute.String("gen_ai.request.model", model),
		attribute.String("gen_ai.input.messages", string(input)),
		attribute.String("server.address", "api.openai.com"),
	))
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
	output, _ := json.Marshal(response.Choices)
	generationSpan.SetAttributes(
		attribute.String("gen_ai.output.messages", string(output)),
		attribute.Int64("gen_ai.usage.input_tokens", int64(response.Usage.PromptTokens)),
		attribute.Int64("gen_ai.usage.output_tokens", int64(response.Usage.CompletionTokens)),
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
	_, toolSpan := tracer.Start(turnCtx, "gen_ai.tool.get_weather", trace.WithAttributes(
		attribute.String("gen_ai.operation.name", "tool"),
		attribute.String("gen_ai.tool.name", "get_weather"),
		attribute.String("gen_ai.input.messages", call.Function.Arguments),
	))
	result := getWeather(args.Location)
	toolOutput, _ := json.Marshal(map[string]string{"content": result})
	toolSpan.SetAttributes(attribute.String("gen_ai.output.messages", string(toolOutput)))
	toolSpan.End()

	c.messages = append(c.messages, message.ToParam())
	c.messages = append(c.messages, openai.ToolMessage(result, call.ID))

	input, _ = json.Marshal(c.messages)
	followupCtx, followupSpan := tracer.Start(turnCtx, "gen_ai.chat.completions", trace.WithAttributes(
		attribute.String("gen_ai.operation.name", "chat"),
		attribute.String("gen_ai.provider.name", "openai"),
		attribute.String("gen_ai.request.model", model),
		attribute.String("gen_ai.input.messages", string(input)),
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
		return "", err
	}
	output, _ = json.Marshal(followup.Choices)
	followupSpan.SetAttributes(
		attribute.String("gen_ai.output.messages", string(output)),
		attribute.Int64("gen_ai.usage.input_tokens", int64(followup.Usage.PromptTokens)),
		attribute.Int64("gen_ai.usage.output_tokens", int64(followup.Usage.CompletionTokens)),
	)
	followupSpan.End()
	answer := followup.Choices[0].Message.Content
	c.messages = append(c.messages, openai.AssistantMessage(answer))
	return answer, nil
}

func setupTracing(ctx context.Context) *sdktrace.TracerProvider {
	provider := sdktrace.NewTracerProvider(sdktrace.WithResource(sdkresource.NewWithAttributes("",
		attribute.String("service.name", "weather-assistant"),
	)))
	apiKey := os.Getenv("POSTHOG_API_KEY")
	host := os.Getenv("POSTHOG_HOST")

	if apiKey == "" || host == "" {
		if os.Getenv("GO_ENV") != "production" {
			missing := "POSTHOG_API_KEY"
			if host == "" {
				missing = "POSTHOG_HOST"
			}
			fmt.Fprintf(os.Stderr, "%s variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once %s is configured\n", missing, missing)
		}
	} else {
		processor, err := posthogotel.NewSpanProcessor(ctx, apiKey, posthogotel.WithHost(host))
		if err != nil {
			fmt.Fprintf(os.Stderr, "PostHog AI Observability initialization failed: %v\n", err)
		} else {
			provider.RegisterSpanProcessor(processor)
		}
	}

	otel.SetTracerProvider(provider)
	return provider
}

func main() {
	ctx := context.Background()
	provider := setupTracing(ctx)
	defer func() {
		flushCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := provider.Shutdown(flushCtx); err != nil {
			fmt.Fprintln(os.Stderr, "PostHog AI Observability shutdown failed:", err)
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
			os.Exit(1)
		}
		fmt.Println(answer)
	}
}
