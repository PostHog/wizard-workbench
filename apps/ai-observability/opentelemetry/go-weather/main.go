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
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
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
	c.messages = append(c.messages, openai.UserMessage(question))
	ctx = c.requestContext(ctx)
	turnAttributes := append(c.observabilityAttributes(), attribute.String("gen_ai.operation.name", "chat"))
	turnCtx, turnSpan := otel.Tracer("go-weather").Start(ctx, "gen_ai.chat.turn", trace.WithAttributes(turnAttributes...))
	defer turnSpan.End()

	generationCtx, generationSpan := c.startGeneration(turnCtx)
	response, err := client.Chat.Completions.New(generationCtx, openai.ChatCompletionNewParams{
		Model:             model,
		Messages:          c.messages,
		Tools:             tools,
		ParallelToolCalls: openai.Bool(false),
	})
	if err != nil {
		failGeneration(generationSpan, err)
		turnSpan.RecordError(err)
		turnSpan.SetStatus(codes.Error, err.Error())
		return "", err
	}
	message := response.Choices[0].Message
	finishGeneration(generationSpan, message, response.Usage.PromptTokens, response.Usage.CompletionTokens)

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
	result := c.runWeatherTool(turnCtx, call.Function.Arguments, args.Location)

	c.messages = append(c.messages, message.ToParam())
	c.messages = append(c.messages, openai.ToolMessage(result, call.ID))

	followupCtx, followupSpan := c.startGeneration(turnCtx)
	followup, err := client.Chat.Completions.New(followupCtx, openai.ChatCompletionNewParams{
		Model:             model,
		Messages:          c.messages,
		Tools:             tools,
		ParallelToolCalls: openai.Bool(false),
	})
	if err != nil {
		failGeneration(followupSpan, err)
		turnSpan.RecordError(err)
		turnSpan.SetStatus(codes.Error, err.Error())
		return "", err
	}
	answer := followup.Choices[0].Message.Content
	finishGeneration(followupSpan, followup.Choices[0].Message, followup.Usage.PromptTokens, followup.Usage.CompletionTokens)
	c.messages = append(c.messages, openai.AssistantMessage(answer))
	return answer, nil
}

func main() {
	ctx := context.Background()
	provider, err := setupTracing(ctx)
	if err != nil {
		fmt.Fprintln(os.Stderr, "PostHog tracing setup failed:", err)
	} else if provider != nil {
		defer func() {
			if err := provider.Shutdown(context.Background()); err != nil {
				fmt.Fprintln(os.Stderr, "PostHog tracing shutdown failed:", err)
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
			fmt.Fprintln(os.Stderr, err)
			if provider != nil {
				if shutdownErr := provider.Shutdown(context.Background()); shutdownErr != nil {
					fmt.Fprintln(os.Stderr, "PostHog tracing shutdown failed:", shutdownErr)
				}
			}
			os.Exit(1)
		}
		fmt.Println(answer)
	}
}
