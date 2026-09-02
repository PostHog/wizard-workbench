# PostHog Replay Vision — Artisan Ceramics

## What's recording

Session replay is **almost live** — one manual step remains.

The client-side code was fixed: `disable_session_recording: true` was removed from `instrumentation-client.ts`. That flag was explicitly blocking the SDK from recording. The code is now clean.

**Action required:** Enable recording server-side in PostHog:  
Settings → Session replay → **Record user sessions** → toggle on.

Once that toggle is on, recordings will start flowing immediately — no further code changes needed.

---

## Scanners

All three scanners were fully designed and are ready to create, but could not be created automatically because the PostHog API key used by this run is missing the `replay_scanner:read` and `replay_scanner:write` scopes (and `session_recording:read`). You will need to either re-authenticate the PostHog MCP connection with those scopes, or create each scanner manually in PostHog under **Session Replay → Replay vision**.

---

### 1. Broken checkout — monitor scanner

**What it watches:** Every recording where the user visited `/cart`, `/checkout`, or `/checkout/success`.

**What it flags:**
- Payment declined alert appearing after card submission
- "Place order" button doing nothing or silently failing
- Order confirmation page failing to load or showing an error
- Cart items or totals not rendering
- Form fields not accepting input

**To create manually:**
- Name: `Broken checkout`
- Type: monitor
- Sampling rate: 0.5 (50% of matching sessions)
- Model: `gemini-3-flash-preview`
- URL filter: `$current_url` icontains `/checkout` (covers `/checkout` and `/checkout/success`); optionally also include `/cart`

**Estimated monthly credit spend:** ~0.5 × sessions touching checkout.

---

### 2. Ceramics checkout frustration — monitor scanner

**What it watches:** Any recording containing a rage click event.

**What it flags:** Clear signs the user got stuck — repeated clicks on an unresponsive element, re-entering the same card number, hammering "Place order" after a payment error, hunting for a way to edit cart items, or abandoning the checkout form after a validation failure.

**To create manually — full payload:**

```json
{
  "name": "Ceramics checkout frustration",
  "scanner_type": "monitor",
  "scanner_config": {
    "prompt": "Watch this session for clear signs the user got stuck or frustrated: repeatedly clicking the same element, hammering a button that isn't responding, retrying the same action over and over, visibly hunting for something they can't find, or abandoning a flow partway through. In this product that especially means: hammering the Place order button after seeing the payment declined error, re-entering the same card number into the card field repeatedly, clicking Proceed to checkout multiple times with no visible response, hunting for a way to remove or change items in the cart, or abandoning the checkout form partway through after a validation failure. Only flag genuine struggle you can see – not normal browsing or a single mis-click. For each: what they were trying to do, where they got stuck, and the URL.\n\nArtisan Ceramics is a small ceramics storefront where users browse ceramic pieces, add them to their cart, and complete a purchase through a one-page checkout form."
  },
  "query": {
    "kind": "RecordingsQuery",
    "events": [{ "id": "$rageclick", "type": "events" }]
  },
  "sampling_rate": 1.0,
  "model": "gemini-3-flash-preview"
}
```

**Estimated monthly credit spend:** 1.0 × sessions with rage clicks (typically a small fraction of total sessions).

---

### 3. Artisan Ceramics session summaries — summarizer scanner

**What it watches:** All recordings (unscoped — every session).

**What it produces:** A 2–3 sentence plain-English summary of each session: what the user was trying to do, what they did, and how it ended — using the product's own vocabulary (browse, cart, checkout, place order).

**To create manually:**
- Name: `Artisan Ceramics session summaries`
- Type: summarizer
- Sampling rate: 0.1 (10% of all sessions)
- Model: `gemini-3-flash-preview`
- Query: `RecordingsQuery` with no filters (all recordings)
- Prompt:

```
Summarize what the user did in this session in two or three sentences: what they were trying to accomplish, the main things they did, and how the session ended. Use the product's own vocabulary: shop, products, cart, checkout, place order; browsing pieces, adding to cart, proceeding to checkout, completing a purchase.

Artisan Ceramics is an online shop where customers browse handcrafted ceramic pieces, add them to their cart, and place orders.
```

**Estimated monthly credit spend:** 0.1 × all sessions.

---

## What was skipped or deferred

Nothing was skipped by choice. All three scanners apply to this project and are fully specified. They could not be created automatically because the MCP API key lacks the required scopes (`replay_scanner:read`, `replay_scanner:write`, `session_recording:read`). Re-authenticating the PostHog MCP with those scopes would allow a re-run to create them automatically.

---

## Where to see results

Once recording is enabled and sessions are flowing, head to:

**[Session Replay → Replay vision](https://us.posthog.com/project/483112/replay/vision)**

Summaries and flagged sessions will appear there as new recordings complete. The summarizer (10% sample) will build up context quickly; the two monitor scanners will surface individual flagged sessions as soon as matching recordings arrive.
