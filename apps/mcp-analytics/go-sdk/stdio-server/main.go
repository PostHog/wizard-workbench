package main

import (
	"context"
	"log"
	"os"

	"github.com/modelcontextprotocol/go-sdk/mcp"
	posthog "github.com/posthog/posthog-go"
	"github.com/posthog/posthog-go/posthogmcp"
	"github.com/posthog/posthog-go/posthogmcpsdk"
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
	client, err := posthog.NewWithConfig(os.Getenv("POSTHOG_PROJECT_TOKEN"), posthog.Config{
		Endpoint: os.Getenv("POSTHOG_HOST"),
	})
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	server := mcp.NewServer(&mcp.Implementation{Name: "wb-go-stdio-server", Version: "0.1.0"}, nil)
	posthogmcpsdk.Instrument(server, posthogmcp.New(client),
		posthogmcpsdk.WithServerInfo("wb-go-stdio-server", "0.1.0"),
	)
	mcp.AddTool(server, &mcp.Tool{Name: "add_note", Description: "Store a note"}, addNote)
	if err := server.Run(context.Background(), &mcp.StdioTransport{}); err != nil {
		log.Fatal(err)
	}
}
