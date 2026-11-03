use rmcp::handler::server::wrapper::Parameters;
use rmcp::model::{CallToolResult, ContentBlock, Implementation, ServerCapabilities, ServerConfig};
use rmcp::schemars::{self, JsonSchema};
use rmcp::{tool, tool_handler, tool_router, ServerHandler, ServiceExt};
use serde::Deserialize;

#[derive(Deserialize, JsonSchema)]
struct AddNoteArgs {
    text: String,
}

#[derive(Clone)]
struct Notes;

#[tool_router]
impl Notes {
    #[tool(description = "Store a note")]
    async fn add_note(&self, Parameters(AddNoteArgs { text }): Parameters<AddNoteArgs>) -> CallToolResult {
        CallToolResult::success(vec![ContentBlock::text(format!("stored: {text}"))])
    }
}

#[tool_handler]
impl ServerHandler for Notes {
    fn get_info(&self) -> ServerConfig {
        let capabilities = ServerCapabilities::builder().enable_tools().build();
        ServerConfig::new(capabilities).with_server_info(Implementation::new("wb-rust-stdio-server", "0.1.0"))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    Notes.serve(rmcp::transport::stdio()).await?.waiting().await?;
    Ok(())
}
