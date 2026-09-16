# Replay Vision setup — Artisan Ceramics

This run could not finish turning on Replay Vision. Every step that needed to
talk to PostHog's replay/scanner API was rejected by the MCP connection for
missing permission scopes, so **no recordings are being captured yet and no
scanners were created.** Here's exactly what happened and what's needed to
unblock it.

## Recording status: not yet live

The client-side code is ready — `instrumentation-client.ts` no longer disables
session recording (the `disable_session_recording: true` override was removed
from the `posthog.init(...)` call).

However, session replay also needs to be turned on for the project itself
("Record user sessions" under **Settings → Session replay**), and that call
(`products-enable`) was rejected:

> missing the required scope(s): `product_enablement:write`

**Until this is turned on, no sessions will be recorded**, regardless of the
client-side fix.

**Follow-up needed (pick one):**
- Reconnect/reauthorize the PostHog MCP connection with `product_enablement:write`, or
- Manually enable it in the app: [Session replay settings](https://us.posthog.com/project/483112/settings/environment-replay)

## Scanners: none created (all blocked)

Three scanners were planned for this checkout/shopping flow, but each attempt
to create or even list scanners was rejected for missing scopes:

- `vision-scanners-list` → missing `replay_scanner:read`
- `vision-scanners-create` → missing `replay_scanner:write`, `session_recording:read`

Since recordings aren't flowing yet either (see above), these scanners would
have nothing to watch even if creation succeeded — but the plan is fully
scoped and ready to run the moment permissions are fixed:

| Scanner | Watches | Scope | Status |
|---|---|---|---|
| **Broken checkout** | Payment-declined alert not clearing/showing, "Place order" doing nothing, order confirmation never appearing, cart items/total failing to render, "Proceed to checkout" link not navigating | `/cart` and `/checkout` pages only | Not created — blocked |
| **Checkout frustration** | Rage clicks; retrying the card field after a decline, re-submitting checkout, hunting for cart quantity/remove controls, searching for product details before adding to cart | Rage-click events, sitewide | Not created — blocked |
| **Ceramics shopper session summaries** | Plain-language summary of what each shopper did (browsing products, cart, checkout, order, payment) | Sampled sessions, sitewide | Not created — blocked |

None of these were run through the size/cost gut-check (`vision-scanners-estimate-create`
+ `vision-quota-retrieve`) since that tool is also scope-gated — so no credit
estimates are available yet. That check should run before actual creation
once scopes are restored.

## What's needed to finish this

1. Reconnect/reauthorize the PostHog MCP connection with these scopes:
   `product_enablement:write`, `replay_scanner:read`, `replay_scanner:write`,
   `session_recording:read` (and `llm_skill:read` if scanner skills should be
   reloaded).
2. Re-run: enable session replay recording, then create the three scanners
   above using the specs already worked out (available in this run's task
   handoffs).
3. Run the cost gut-check before each scanner is created.

## Where results will appear

Once replay is recording and scanners are created, everything shows up on the
[Replay vision page](https://us.posthog.com/project/483112/replay/vision) in
PostHog — first observations arrive as new recordings complete and get
scanned.
