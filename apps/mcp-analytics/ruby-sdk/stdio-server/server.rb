require "mcp"

class AddNote < MCP::Tool
  description "Store a note"
  input_schema(properties: { text: { type: "string" } }, required: ["text"])

  NOTES = []

  def self.call(text:, server_context: nil)
    NOTES << text
    MCP::Tool::Response.new([{ type: "text", text: "#{NOTES.size} notes" }])
  end
end

server = MCP::Server.new(name: "wb-ruby-stdio-server", version: "0.1.0", tools: [AddNote])
MCP::Server::Transports::StdioTransport.new(server).open
