package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	posthog "github.com/posthog/posthog-go/v2"
	posthogotel "github.com/posthog/posthog-go/otel/v2"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	sdkresource "go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/trace"
)

func setupTracing(ctx context.Context) (*sdktrace.TracerProvider, error) {
	apiKey, hasAPIKey := os.LookupEnv("POSTHOG_API_KEY")
	host, hasHost := os.LookupEnv("POSTHOG_HOST")
	if !hasAPIKey || apiKey == "" {
		warnMissingPostHogConfig("POSTHOG_API_KEY")
		return nil, nil
	}
	if !hasHost || host == "" {
		warnMissingPostHogConfig("POSTHOG_HOST")
		return nil, nil
	}

	processor, err := posthogotel.NewSpanProcessor(ctx, apiKey, posthogotel.WithHost(host))
	if err != nil {
		return nil, err
	}

	provider := sdktrace.NewTracerProvider(
		sdktrace.WithResource(sdkresource.NewWithAttributes(
			"",
			attribute.String("service.name", "go-weather"),
		)),
		sdktrace.WithSpanProcessor(processor),
	)
	otel.SetTracerProvider(provider)
	return provider, nil
}

func warnMissingPostHogConfig(variable string) {
	if os.Getenv("GO_ENV") != "production" {
		fmt.Fprintf(os.Stderr, "%s variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once %s is configured\n", variable, variable)
	}
}

func (c *Conversation) requestContext(ctx context.Context) context.Context {
	return posthog.WithRequestContext(ctx, posthog.RequestContext{
		DistinctId: c.UserID,
		Properties: posthog.Properties{
			"$ai_session_id": c.ThreadID,
		},
	})
}

func (c *Conversation) observabilityAttributes() []attribute.KeyValue {
	return []attribute.KeyValue{
		attribute.String("$ai_session_id", c.ThreadID),
		attribute.String("posthog.distinct_id", c.UserID),
	}
}

func (c *Conversation) startGeneration(ctx context.Context) (context.Context, trace.Span) {
	input, err := json.Marshal(c.messages)
	if err != nil {
		input = []byte("[]")
	}

	attributes := append(c.observabilityAttributes(),
		attribute.String("gen_ai.operation.name", "chat"),
		attribute.String("gen_ai.provider.name", "openai"),
		attribute.String("gen_ai.request.model", model),
		attribute.String("gen_ai.input.messages", string(input)),
		attribute.String("server.address", "api.openai.com"),
	)
	return otel.Tracer("go-weather").Start(ctx, "gen_ai.chat.completion", trace.WithAttributes(attributes...))
}

func finishGeneration(span trace.Span, message any, promptTokens, completionTokens int64) {
	output, err := json.Marshal(message)
	if err == nil {
		span.SetAttributes(attribute.String("gen_ai.output.messages", string(output)))
	}
	span.SetAttributes(
		attribute.Int64("gen_ai.usage.input_tokens", promptTokens),
		attribute.Int64("gen_ai.usage.output_tokens", completionTokens),
	)
	span.End()
}

func failGeneration(span trace.Span, err error) {
	span.RecordError(err)
	span.SetStatus(codes.Error, err.Error())
	span.End()
}

func (c *Conversation) runWeatherTool(ctx context.Context, arguments string, location string) string {
	attributes := append(c.observabilityAttributes(),
		attribute.String("gen_ai.operation.name", "execute_tool"),
		attribute.String("gen_ai.tool.name", "get_weather"),
		attribute.String("gen_ai.tool.call.arguments", arguments),
	)
	_, span := otel.Tracer("go-weather").Start(ctx, "gen_ai.tool.get_weather", trace.WithAttributes(attributes...))
	result := getWeather(location)
	span.SetAttributes(attribute.String("gen_ai.tool.call.result", result))
	span.End()
	return result
}

