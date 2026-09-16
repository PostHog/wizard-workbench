# Replay Vision for Artisan Ceramics

## Recording status: one step still needed

The client-side blocker is fixed. `instrumentation-client.ts` had
`disable_session_recording: true` left over from earlier cookie-banner work —
that line has been removed, so the browser SDK will capture sessions as soon
as recording is turned on for the project.

**Server-side recording is not yet confirmed on.** The wizard's PostHog
connection is missing the `product_enablement:write` OAuth scope, so it
could not call the API that turns on session replay for this project.
To finish this, do one of:

- Reconnect/reauthorize the PostHog MCP connection with `product_enablement:write`
  and re-run the enable step, or
- In the PostHog app, go to **Settings → Session replay** and turn on
  **Record user sessions** yourself.

Until one of those happens, no recordings will exist for any scanner to read.

## Scanners: none created — same missing-scopes issue

Three scanners were planned for this run but none could be created. The
PostHog connection is also missing `replay_scanner:read`, `replay_scanner:write`,
and `session_recording:read`, so every scanner API call (list, cost estimate,
quota check, create) failed before it could run. Nothing was created,
updated, or left in a partial state — so there's no cleanup needed, only a
retry once the connection has the right scopes.

The three scanners are fully specified and ready to create as soon as scopes
are fixed:

**Broken checkout** (monitor, watches for visible breakage)
- Watches recordings on `/checkout` and `/cart` (the shop's only real purchase
  flow: browse → cart → checkout → success)
- Looks for: payment declining without the "Payment declined" message
  showing, cart/order totals showing $0 or a wrong price, "Place order" doing
  nothing after submit, or checkout never advancing to the confirmation page
- Sampling rate 0.5, model gemini-3-flash-preview

**Checkout frustration** (monitor, watches for user frustration signals)
- Scoped to `$rageclick` events, unscoped by URL (by design, to stay
  disjoint from the breakage monitor above)
- Looks for: repeated clicks on "Place order" after a declined-payment alert
  that never clears the card field or disables the button, retrying the same
  declined card with no guidance on what to change, clicking "Add to cart" on
  a specific product but the cart always showing the same fixed two items,
  or hunting for a way to remove/edit a cart item (no such control exists)

**Ceramics shopping session recaps** (summarizer, one summary per session)
- Unscoped — summarizes any session
- Produces a 2-3 sentence recap per session using the store's own vocabulary
  (mugs, bowls, vases, cart, checkout, placing an order)
- Sampling rate 0.1, model gemini-3-flash-preview

None of these have an estimated credit cost yet — the estimate tool also
requires the missing scopes, so cost couldn't be checked before creation.

## Where results will appear

Once recording is confirmed on and the scanners are created, everything
shows up on the **Replay vision** page in the PostHog app. The monitors
(Broken checkout, Checkout frustration) will start flagging moments as new
recordings complete; the summarizer will start producing session recaps on
the same schedule.

## Summary of what's blocking you

This run hit the same wall twice: the PostHog MCP connection is authorized
with a narrower set of scopes than this workflow needs. To unblock everything
above, reauthorize the connection with:

- `product_enablement:write` (turn on session replay)
- `replay_scanner:read`, `replay_scanner:write`, `session_recording:read`
  (list/estimate/create scanners)

Then re-run the enable-replay and scanner-creation steps — all the analysis
and copy work is already done, so those re-runs should be fast.
