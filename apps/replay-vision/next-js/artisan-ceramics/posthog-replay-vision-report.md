# Replay Vision — Artisan Ceramics

## Recording status: needs one more step

The client is ready — `instrumentation-client.ts` no longer disables session recording (a `disable_session_recording: true` override, left over from cookie-banner work, was removed). Every page view will attempt to record once the server side is confirmed.

That confirmation didn't go through. Every task in this run hit the same wall: **the PostHog MCP connection is missing scopes** (`product_enablement:write`, `replay_scanner:read`/`write`, `session_recording:read`). Nothing about the app or the plan is blocking this — it's a connection permissions issue.

**To fix:** reconnect/reauthorize the PostHog MCP connection with those scopes, or manually turn on session replay in the PostHog app under **Settings → Session replay → Record user sessions**. Until one of those happens, recordings will not flow even though the client is instrumented.

## Scanners: planned, not yet created

Three scanners were scoped for this project but could not be created (same missing-scope issue — `replay_scanner:write` + `session_recording:read`). None exist in PostHog yet; no credit spend has been incurred or estimated. Once the connection is reauthorized, these are ready to create as-is:

**1. Broken checkout** (monitor, sampling rate 0.5)
Watches the cart → checkout flow (`$current_url` contains `/cart` or `/checkout`) for on-screen breakage: the "Place order" button submitting without advancing to the confirmation page, a "Payment declined" message appearing, a cart showing items the shopper didn't add, or the confirmation page failing to load.

**2. Ceramics shop frustration** (monitor, unscoped query on `$rageclick`)
Watches the whole site for rage-click signals — shoppers retrying a declined "Place order," hammering "Add to cart" expecting confirmation, or hunting the cart page for remove/quantity controls that don't exist.

**3. Shopper session recaps** (summarizer, sampling rate 0.1, unscoped)
Summarizes sessions in the shop's own vocabulary: browsing products, adding to cart, proceeding to checkout, placing an order.

Estimated monthly credit spend for all three is unknown — the estimate step (`vision-scanners-estimate-create`) requires the same scopes and was never reached.

## What to do next

1. Reauthorize the PostHog MCP connection (covers all four blocked calls), or manually enable session replay in PostHog settings.
2. Re-run the scanner setup — the three briefs above are fully filled in and ready to submit as-is.
3. Once recording is confirmed on and scanners are created, check the **Replay vision** page in PostHog for observations. Sessions and rage-click flags will start appearing as new recordings complete after that.

## Summary

Nothing is watching your product yet. The app is instrumented and ready — the only gap is a permissions/connection issue on the PostHog side, not the code.
