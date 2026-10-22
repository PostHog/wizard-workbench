# Replay Vision setup report

> ⚠️ **Needs your attention**
> - A project administrator must enable **Record user sessions** in **Settings → Session replay**, or grant this connection `product_enablement:write` and rerun the enablement step.
> - Grant this connection `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read`, then rerun the scanner steps so their duplicate checks, credit estimates, quota checks, and creation can complete.

## What is recording

Session Replay recording is **not yet confirmed enabled**. No application code was changed during these Replay Vision steps. Once an administrator enables session recording, new web sessions can be recorded; do not expect Replay Vision observations until recordings complete.

## Replay Vision scanners

No scanners were created or updated. The connection does not have the required Replay Vision or recording-read permissions, so the scanner inventory, quota, and estimates could not be accessed. Consequently, **no scanner credits are currently being spent**, and each proposed scanner’s exact monthly credit estimate is **unavailable until the required estimate call can run**.

| Scanner | Watches | Query scope | Estimated monthly credits | Status |
| --- | --- | --- | --- | --- |
| **Ceramic order failures** | Checkout form submission failures, payment-declined states, an unresponsive **Place order** action, and orders that never reach confirmation. | Recordings whose `$current_url` contains `/checkout`; this covers checkout and its success path. Planned monitor sampling rate: 50%. | Not available — estimate and quota checks are permission-blocked. | Deferred |
| **Artisan Ceramics checkout frustration** | Repeated difficulty adding products to cart, moving from cart to checkout, filling email/card fields, retrying a declined payment, or placing an order. | `$rageclick`-only recordings query, with no URL or other filter. Planned monitor sampling rate: 100%. | Not available — estimate and quota checks are permission-blocked. | Deferred |
| **Ceramics shopper session summaries** | A short summary of what shoppers tried to do, what they did across shop, products, cart, checkout, and orders, and how the session ended. | All recordings (`RecordingsQuery`), without an additional filter. Planned summarizer sampling rate: 10%. | Not available — estimate and quota checks are permission-blocked. | Deferred |

All three proposed scanners use `gemini-3-flash-preview`. The two monitors and the session summarizer are deferred—not skipped—because this is a web storefront with a complete shopping and checkout surface, but the current connection cannot perform the required Replay Vision checks or create the scanners.

## Where to look

After session recording is enabled and the scanners are created, open the **Replay Vision** page in PostHog. The first observations will appear there as newly recorded sessions finish processing. Until then, there will be no scanner observations to review.
