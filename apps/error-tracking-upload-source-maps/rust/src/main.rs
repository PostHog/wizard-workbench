use std::io::Error;

#[tokio::main]
async fn main() {
    let client = posthog_rs::client((
        "phc_raG2H9V246hkNZk6K89DZGG98qQyPrKKlicifGlpOXA",
        "https://internal-c.posthog.com",
    ))
    .await;

    let error = Error::other("hello from rust-app");
    let _ = client.capture_exception(&error).await;

    println!("Source Map Example (Rust)");
}
