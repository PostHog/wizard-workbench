use std::sync::Arc;

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
    let (Ok(token), Ok(host)) = (
        std::env::var("POSTHOG_PROJECT_TOKEN"),
        std::env::var("POSTHOG_HOST"),
    ) else {
        eprintln!("PostHog MCP analytics disabled: set POSTHOG_PROJECT_TOKEN and POSTHOG_HOST");
        Notes.serve(rmcp::transport::stdio()).await?.waiting().await?;
        return Ok(());
    };
    let posthog = Arc::new(posthog::client((token.as_str(), host.as_str())).await);
    let server = posthog::mcp::instrument(Notes, posthog.clone());

    server.serve(rmcp::transport::stdio()).await?.waiting().await?;
    posthog.shutdown().await;
    Ok(())
}
