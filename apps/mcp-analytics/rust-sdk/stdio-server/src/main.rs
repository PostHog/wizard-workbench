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

fn posthog_env(name: &str) -> Option<String> {
    let value = std::env::var(name).ok().filter(|value| !value.is_empty());

    if value.is_none() && cfg!(debug_assertions) {
        panic!(
            "{name} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {name} is configured"
        );
    }

    value
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let (Some(token), Some(host)) = (
        posthog_env("POSTHOG_PROJECT_TOKEN"),
        posthog_env("POSTHOG_HOST"),
    ) else {
        Notes.serve(rmcp::transport::stdio()).await?.waiting().await?;
        return Ok(());
    };
    let posthog = Arc::new(posthog_rs::client((token.as_str(), host.as_str())).await);
    let server = posthog_rs::mcp::instrument(Notes, posthog.clone());

    server.serve(rmcp::transport::stdio()).await?.waiting().await?;
    posthog.shutdown().await;
    Ok(())
}
