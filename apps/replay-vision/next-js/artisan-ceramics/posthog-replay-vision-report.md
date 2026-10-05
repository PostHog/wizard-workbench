# Replay Vision setup — Artisan Ceramics

## Recording status: action needed

The client-side blocker is fixed: `instrumentation-client.ts` had
`disable_session_recording: true` left over from testing a cookie banner —
that's been removed, so the SDK will record once the server allows it.

However, **session replay is not yet recording**, and **no scanners were
created**. Every step that needed to talk to PostHog's replay/scanner APIs
hit the same wall: the personal API key behind this MCP connection is
missing required scopes. Specifically:

- `product_enablement:write` — needed to turn on "Record user sessions" for
  the project.
- `replay_scanner:read` / `replay_scanner:write` / `session_recording:read` —
  needed to list, estimate, and create scanners.
- `llm_skill:read` — needed to load one scanner's setup instructions.

**To unblock:** someone with project-admin access needs to add those scopes
to the API key (or connect a key that already has them), then re-run this
setup. Nothing else is blocking it — once the key has the right scopes, the
three scanners below are fully specified and ready to create as-is.

### Immediate manual fallback

If you don't want to wait on the API key, you can turn on recording by hand:
**Settings → Session replay → Record user sessions** for project 483112.
That alone will start producing recordings even before the scanners exist.

## Scanners (ready to create, pending access)

Three scanners were researched and fully specified against this codebase
(a Next.js shop selling handmade mugs, bowls, and vases, with a
browse → cart → checkout → confirmation flow). None could actually be
created due to the permissions gap above. Once access is fixed, these can be
created directly with no further research:

### 1. Broken checkout (monitor)
- **Watches:** the cart and checkout pages (`/cart`, `/checkout`, and
  `/checkout/success`) for the payment step rejecting a card with no retry
  path, the cart total not matching the items in it, the order confirmation
  never appearing after "Place order," or the form silently not submitting.
- **Scope:** sessions where `$current_url` matches `/cart` or `/checkout`.
- **Sampling:** 50% of matching sessions, `gemini-3-flash-preview`.
- **Estimated cost:** not available — the credit-estimate call
  (`vision-scanners-estimate`) is also gated by the missing scopes, so no
  number could be pulled. Re-run the estimate before creating.

### 2. Checkout frustration (monitor)
- **Watches:** rage-click signals anywhere in the app — repeatedly clicking
  "Add to cart" when the cart doesn't update, hammering "Place order" after
  a declined test card, hunting for a way to edit/remove a cart item, or
  looking for an order number on the confirmation page.
- **Scope:** sessions with a `$rageclick` event (no URL filter — kept
  disjoint from the Broken Checkout scanner's scope).
- **Sampling:** 100% of matching sessions, `gemini-3-flash-preview`.
- **Estimated cost:** not available, same reason as above.

### 3. Ceramics shopper session summaries (summarizer)
- **Watches:** every recorded session, producing a 2–3 sentence summary of
  what the shopper was trying to do, what they did, and how the session
  ended, in the product's own vocabulary (mugs, bowls, vases, cart,
  checkout).
- **Scope:** all recordings.
- **Sampling:** 10%, `gemini-3-flash-preview`.
- **Estimated cost:** not available, same reason as above.

## Where results will appear

Once the API key's scopes are fixed and the scanners above are created
(or recording is turned on manually), results show up on the
[Replay Vision page](https://us.posthog.com/project/483112/replay) in
PostHog. The first observations — recordings, then scanner findings — will
start appearing as new sessions are recorded and processed; there's nothing
to configure further on the code side.

## Summary

| Item | Status |
|---|---|
| Client-side recording flag | Fixed — `disable_session_recording` removed |
| Server-side "Record user sessions" | Blocked — missing `product_enablement:write` scope |
| Broken checkout scanner | Specified, not created — missing `replay_scanner:*` scopes |
| Checkout frustration scanner | Specified, not created — missing `replay_scanner:*` scopes |
| Session summaries scanner | Specified, not created — missing `replay_scanner:*`/`llm_skill:read` scopes |

**Next step for the user:** grant the listed scopes to the MCP connection's
API key (or enable replay manually in Settings), then re-run this wizard to
finish creating the three scanners above.
