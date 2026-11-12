require "logger"
require "mcp"
require "posthog/mcp"

PostHog::Logging.logger = Logger.new($stderr)
posthog = PostHog::Client.new(
  api_key: ENV["POSTHOG_PROJECT_TOKEN"],
  host: ENV["POSTHOG_HOST"]
)
at_exit { posthog.shutdown }

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
PostHog::MCP.instrument(server, posthog)
MCP::Server::Transports::StdioTransport.new(server).open
