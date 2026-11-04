# Replay Vision setup report

> **Deploy this change:** session replay only records from code your users run, so your scanners start when the first recording arrives. Deploy `instrumentation-client.ts`, and set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in production. Both required public environment variables are currently missing from the local environment.

Session replay is enabled in PostHog, but there are currently **0 recordings** and **0 scannable sessions**. The scanners cost nothing until recordings arrive. Once the deployed app receives traffic and its first recording completes, Replay Vision can begin producing observations. If people already use the app, the version they run may not yet include the PostHog SDK configuration.

The PostHog SDK was already present; this run enabled its default recording behavior by removing the client-side override that disabled session recording.

## What Replay Vision watches

- **Artisan Ceramics checkout problems** — an enabled monitor that watches **all recordings** for checkout breakage: declined payments, blocked email or card fields, an unresponsive **Place order** button, missing cart contents or totals, and missing order confirmation. It uses 1% sampling and is estimated at **0 monthly credits** at current volume. It is currently paused because its **Free credits only** pool is exhausted; it will resume when free credits are available. To scan using paid credits instead, turn off **Free credits only** in the scanner settings.
- **Checkout outcome** — a disabled classifier that watches **all recordings** of the path from adding a product to cart, through checkout, to order confirmation. It labels sessions as **completed**, **abandoned**, **blocked-by-error**, **confused**, or **not-attempted**. It uses 1% sampling with Free credits only and is estimated at **0 monthly credits** at current volume. It is disabled pending a prompt preview against a real recording, and it is also currently unable to use free credits because that pool is exhausted. After recordings arrive, review a real-session preview, then enable it; rerun setup after traffic arrives to resize sampling to observed volume.
- **Artisan Ceramics session summaries** — an enabled summarizer that watches **all recordings** and summarizes shopper behavior across product browsing, the shop, cart, checkout, and order placement. It uses 10% comprehensive sampling and is estimated at **0 monthly credits** at current volume. Its configured rate is **5 credits per observation** once it starts scanning; it is allowed to use paid credits (`Free credits only` is off). You may turn on Free credits only in its scanner settings if preferred.

## Existing coverage left unchanged

A legacy **User frustration** scanner remains enabled and overlaps the checkout-problems monitor. It was intentionally left in place; turn it off if you want to avoid duplicated coverage. The previous legacy session-summary coverage was retained and updated as **Artisan Ceramics session summaries**.

## Where to look

Find results on the **Replay Vision** page in PostHog. The first observations arrive as new recordings complete after deployment and traffic reach the configured browser SDK.
