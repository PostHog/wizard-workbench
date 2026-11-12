# Replay Vision is ready to watch Artisan Ceramics

**Deploy this change:** session replay only records from code your users run, so your scanners start when the first recording arrives. Deploy `instrumentation-client.ts` (merge and release it), and set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in production. Do not include environment files in the deployment change list.

Session Replay is enabled and the project already has **3 recordings in the last 30 days**, so it is recording. Replay Vision scanners can begin scanning—and spending credits—when eligible new recordings complete. The recent estimate found 1 scannable session in 7 days (roughly 4 per month), so current volume is low.

## What Replay Vision watches

- **Artisan Ceramics checkout problems** — an enabled monitor for payment declines, checkout-field issues, the **Place order** action, cart-total problems, and missing order confirmation. It scans all recordings at a 1% sample. The estimator reports 5 credits per observation and 20 credits/month at 100% sampling (current 1% sampling substantially limits that volume). It is currently **paused** because it is restricted to free credits only and the shared free-credit pool is exhausted. It will resume when free credits reset, or someone can turn off **Free credits only** in the scanner settings.
- **Artisan Ceramics checkout outcome** — an enabled classifier that labels recorded sessions as **completed**, **abandoned**, **blocked-by-error**, **confused**, or **not-attempted** across the shopper flow from products and cart through checkout and order confirmation. It intentionally scans all recordings at a 1% sample so non-checkout attempts can be classified. Estimated spend is **0 credits/month** at the current sample, with 5 credits per observation. Like the checkout-problems monitor, it is paused while its free-only pool has no credits; turning off **Free credits only** lets it use the available paid quota.
- **Artisan Ceramics session summaries** — an enabled, unscoped summarizer that produces concise plain-language accounts of shopper sessions: browsing products, adding items to the cart, placing an order, and related shop/cart/checkout behavior. It samples 10% of all recordings. The current estimate is **0 additional credits/month** at this low traffic level. Unlike the other two, it is not restricted to free credits.

## Scope and current constraints

The checkout monitor and classifier use a broad all-recordings scope because observed traffic is low and no checkout-path recordings appeared in the recent sample. This is intentional: the outcome classifier needs to recognize **not-attempted** sessions as well as checkout attempts.

No scanner was skipped. A separate legacy generic **User frustration** scanner belongs to another product and was deliberately left unchanged.

## Where to look

Open [Replay Vision](https://us.posthog.com/project/483112/replay-vision). New observations appear there as new recordings complete. The organization has paid credit quota remaining, but the two free-only checkout scanners need their free credits to reset—or their **Free credits only** setting changed—before they can process observations.

PostHog was already initialized in this app; this run restored the SDK’s default client-side session recording by removing the code-level disable override. After deployment, the app will send new replay recordings for the scanners to inspect.
