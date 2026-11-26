package main

import (
	"context"
	"log"
	"os"

	"github.com/modelcontextprotocol/go-sdk/mcp"
	"github.com/posthog/posthog-go/posthogmcpsdk/v2"
	posthog "github.com/posthog/posthog-go/v2"
	"github.com/posthog/posthog-go/v2/posthogmcp"
)

type AddNoteInput struct {
	Text string `json:"text" jsonschema:"the note text"`
}

type AddNoteOutput struct {
	Count int `json:"count"`
}

var notes []string

func addNote(ctx context.Context, req *mcp.CallToolRequest, in AddNoteInput) (*mcp.CallToolResult, AddNoteOutput, error) {
	notes = append(notes, in.Text)
	return nil, AddNoteOutput{Count: len(notes)}, nil
}

func main() {
	server := mcp.NewServer(&mcp.Implementation{Name: "wb-go-stdio-server", Version: "0.1.0"}, nil)

	projectToken := os.Getenv("POSTHOG_PROJECT_TOKEN")
	posthogHost := os.Getenv("POSTHOG_HOST")
	if projectToken == "" {
		log.Print("POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured")
	} else if posthogHost == "" {
		log.Print("POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured")
	} else {
		client, err := posthog.NewWithConfig(projectToken, posthog.Config{Endpoint: posthogHost})
		if err != nil {
			log.Printf("PostHog MCP analytics is disabled: %v", err)
		} else {
			defer client.Close()
			posthogmcpsdk.Instrument(server, posthogmcp.New(client),
				posthogmcpsdk.WithServerInfo("wb-go-stdio-server", "0.1.0"),
			)
		}
	}

	mcp.AddTool(server, &mcp.Tool{Name: "add_note", Description: "Store a note"}, addNote)
	if err := server.Run(context.Background(), &mcp.StdioTransport{}); err != nil {
		log.Fatal(err)
	}
}
