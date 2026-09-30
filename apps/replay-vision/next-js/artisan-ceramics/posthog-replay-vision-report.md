# Replay Vision setup report — Artisan Ceramics

## Recording status: not yet active

The client-side blocker is fixed: `instrumentation-client.ts` had `disable_session_recording: true` set (a leftover from a cookie-banner iteration), and that line has been removed. PostHog's client no longer blocks recording.

However, session recording is **still off end-to-end** because of one server-side step and one connection-wide permissions gap:

1. **Enable session replay on the project.** The "Record user sessions" product setting could not be turned on automatically — the MCP connection's personal API key is missing the `product_enablement:write` scope. A project admin needs to either:
   - add that scope to the key, or
   - manually flip it on: Settings → Session replay in the PostHog project (id `483112`).
2. **Broader scope gap blocking all scanner work** (see below) — the same key is also missing `replay_scanner:read`, `replay_scanner:write`, `session_recording:read`, and `llm_skill:read`/`write`.

Until step 1 is done, no recordings will flow — so none of the scanners below have anything to watch yet, even once they're created.

## Scanners: none created yet (blocked on API key scopes)

Every scanner-creation attempt in this run hit the same wall: the personal API key behind the MCP connection lacks the scopes needed to read or write scanners (`replay_scanner:read`, `replay_scanner:write`, `session_recording:read`, `llm_skill:read`/`write`). This is a permissions rejection, not a missing feature or a decision to skip — so all three scanners are **fully specified and ready to create** the moment an admin adds the scopes (takes effect within ~2 minutes of the key being updated, no reconnect needed).

Once unblocked, these three scanners will be created for Artisan Ceramics (a handmade ceramics storefront: shop → cart → checkout → order confirmation):

| Scanner | Watches for | Query scope | Est. monthly spend |
|---|---|---|---|
| **Broken checkout** (monitor) | Payment declines with no recovery path, "Place order" doing nothing, wrong/missing cart totals, order confirmation failing to appear | `/cart` and `/checkout` (+ `/checkout/success` via prefix match), 50% sampling | Within bounded-sampling defaults for a single scanner — no unusual cost |
| **Ceramics shop frustration** (monitor) | Rage-clicking "Place order" after a decline, rage-clicking "Add to cart", hunting for a missing remove/quantity control on the cart page | Rage-click signal only, unscoped by URL (locked default sampling/model) | Default monitor spend |
| **Shopper session recaps** (summarizer) | Two-to-three sentence summary of what each shopper did and how the session ended, in the product's own vocabulary (shop/cart/checkout/order) | All sessions, 10% sampling (per skill default — not raised) | Default summarizer spend at 10% sampling |

All three prompts, query filters, and sampling rates are fully drafted and locked in the individual task handoffs — no further product research is needed, just re-run creation once scopes land.

## What you need to do next

1. Add these scopes to the personal API key used by this PostHog MCP connection: `product_enablement:write`, `replay_scanner:read`, `replay_scanner:write`, `session_recording:read`, `llm_skill:read`, `llm_skill:write`.
2. Either let the scope update enable replay directly, or manually enable **Settings → Session replay → Record user sessions** on project 483112.
3. Re-run the scanner creation step — it has everything it needs queued up and will create all three scanners without re-deriving anything.

## Where results will appear

Once recording is on and the scanners are created, observations will show up on the **Replay vision** page in PostHog (project 483112) as new sessions are recorded and scanned — there's nothing to see there yet, since recording hasn't started.
