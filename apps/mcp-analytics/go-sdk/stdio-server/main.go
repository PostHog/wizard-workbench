package main

import (
	"context"
	"log"

	"github.com/modelcontextprotocol/go-sdk/mcp"
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
	mcp.AddTool(server, &mcp.Tool{Name: "add_note", Description: "Store a note"}, addNote)
	if err := server.Run(context.Background(), &mcp.StdioTransport{}); err != nil {
		log.Fatal(err)
	}
}
